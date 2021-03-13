import {Types, Document, Schema} from "mongoose";
import PointSchema, {IPoint} from "./Point";
import {IDeposit, IDepositDocument} from "./Deposit";
import IntervalSchema, {IInterval} from "./Interval";
import {IWorkbookInclinometry, IWorkbookLithology} from "../typings/workbook";
import {IRock} from "./Rock";

export interface IWell {
  deposit: Types.ObjectId | IDeposit,
  name: string,
  head: IPoint,
  foot?: IPoint,
  intervals?: IInterval[],
}

interface IWellBaseDocument extends IWell, Document {
  addLithology(this: IWellBaseDocument, lithology: IWorkbookLithology[], aRocks: IRock[]): void,
  addInclinometry(this: IWellBaseDocument, inclinometry: IWorkbookInclinometry[]): void,
  addInterval(this: IWellBaseDocument, interval: IInterval): void,
  deleteInterval(this: IWellBaseDocument, interval: IInterval): void,
  setFoot(): void,
}

export interface IWellDocument extends IWellBaseDocument {
  deposit: IDepositDocument['_id']
}

export interface IWellDocumentPopulatedByDeposit extends IWellBaseDocument {
  deposit: IDepositDocument
}

const WellSchema = new Schema(
  {
    deposit: {
      type: Schema.Types.ObjectId,
      ref: 'Deposit',
      required: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    head: PointSchema,
    foot: {
      type: PointSchema,
      required: false,
    },
    intervals: [IntervalSchema],
  },
  { versionKey: false },
);

WellSchema.methods.addInterval = function(this: IWellBaseDocument, interval) {
  if (!this.intervals) {
    this.intervals = [interval];
  } else {
    this.intervals.push(interval);
  }
  this.intervals.sort((interval1, interval2) => interval1.depthTo - interval2.depthFrom);
}

WellSchema.methods.deleteInterval = function(this: IWellBaseDocument, intervalForDelete: IInterval) {
  this.intervals = this.intervals.filter((interval) => {
    return interval !== intervalForDelete;
  });
}



// или передавать 2 массива (литологию иинклинометрию) и создавать сразу интервалы
WellSchema.methods.addLithology = function (this: IWellBaseDocument, lithology: IWorkbookLithology[], aRocks: IRock[]) {
  lithology.forEach((lithologyItem) => {
    const interval = {
      depthFrom: lithologyItem.depthFrom,
      depthTo: lithologyItem.depthTo,
      rock: aRocks.find((rock) => rock.name === lithologyItem.rockName),
    };
    this.addInterval(interval);
  })
}


WellSchema.methods.addInclinometry = function (this: IWellBaseDocument, inclinometry: IWorkbookInclinometry[]) {
  const isInclinometryInsideInterval = (inclDepth: number, intervalFrom: number, intervalTo: number) => {
    return inclDepth > intervalFrom && inclDepth < intervalTo;
  }
  // разбиваем интервалы на 2 если инклинометрия между литологией
  inclinometry.forEach((inclinometryItem) => {
    this.intervals.some((interval) => {
      if (isInclinometryInsideInterval(inclinometryItem.depth, interval.depthFrom, interval.depthTo)) {
        const newInterval1: IInterval = {
          depthFrom: interval.depthFrom,
          depthTo: inclinometryItem.depth,
          rock: interval.rock,
        }
        const newInterval2: IInterval = {
          depthFrom: inclinometryItem.depth,
          depthTo: interval.depthTo,
          rock: interval.rock,
        }
        this.addInterval(newInterval1);
        this.addInterval(newInterval2);
        this.deleteInterval(interval);
        return true;
      }
    });
  });
  // присваиваем углы интервалам, которые ниже инклинометрии
  inclinometry.forEach((inclinometryItem) => {
    this.intervals.forEach((interval) => {
      if (interval.depthFrom >= inclinometryItem.depth) {
        interval.zenit = inclinometryItem.zenit;
        interval.azimut = inclinometryItem.azimut;
      }
    });
  });
}

WellSchema.methods.setFoot = function (this: IWellBaseDocument) {
  let intervalsCount = this.intervals.length;
  let lastInterval = this.intervals[intervalsCount - 1];
  this.foot = { ...lastInterval.to };
};



















// WellSchema.methods.addInclinometry = function (this: IWellBaseDocument, incl) {
//   if (!this.inclinometries) {
//     this.inclinometries = [incl];
//   } else {
//     this.inclinometries.push(incl);
//   }
//   this.inclinometries.sort((incl1, incl2) => incl1.getDepth() - incl2.getDepth());
// };
//
// WellSchema.virtual('inclinometries');
//

export default WellSchema;
