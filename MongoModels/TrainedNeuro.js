const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WellSchema = require('../MongoSchemes/WellSchema')
const TrainedNeuro = new Schema(
  {
    deposit: {
      type: Schema.Types.ObjectId,
      ref: 'Deposit',
      required: true,
    },
    blockSize: {
      type: Schema.Types.Number,
      required: true,
    },
    epochsCount: {
      type: Schema.Types.Number,
      required: true,
    },
    structure: {
      type: Schema.Types.Buffer,
      required: true,
    },
    weights: {
      type: Schema.Types.Buffer,
      required: true,
    },
      excluded_well: {
        type: Schema.Types.ObjectId,
        ref: 'Well',
      },
      isCrossValidationModel: {
        type: Schema.Types.Bool,
          required: true,
      },
    hasPrediction: {
      type: Schema.Types.Bool,
    },
      from: {
        type: Schema.Types.String,
      }
  },
  { versionKey: false },
);

module.exports = mongoose.model('TrainedNeuroModel', TrainedNeuro);
