const Deposit = require('../MongoModels/Deposit');
const Well = require('../MongoModels/Well');

module.exports = async (depositId, block_size) => {
  try {
    let oDeposit = await Deposit.findOne({ _id: depositId });
    let aWells = await Well.find({ deposit: depositId }).populate('intervals.code');
    let aFamousBlocks = [];
    aWells.forEach((well) => {
      well.intervals.forEach((interval) => {
        let aBlocks = interval.getFamousBlocks(oDeposit.borders, block_size, oDeposit.offset);
        aBlocks.forEach((block) => {
          block.well = well._id;
        });
        aFamousBlocks = aFamousBlocks.concat(aBlocks);
      });
    });
    return aFamousBlocks;
  } catch (e) {
    console.log(e.message);
    throw e;
  }
};
