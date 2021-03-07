const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Deposit = require('../MongoModels/Deposit');
const FamousBlockSchema = require('../MongoSchemes/FamousBlock');
const PointSchema = require('../MongoSchemes/Point');
let BlockWellSchema = new Schema(
  {
    deposit: {
      type: Schema.Types.ObjectId,
      require: true,
    },
    size: {
      type: Schema.Types.Number,
      require: true,
    },
    blocks: [FamousBlockSchema],
  },
  { versionKey: false },
);

BlockWellSchema.methods.addBlocks = function (aBlocks) {
  this.blocks = this.blocks.concat(aBlocks);
};
let BlockWell = mongoose.model('BlockWell', BlockWellSchema);

module.exports = BlockWell;
