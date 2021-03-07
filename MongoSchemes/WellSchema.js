const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const IntervalSchema = require('../MongoSchemes/Interval');
const PointSchema = require('../MongoSchemes/Point');
const WellSchema = new Schema(
  {
    deposit: {
      type: Schema.Types.ObjectId,
      ref: 'Deposit',
      required: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    head: PointSchema,
    foot: PointSchema,
    intervals: [IntervalSchema],
  },
  { versionKey: false },
);

WellSchema.methods.consoleLog = function () {
  console.log(this.name);
  console.log('устье', this.head);

  this.intervals.forEach((interval) => {
    console.log('от', interval.depth_from);
    console.log('до', interval.depth_to);
    console.log('зенит', interval.zenit);
    console.log('азимут', interval.azimut);
    console.log('------------------------');
  });
};

WellSchema.virtual('inclinometries');

WellSchema.methods.addInterval = function (interval) {
  if (!this.intervals) {
    this.intervals = [interval];
  } else {
    this.intervals.push(interval);
  }
  this.intervals.sort((interval1, interval2) => interval1.depth_from - interval2.depth_from);
};

WellSchema.methods.setFoot = function () {
  let intervalsCount = this.intervals.length;
  let lastInterval = this.intervals[intervalsCount - 1];
  this.foot = { ...lastInterval.to };
};

WellSchema.methods.deleteInterval = function (intervalForDelete) {
  this.intervals = this.intervals.filter((interval) => {
    return interval !== intervalForDelete;
  });
};

WellSchema.methods.addInclinometry = function (incl) {
  if (!this.inclinometries) {
    this.inclinometries = [incl];
  } else {
    this.inclinometries.push(incl);
  }
  this.inclinometries.sort((incl1, incl2) => incl1.getDepth() - incl2.getDepth());
};

module.exports = WellSchema;