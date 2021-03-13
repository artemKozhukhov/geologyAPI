import * as XLSX from "xlsx";
import {roundFloat} from "../utils/mathUtils";
import {getExcelSheetData, WORKBOOK_NAMES} from "./utils";
import {IWorkbookWell, IWorkbookInclinometry, IWorkbookLithology} from "../typings/workbook";

export default {
  getWells: (workbook: XLSX.WorkBook): IWorkbookWell[] => {
    let aWellsHeadRows = getExcelSheetData(workbook, WORKBOOK_NAMES.wellhead.listName);
    return aWellsHeadRows.map((row): IWorkbookWell => (
      {
        name: row[WORKBOOK_NAMES.wellhead.columnsNames.wellName],
        head: {
          x: roundFloat(row[WORKBOOK_NAMES.wellhead.columnsNames.x]),
          y: roundFloat(row[WORKBOOK_NAMES.wellhead.columnsNames.y]),
          z: roundFloat(row[WORKBOOK_NAMES.wellhead.columnsNames.z]),
        },
      }
    ));
  },
  getUniqueRockNames: (workbook: XLSX.WorkBook): string[] => {
    let aLithologyRows = getExcelSheetData(workbook, WORKBOOK_NAMES.lithology.listName);
    return [...new Set(aLithologyRows.map((row) => row[WORKBOOK_NAMES.lithology.columsNames.code]))];
  },
  getLithology: (workbook: XLSX.WorkBook): IWorkbookLithology[] => {
    let aLithologyRows = getExcelSheetData(workbook, WORKBOOK_NAMES.lithology.listName);
    return aLithologyRows.map((row) => (
      {
        depthFrom: row[WORKBOOK_NAMES.lithology.columsNames.from],
        depthTo: row[WORKBOOK_NAMES.lithology.columsNames.to],
        rockName: row[WORKBOOK_NAMES.lithology.columsNames.code],
        wellName: row[WORKBOOK_NAMES.lithology.columsNames.wellName]
      }
    ))
  },
  getInclinometry: (workbook: XLSX.WorkBook): IWorkbookInclinometry[] => {
    let aInclinometryRows = getExcelSheetData(workbook, WORKBOOK_NAMES.inclinometry.listName);
    return aInclinometryRows.map((row) => (
      {
        zenit: row[WORKBOOK_NAMES.inclinometry.columsNames.zenit],
        azimut: row[WORKBOOK_NAMES.inclinometry.columsNames.azimut],
        wellName: row[WORKBOOK_NAMES.inclinometry.columsNames.wellName],
        depth: row[WORKBOOK_NAMES.inclinometry.columsNames.depth],
      }
    ))
  }
};
