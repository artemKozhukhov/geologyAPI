import { Types, Document, Schema } from "mongoose";
import PointSchema, { IPoint } from "./Point";
import {IUser, IUserDocument} from "./User";
import {IWell} from "./Well";

export interface IDeposit {
  name: string,
  borders?: {
    min: IPoint,
    max: IPoint,
  },
  offset: number,
  user?: Types.ObjectId | IUser,
}

interface IDepositBaseDocument extends IDeposit, Document {
  setBorders(aWells: IWell[]): void,
}

export interface IDepositDocument extends IDepositBaseDocument {
  user: IUserDocument['_id'],
}

export interface IDepositDocumentPopulatedByUser extends IDepositBaseDocument {
  user: IUserDocument,
}


const DepositSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    borders: {
      min: PointSchema,
      max: PointSchema,
    },
    offset: {
      type: Schema.Types.Number,
      require: true,
    },
  },
  { versionKey: false },
);

DepositSchema.methods.setBorders = function (this: IDepositBaseDocument, aWells: IWell[]) {
  //wtf??? it's not work
  // let borders = {
  //     min: {...aWells[0].head},
  //     max: {...aWells[0].head}
  // };
  let borders = {
    min: {
      x: 999999999999,
      y: 999999999999,
      z: 999999999999,
    },
    max: {
      x: -999999999999,
      y: -999999999999,
      z: -999999999999,
    },
  };
  aWells.forEach(function (well) {
    if (well.head.x > borders.max.x || well.foot.x > borders.max.x) {
      borders.max.x = well.head.x > well.foot.x ? well.head.x : well.foot.x;
    }
    if (well.head.x < borders.min.x || well.foot.x < borders.min.x) {
      borders.min.x = well.head.x < well.foot.x ? well.head.x : well.foot.x;
    }
    if (well.head.y > borders.max.y || well.foot.y > borders.max.y) {
      borders.max.y = well.head.y > well.foot.y ? well.head.y : well.foot.y;
    }
    if (well.head.y < borders.min.y || well.foot.y < borders.min.y) {
      borders.min.y = well.head.y < well.foot.y ? well.head.y : well.foot.y;
    }
    if (well.head.z > borders.max.z || well.foot.z > borders.max.z) {
      borders.max.z = well.head.z > well.foot.z ? well.head.z : well.foot.z;
    }
    if (well.head.z < borders.min.z || well.foot.z < borders.min.z) {
      borders.min.z = well.head.z < well.foot.z ? well.head.z : well.foot.z;
    }
  });
  this.borders = borders;
};

export default DepositSchema;
