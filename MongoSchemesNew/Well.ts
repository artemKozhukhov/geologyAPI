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
    foot: PointSchema,
    intervals: [IntervalSchema],
  },
  { versionKey: false },
);

WellSchema.methods.addLithology = function (this: IWellBaseDocument, lithology: IWorkbookLithology[], aRocks: IRock[]) {
  lithology.forEach((lithologyItem) => {
    const interval = {
      depthFrom: lithologyItem.depthFrom,
      depthTo: lithologyItem.depthTo,
      rock: aRocks.find((rock) => rock.name === lithologyItem.rockName),
    };
    if (!this.intervals) {
      this.intervals = [interval];
    } else {
      this.intervals.push(interval);
    }
  })
  this.intervals.sort((interval1, interval2) => interval1.depthTo - interval2.depthFrom);
}

// при добавлении инклинометрии создаются новые интервалы у скважины
WellSchema.methods.addInclinometry = function (this: IWellBaseDocument, inclinometry: IWorkbookInclinometry, aRocks: IRock[]) {

}



















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
// WellSchema.methods.setFoot = function (this: IWellBaseDocument) {
//   let intervalsCount = this.intervals.length;
//   let lastInterval = this.intervals[intervalsCount - 1];
//   this.foot = { ...lastInterval.to };
// };

export default WellSchema;
