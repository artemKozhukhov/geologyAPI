import {Schema, Types, Document} from "mongoose";
import PointSchema, {IPoint} from "./Point";
import {IRock} from "./Rock";
import {IBlockModel, IBlockModelDocument} from "./BlockModel";
import {IWell, IWellDocument} from "./Well";

export interface IFamousBlock {
  blockModel: Types.ObjectId | IBlockModel
  center: IPoint,
  well: Types.ObjectId | IWell,
  rock: Types.ObjectId | IRock,
}

interface IFamousBlockBaseDocument extends IFamousBlock, Document {}

export interface IFamousBlockDocument extends IFamousBlockBaseDocument {
  blockModel: IBlockModelDocument['_id'],
}

export interface IFamousBlockDocumentByAll extends IFamousBlockBaseDocument {
  blockModel: IBlockModelDocument,
  well: IWellDocument,
  rock: IRock,
}

const FamousBlockSchema = new Schema(
  {
    well: {
      type: Schema.Types.ObjectId,
      ref: 'Well',
      require: true,
    },
    blockModel: {
      type: Schema.Types.ObjectId,
      ref: 'BlockModel',
      require: true,
    },
    rock: {
      type: Schema.Types.ObjectId,
      ref: 'Rock',
      require: true,
    },
    center: PointSchema,
  },
  { versionKey: false },
);

export default FamousBlockSchema;
