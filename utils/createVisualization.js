// TODO разбить на части

const xlsx = require('xlsx');
const Constants = require('./Constants');
const Deposit = require('../MongoModels/Deposit');
const Well = require('../MongoModels/Well');
const CodeIndex = require('../MongoModels/Code');
const Inclinometry = require('../MongoModels/Inclinometry');
const utilFns = require('./functions');
const Colors = require('./Colors');

const getExcelSheetData = (workbook, sheetName) => {
  return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
};

const getCodesSet = (aLithologyRows) => {
  let codesSet = new Set();
  aLithologyRows.forEach((row) => {
    codesSet.add(row['ЛИТ.КОД']);
  });
  return codesSet;
};

const getLithologyCodes = (codesSet, deposit) => {
  let oCodes = {};
  let index = 0;
  codesSet.forEach((code) => {
    oCodes[code] = new CodeIndex({
      deposit: deposit._id,
      name: code,
      index,
      color: Colors[code]
    });
    index++;
  });
  return oCodes;
};

module.exports = async (fileName, filePath, offset) => {
  try {
    let workbook = xlsx.readFile(filePath);
    let deposit = new Deposit({
      name: fileName,
      offset,
    });
    // проходимся по листу устьев скважин и формируем скважины
    let aWellsHeadRows = getExcelSheetData(workbook, Constants.sheetsNames.wellhead);
    let aWells = aWellsHeadRows.map((row) => {
      return new Well({
        deposit: deposit._id,
        name: row['СКВ'],
        head: {
          x: utilFns.roundFloat(row['X']),
          y: utilFns.roundFloat(row['Y']),
          z: utilFns.roundFloat(row['Z']),
        },
      });
    });
    let oWells = aWells.reduce((res, well) => {
      res[well.name] = well;
      return res;
    }, {});

    let aLithologyRows = getExcelSheetData(workbook, Constants.sheetsNames.lithology);
    let codesSet = getCodesSet(aLithologyRows);
    deposit.rocksCount = codesSet.size;
    let oCodes = getLithologyCodes(codesSet, deposit);
    aLithologyRows.reduce((oWells, row) => {
      let well = oWells[row['СКВ']];
      well.addInterval({
        code: oCodes[row['ЛИТ.КОД']]._id,
        depth_from: row['ОТ'],
        depth_to: row['ДО'],
      });
      return oWells;
    }, oWells);

    let aInclinomertyRows = getExcelSheetData(workbook, Constants.sheetsNames.inclinometry);
    aInclinomertyRows.reduce((oWells, row) => {
      let incl = new Inclinometry({
        azimut: row['АЗИМУТ'],
        zenit: row['УКЛОН'],
        depth: row['ГЛУБИНА СЪЕМКИ'],
      });
      let well = oWells[row['СКВ']];
      well.addInclinometry(incl);
      return oWells;
    }, oWells);

    aWells.forEach((well) => {
      well.inclinometries.forEach((incl) => {
        well.intervals.forEach((interval) => {
          if (incl.isInInterval(interval)) {
            well.addInterval({
              code: interval.code,
              depth_from: interval.depth_from,
              depth_to: incl.getDepth(),
            });
            well.addInterval({
              code: interval.code,
              depth_from: incl.getDepth(),
              depth_to: interval.depth_to,
            });
            well.deleteInterval(interval);
          }
        });
      });

      well.intervals.forEach((interval) => {
        let inclFrom = null;
        let inclTo = null;
        well.inclinometries.some((incl, index, inclinometries) => {
          if (!inclinometries[index + 1]) {
            inclFrom = incl;
            inclTo = null;
            return true;
          }
          if (
            interval.depth_from >= incl.getDepth() &&
            interval.depth_to <= inclinometries[index + 1].getDepth()
          ) {
            inclFrom = incl;
            inclTo = inclinometries[index + 1];
            return true;
          }
        });
        if (well.name === 'GL79') {
          console.log(`from ${interval.depth_from} to ${interval.depth_to}`);
          console.log(`InclFrom ${inclFrom} inclTo ${inclTo}`);
        }
        if (inclTo) {
          interval.azimut =
            inclFrom.getAzimut() +
            ((interval.depth_from - inclFrom.getDepth()) /
              (inclTo.getDepth() - inclFrom.getDepth())) *
              (inclTo.getAzimut() - inclFrom.getAzimut());
        } else {
          interval.azimut = inclFrom.getAzimut();
        }

        if (inclTo) {
          interval.zenit =
            inclFrom.getZenit() +
            ((interval.depth_from - inclFrom.getDepth()) /
              (inclTo.getDepth() - inclFrom.getDepth())) *
              (inclTo.getZenit() - inclFrom.getZenit());
        } else {
          interval.zenit = inclFrom.getZenit();
        }
      });
    });

    aWells.forEach((well) => {
      let initPoint = well.head;
      well.intervals.forEach((interval) => {
        interval.setCoordinates(initPoint, deposit.offset);
        initPoint = interval.to;
      });
      well.setFoot();
    });
    deposit.setBorders(aWells);
    if (!aWells.length) {
      throw new Error('Скважины в файле не найдены');
    }
    await deposit.save();
    await CodeIndex.insertMany(Object.values(oCodes));
    await Well.insertMany(aWells);
  } catch (e) {
    console.log(e);
    throw e;
  }
};
