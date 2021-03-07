const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PointSchema = require('../MongoSchemes/Point');
const DepositSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    rocksCount: {
      type: Schema.Types.Number,
      required: true,
    },
    borders: {
      min: PointSchema,
      max: PointSchema,
    },
    offset: {
      type: Schema.Types.Number,
      require: true,
    },
  },
  { versionKey: false },
);

DepositSchema.methods.setBorders = function (aWells) {
  //wtf??? it's not work
  // let borders = {
  //     min: {...aWells[0].head},
  //     max: {...aWells[0].head}
  // };
  let borders = {
    min: {
      x: 999999999999,
      y: 999999999999,
      z: 999999999999,
    },
    max: {
      x: -999999999999,
      y: -999999999999,
      z: -999999999999,
    },
  };
  aWells.forEach(function (well) {
    if (well.head.x > borders.max.x || well.foot.x > borders.max.x) {
      borders.max.x = well.head.x > well.foot.x ? well.head.x : well.foot.x;
    }
    if (well.head.x < borders.min.x || well.foot.x < borders.min.x) {
      borders.min.x = well.head.x < well.foot.x ? well.head.x : well.foot.x;
    }
    if (well.head.y > borders.max.y || well.foot.y > borders.max.y) {
      borders.max.y = well.head.y > well.foot.y ? well.head.y : well.foot.y;
    }
    if (well.head.y < borders.min.y || well.foot.y < borders.min.y) {
      borders.min.y = well.head.y < well.foot.y ? well.head.y : well.foot.y;
    }
    if (well.head.z > borders.max.z || well.foot.z > borders.max.z) {
      borders.max.z = well.head.z > well.foot.z ? well.head.z : well.foot.z;
    }
    if (well.head.z < borders.min.z || well.foot.z < borders.min.z) {
      borders.min.z = well.head.z < well.foot.z ? well.head.z : well.foot.z;
    }
  });
  this.borders = borders;
};
const Deposit = mongoose.model('Deposit', DepositSchema);

module.exports = Deposit;
