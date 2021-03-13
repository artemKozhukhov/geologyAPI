const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FamousBlock = require('../MongoModels/FamousBlock');
const PointSchema = require('../MongoSchemes/Point');
const utilFns = require('../utils/mathUtils');
const IntervalSchema = new Schema(
  {
    code: {
      type: Schema.Types.ObjectId,
      ref: 'Code',
      required: true,
    },
    zenit: {
      type: Schema.Types.Number,
      required: true,
    },
    azimut: {
      type: Schema.Types.Number,
      required: true,
    },
    from: PointSchema,
    to: PointSchema,
    depth_from: {
      type: Schema.Types.Number,
      required: true,
    },
    depth_to: {
      type: Schema.Types.Number,
      required: true,
    },
  },
  { versionKey: false },
);

//здесь нужна строгая типизация чтобы приходил строго экземпляр класса Point
IntervalSchema.methods.setCoordinates = function (startPoint, offset) {
  this.from = { ...startPoint };
  this.to = this.getPointCoords(startPoint, this.depth_to - this.depth_from, offset);
};

//получаем координаты любой точки на глубине от startPoint
IntervalSchema.methods.getPointCoords = function (startPoint, depth, offset) {
  // let diff_x =
  //   depth * Math.sin(utilFns.getRad(this.zenit - 90)) * Math.sin(utilFns.getRad(360 - this.azimut));
  // let diff_y =
  //   depth * Math.sin(utilFns.getRad(this.zenit - 90)) * Math.cos(utilFns.getRad(360 - this.azimut));
  // let diff_z = depth * Math.cos(utilFns.getRad(this.zenit - 90));
  let diff_x =
    depth *
    Math.sin(utilFns.getRad(this.zenit + 90)) *
    Math.cos(utilFns.getRad(this.azimut + offset - 90));
  let diff_y =
    depth *
    Math.sin(utilFns.getRad(this.zenit + 90)) *
    Math.sin(utilFns.getRad(this.azimut + offset + 90));
  let diff_z = -depth * Math.cos(utilFns.getRad(this.zenit + 90));
  return {
    x: utilFns.roundFloat(startPoint.x + diff_x),
    y: utilFns.roundFloat(startPoint.y + diff_y),
    z: utilFns.roundFloat(startPoint.z + diff_z),
  };
};

IntervalSchema.methods.getFamousBlocks = function (depositBorders, block_size, offset) {
  debugger;
  let step_size = block_size;
  let intervalLength = this.depth_to - this.depth_from;
  let aPointsDepths = [];
  for (let i = 0; i <= intervalLength; i += step_size) {
    aPointsDepths.push(i);
  }
  let aPointsCoords = aPointsDepths.map((depth) => {
    return this.getPointCoords(this.from, depth, offset);
  });

  return aPointsCoords.reduce((blocks, point) => {
    let block = new FamousBlock({
      size: block_size,
      _x: block_size,
      _y: block_size,
      _z: block_size,
      code: this.code,
    });
    block.setCenter(depositBorders, point); //находим центр блока по любой точке месторождения
    let isBlockAlreadyHas = blocks.find((item) => {
      return (
        item.center.x === block.center.x &&
        item.center.y === block.center.y &&
        item.center.z === block.center.z
      );
    });
    if (!isBlockAlreadyHas) {
      blocks.push(block);
    }
    return blocks;
  }, []);
};

module.exports = IntervalSchema;
