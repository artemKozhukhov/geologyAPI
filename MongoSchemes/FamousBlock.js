const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PointSchema = require('../MongoSchemes/Point');
const CodeSchema = require('../MongoSchemes/Code');
let FamousBlockSchema = new Schema(
  {
    well: {
      type: Schema.Types.ObjectId,
      ref: 'Well',
      require: true,
    },
    size: {
      type: Schema.Types.Number,
      require: true,
    },
    _x: {
      type: Schema.Types.Number,
      require: true,
    },
    _y: {
      type: Schema.Types.Number,
      require: true,
    },
    _z: {
      type: Schema.Types.Number,
      require: true,
    },
    center: PointSchema,
    code: CodeSchema,
  },
  { versionKey: false },
);

FamousBlockSchema.methods.setCenter = function (depositBorders, point) {
  let blocksCountToBorder = {
    x: Math.floor((point.x - depositBorders.min.x) / this.size),
    y: Math.floor((point.y - depositBorders.min.y) / this.size),
    z: Math.floor((point.z - depositBorders.min.z) / this.size),
  };
  this.center = {
    x: roundFloat(depositBorders.min.x + blocksCountToBorder.x * this.size + this.size / 2),
    y: roundFloat(depositBorders.min.y + blocksCountToBorder.y * this.size + this.size / 2),
    z: roundFloat(depositBorders.min.z + blocksCountToBorder.z * this.size + this.size / 2),
  };
};

const roundFloat = (num) => {
  return Math.floor(num * 100) / 100;
};
module.exports = FamousBlockSchema;
