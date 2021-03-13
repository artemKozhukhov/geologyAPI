import * as XLSX from 'xlsx';
import Deposit from "../MongoModelsNew/Deposit";
import {IDeposit, IDepositDocument} from "../MongoSchemesNew/Deposit";
import {IWell, IWellDocument} from "../MongoSchemesNew/Well";
import parsers from "./Parsers";
import separateByField from "../utils/separateByField";
import {IWorkbookWell, IWorkbookInclinometry, IWorkbookLithology} from "../typings/workbook";
import {IRock, IRockDocument} from "../MongoSchemesNew/Rock";
import getRandomColor from "../utils/getRandomColor";
import Well from "../MongoModelsNew/Well";
import {IIntervalDocument} from "../MongoSchemesNew/Interval";
import Rock from "../MongoModelsNew/Rock";


export default async (fileName: string, filePath: string, offset: number) => {
  let workbook = XLSX.readFile(filePath);

  const deposit = new Deposit({
    offset,
    name: fileName,
  });

  const depositId = deposit._id;

  const aRockNames = parsers.getUniqueRockNames(workbook);
  const aRocks = aRockNames.map((rockName, index) => {
    const rock: IRock = {
      deposit: depositId,
      name: rockName,
      index,
      color: getRandomColor(),
    };
    return new Rock(rock);
  });

  const aWorkBookWells: IWorkbookWell[] = parsers.getWells(workbook);
  const aWorkBookLithologies: IWorkbookLithology[] = parsers.getLithology(workbook);
  const oWorkBookLithologies = separateByField(aWorkBookLithologies, 'wellName');
  const aWorkBookInclinometries: IWorkbookInclinometry[] = parsers.getInclinometry(workbook);
  const oWorkBookInclinometries = separateByField(aWorkBookInclinometries, 'wellName');
  const aWells = aWorkBookWells.map((workbookWell) => {
    const well: IWell = {
      deposit: depositId,
      name: workbookWell.name,
      head: workbookWell.head,
    };
    return new Well(well);
  });
  aWells.forEach((well) => {
    well.addLithology(oWorkBookLithologies[well.name], aRocks);
  });
  aWells.forEach((well) => {
    well.addInclinometry(oWorkBookInclinometries[well.name]);
  });

  aWells.forEach((well) => {
    let initPoint = well.head;
    well.intervals.forEach((interval: IIntervalDocument) => {
      // TODO разобраться логично ли работает этот метод
      interval.setCoordinates(initPoint, offset);
      initPoint = interval.to;
    });
    //well.setFoot();
  });
  //deposit.setBorders(aWells);
  console.log(aWells[0].intervals[0]);

  await deposit.save();
  await Rock.insertMany(aRocks);
  await Well.insertMany(aWells);
  // СОХРАНЕНИЕ

};
