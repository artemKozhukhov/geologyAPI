const Codes = require('../MongoModels/Code');

export default (app) => {
  app.get('/rocks/:deposit_id', async (req, res) => {
    try {
      const deposit_id = req.params.deposit_id
      const rocks = await Codes.find({deposit: deposit_id});
      res.send(rocks);
    } catch (e) {
      res.send(e);
    }
  });
}
