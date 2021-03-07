// let { metrics } = require('@tensorflow/tfjs-node');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const myMetrics = Object.keys(metrics).reduce((allMetrics, metricName) => {
//   allMetrics[metricName] = Schema.Types.Number;
//   return allMetrics;
// }, {});
const MetricsSchema = new Schema(
  {
    model: {
      type: Schema.Types.ObjectId,
      require: true,
    },
    epoch: Schema.Types.Number,
    loss: Schema.Types.Number,
    // ...myMetrics,
  },
  { versionKey: false },
);

const Metric = mongoose.model('Metric', MetricsSchema);

module.exports = Metric;
