const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let InclinometrySchema = new Schema(
  {
    azimut: {
      type: Schema.Types.Number,
      required: true,
    },
    zenit: {
      type: Schema.Types.Number,
      required: true,
    },
    depth: {
      type: Schema.Types.Number,
      required: true,
    },
  },
  { versionKey: false },
);

InclinometrySchema.methods.getAzimut = function () {
  return this.azimut;
};
InclinometrySchema.methods.getZenit = function () {
  return this.zenit;
};
InclinometrySchema.methods.getDepth = function () {
  return this.depth;
};
InclinometrySchema.methods.isInInterval = function (interval) {
  return interval.depth_from < this.depth && interval.depth_to > this.depth;
};

const Inclinometry = mongoose.model('Inclinometry', InclinometrySchema);

module.exports = Inclinometry;
