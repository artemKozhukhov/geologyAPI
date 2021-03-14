import Well from "../MongoModelsNew/Well";

export default (app) => {
  app.get('/wells/:depositId/', async function (req, res) {
    let { depositId } = req.params;
    try {
      let wells = await Well.find({ deposit: depositId }).populate({ path: 'intervals.rock' });
      res.send(wells);
    } catch (e) {
      res.send({
        text: 'невозможно получить скважины',
      });
    }
  });
}
