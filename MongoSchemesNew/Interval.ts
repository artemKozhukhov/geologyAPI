import {Types, Document, Schema} from "mongoose";
import PointSchema, {IPoint} from "./Point";
import { getRad, roundFloat } from "../utils/mathUtils";
import {IRock, IRockDocument} from "./Rock";

export interface IInterval {
  rock?: Types.ObjectId | IRock,
  from?: IPoint,
  to?: IPoint,
  depthFrom: number,
  depthTo: number,
}

interface IIntervalBaseDocument extends Document, IInterval {
  setCoordinates(this: IIntervalBaseDocument, startPoint: IPoint, offset: number): void,
  getPointCoords(this: IIntervalBaseDocument, startPoint: IPoint, depth: number, offset: number): IPoint,
  getFamousBlocks(this: IIntervalBaseDocument, depositBorders: {min: IPoint, max: IPoint}, block_size: number, offset: number): [string]
}

export interface IIntervalDocument extends IIntervalBaseDocument {
  rock: IRockDocument['_id'],
}

export interface IIntervalDocumentPopulatedByRock extends IIntervalBaseDocument {
  rock: IRockDocument
}


const IntervalSchema = new Schema(
  {
    rock: {
      type: Schema.Types.ObjectId,
      ref: 'Code',
      required: true,
    },
    from: PointSchema,
    to: PointSchema,
  },
  { versionKey: false },
);

IntervalSchema.methods.setCoordinates = function (this: IIntervalBaseDocument, startPoint: IPoint, offset: number) {
  this.from = { ...startPoint };
  this.to = this.getPointCoords(startPoint, this.depthTo - this.depthFrom, offset);
};

//получаем координаты любой точки на глубине от startPoint
// IntervalSchema.methods.getPointCoords = function (this: IIntervalBaseDocument, startPoint: IPoint, depth: number, offset: number) {
//   // let diff_x =
//   //   depth * Math.sin(utilFns.getRad(this.zenit - 90)) * Math.sin(utilFns.getRad(360 - this.azimut));
//   // let diff_y =
//   //   depth * Math.sin(utilFns.getRad(this.zenit - 90)) * Math.cos(utilFns.getRad(360 - this.azimut));
//   // let diff_z = depth * Math.cos(utilFns.getRad(this.zenit - 90));
//   let diff_x =
//     depth *
//     Math.sin(getRad(this.zenit + 90)) *
//     Math.cos(getRad(this.azimut + offset - 90));
//   let diff_y =
//     depth *
//     Math.sin(getRad(this.zenit + 90)) *
//     Math.sin(getRad(this.azimut + offset + 90));
//   let diff_z = -depth * Math.cos(getRad(this.zenit + 90));
//   return {
//     x: roundFloat(startPoint.x + diff_x),
//     y: roundFloat(startPoint.y + diff_y),
//     z: roundFloat(startPoint.z + diff_z),
//   };
// };

// IntervalSchema.methods.getFamousBlocks = function (this: IIntervalBaseDocument, depositBorders: {min: IPoint, max: IPoint}, block_size: number, offset: number) {
//   let step_size = block_size;
//   let intervalLength = this.depthTo - this.depthFrom;
//   let aPointsDepths = [];
//   for (let i = 0; i <= intervalLength; i += step_size) {
//     aPointsDepths.push(i);
//   }
//   let aPointsCoords = aPointsDepths.map((depth) => {
//     return this.getPointCoords(this.from, depth, offset);
//   });
//
//   return aPointsCoords.reduce((blocks, point) => {
//     let block = new FamousBlock({
//       size: block_size,
//       _x: block_size,
//       _y: block_size,
//       _z: block_size,
//       code: this.rock,
//     });
//     block.setCenter(depositBorders, point); //находим центр блока по любой точке месторождения
//     let isBlockAlreadyHas = blocks.find((item) => {
//       return (
//         item.center.x === block.center.x &&
//         item.center.y === block.center.y &&
//         item.center.z === block.center.z
//       );
//     });
//     if (!isBlockAlreadyHas) {
//       blocks.push(block);
//     }
//     return blocks;
//   }, []);
// };

export default IntervalSchema;
