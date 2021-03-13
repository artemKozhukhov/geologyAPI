import Well from "../MongoModelsNew/Well";

export default (app) => {
  app.get('/wells/', async function (req, res) {
    let deposit_id = req.query.deposit_id;
    try {
      let wells = await Well.find({ deposit: deposit_id }).populate({ path: 'intervals.code' });
      res.send(wells);
    } catch (e) {
      res.send({
        text: 'невозможно получить скважины',
      });
    }
  });
}
