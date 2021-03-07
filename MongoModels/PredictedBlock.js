const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PointSchema = require('../MongoSchemes/Point');
const FamousBlockSchema = require('../MongoSchemes/FamousBlock');
const CodeSchema = require('../MongoSchemes/Code');
let PredictedBlockSchema = new Schema(
  {
    // size: {
    //   type: Schema.Types.Number,
    //   require: true,
    // },
    // deposit: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Deposit',
    //   require: true,
    // },
    center: PointSchema,
    // code: CodeSchema,
    code: CodeSchema,
    outputs: {
      type: [Schema.Types.Number],
      required: true,
    },
    neuroModel: {
      type: Schema.Types.ObjectId,
      ref: 'TrainedNeuroModel',
      require: true,
    },
    famousBlock: FamousBlockSchema,
    size: {
      _x: {
        type: Schema.Types.Number,
        required: true,
      },
      _y: {
        type: Schema.Types.Number,
        required: true,
      },
      _z: {
        type: Schema.Types.Number,
        required: true,
      },
    },
  },
  { versionKey: false },
);

PredictedBlockSchema.methods.getInputs = function (borders) {
  return [
    roundFloat(this.getNormalizedX(borders.min.x, borders.max.x)),
    roundFloat(this.getNormalizedY(borders.min.y, borders.max.y)),
    roundFloat(this.getNormalizedZ(borders.min.z, borders.max.z)),
  ];
};

PredictedBlockSchema.methods.setRockIndex = function () {
  let maxValue = 0;
  let codeIndex = -1;
  this.outputs.forEach((oneOut, i) => {
    if (oneOut > maxValue) {
      maxValue = oneOut;
      codeIndex = i;
    }
  });
  this.code = codeIndex;
};

PredictedBlockSchema.getNeuroOutput = function (rocksCount) {
  let outputArray = [];
  for (let i = 0; i < rocksCount; i++) {
    this.code.index === i ? outputArray.push(1) : outputArray.push(0);
  }
  return outputArray;
};

PredictedBlockSchema.methods.getNormalizedX = function (minValue, maxValue) {
  return (this.center.x - minValue) / (maxValue - minValue);
};
PredictedBlockSchema.methods.getNormalizedY = function (minValue, maxValue) {
  return (this.center.y - minValue) / (maxValue - minValue);
};
PredictedBlockSchema.methods.getNormalizedZ = function (minValue, maxValue) {
  return (this.center.z - minValue) / (maxValue - minValue);
};

PredictedBlockSchema.methods.getDeNormalizedX = function (minValue, maxValue) {
  return minValue + this.center.x * (maxValue - minValue);
};
PredictedBlockSchema.methods.getDeNormalizedY = function (minValue, maxValue) {
  return minValue + this.center.y * (maxValue - minValue);
};
PredictedBlockSchema.methods.getDeNormalizedZ = function (minValue, maxValue) {
  return minValue + this.center.z * (maxValue - minValue);
};

const roundFloat = (num) => {
  return Math.floor(num * 100) / 100;
};

module.exports = mongoose.model('PredictedBlock', PredictedBlockSchema);
