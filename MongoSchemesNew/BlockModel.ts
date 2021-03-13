import {Types,Schema, Document } from "mongoose";
import {IDeposit, IDepositDocument} from "./Deposit";

export interface IBlockModel {
  blockSize: number,
  deposit: Types.ObjectId | IDeposit
}

interface IBlockModelBaseDocument extends IBlockModel, Document {}

export interface IBlockModelDocument extends IBlockModelBaseDocument {
  deposit: IDepositDocument['_id'],
}

export interface IBlockModelDocumentPopulatedByDeposit extends IBlockModelBaseDocument {
  deposit: IDepositDocument,
}

const BlockModelSchema = new Schema({
  size: {
    type: Schema.Types.Number,
    required: true,
  },
  deposit: {
    type: Schema.Types.ObjectId,
    ref: 'Deposit',
    required: true
  }
});

export default BlockModelSchema;
