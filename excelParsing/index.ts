import * as XLSX from 'xlsx';
import Deposit from "../MongoModelsNew/Deposit";
import {IDeposit} from "../MongoSchemesNew/Deposit";
import {IWell, IWellDocument} from "../MongoSchemesNew/Well";
import parsers from "./Parsers";
import separateByField from "../utils/separateByField";
import {IWorkbookWell, IWorkbookInclinometry, IWorkbookLithology} from "../typings/workbook";
import {IRock} from "../MongoSchemesNew/Rock";
import getRandomColor from "../utils/getRandomColor";
import Well from "../MongoModelsNew/Well";


export default async (fileName: string, filePath: string, offset: number) => {
  let workbook = XLSX.readFile(filePath);

  const deposit: IDeposit = {
    offset,
    name: filePath,
  }
  const { _id: depositId }  = new Deposit(deposit);

  const aRockNames = parsers.getUniqueRockNames(workbook);
  const aRocks: IRock[] = aRockNames.map((rockName, index) => (
    {
      deposit: depositId,
      name: rockName,
      index,
      color: getRandomColor(),
    }
  ));

  const aWorkBookWells: IWorkbookWell[] = parsers.getWells(workbook);
  const aWorkBookLithologies: IWorkbookLithology[] = parsers.getLithology(workbook);
  const oWorkBookLithologies = separateByField(aWorkBookLithologies, 'wellName');
  const aWorkBookInclinometries: IWorkbookInclinometry[] = parsers.getInclinometry(workbook);
  const aWells = aWorkBookWells.map((workbookWell) => {
    const well: IWell = {
      deposit: depositId,
      name: workbookWell.name,
      head: workbookWell.head,
    };
    return new Well(well);
  });
  aWells.forEach((well: IWellDocument) => {
    well.addLithology(oWorkBookLithologies[well.name], aRocks);
  });
  console.log(aWells);


  // создать на основе данных из таблицы интервалы в скважинах!
  // подать скважинам данные по литологии а затем по инклинометрии
  // скважины сами должны знать что с этом делать

  // объединяем инклинометрию и литологию, затем только подаем это в скважину

};
