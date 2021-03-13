import { Schema, Document } from 'mongoose';

export enum AXISES {
  x = 'x',
  y = 'y',
  z = 'z',
}

export interface IPoint {
  [AXISES.x]: number,
  [AXISES.y]: number,
  [AXISES.z]: number,
}

export interface IPointDocument extends IPoint, Document {}

const PointSchema: Schema = new Schema(
  {
    x: {
      type: Schema.Types.Number,
      require: true,
    },
    y: {
      type: Schema.Types.Number,
      require: true,
    },
    z: {
      type: Schema.Types.Number,
      require: true,
    },
  },
  { versionKey: false },
);

export default PointSchema;
