import * as XLSX from "xlsx";

export const WORKBOOK_NAMES = {
  inclinometry: {
    listName: 'inclinometry',
    columsNames: {
      wellName: 'СКВ',
      azimut: 'АЗИМУТ',
      zenit: 'УКЛОН',
      depth: 'ГЛУБИНА СЪЕМКИ'
    }
  },
  lithology: {
    listName: 'lithology',
    columsNames: {
      wellName: 'СКВ',
      code: 'ЛИТ.КОД',
      from: 'ОТ',
      to: 'ДО',
    }
  },
  wellhead: {
    listName: 'wellhead',
    columnsNames: {
      wellName: 'СКВ',
      x: 'X',
      y: 'Y',
      z: 'Z',
    }
  },
};

export const getExcelSheetData = (workbook: XLSX.WorkBook, sheetName: string) => {
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
};
