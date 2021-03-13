import { Schema, Types, Document } from "mongoose";

export interface IRock{
  deposit: Types.ObjectId,
  index: number,
  name: string,
  color: string,
}

interface IRockBaseDocument extends IRock, Document{}

export interface IRockDocument extends IRockBaseDocument {}

const RockSchema = new Schema(
  {
    depositId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    index: {
      type: Schema.Types.Number,
      required: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    color: {
      type: Schema.Types.String,
      require: true,
    }
  },
  { versionKey: false },
);

export default RockSchema;
