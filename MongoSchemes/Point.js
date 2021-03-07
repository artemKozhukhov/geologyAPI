const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PointSchema = new Schema(
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

PointSchema.methods.getBlocksCountToBorder = function (depositBorder, block_size) {};
module.exports = PointSchema;
