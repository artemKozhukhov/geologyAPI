import Deposit from "../MongoModelsNew/Deposit";
import excelParsing from '../excelParsing';

export default (app) => {
  app.get('/deposit/:deposit_id/', async (req, res) => {
    let depositId = req.params.deposit_id;
    try {
      let deposit = await Deposit.findOne({ _id: depositId });
      res.send(deposit);
    } catch (e) {
      res.send(e);
    }
  });

  app.get('/deposits/', async (req, res) => {
    try {
      let deposits = await Deposit.find({});
      res.send(deposits);
    } catch (e) {
      res.send(e);
    }
  });

  app.post('/deposit/', async function (req, res) {
    let fileInfo = req.file;
    let fileData = JSON.parse(req.header('slug'));
    let depositName = decodeURI(fileData.name);
    let depositOffset = parseFloat(fileData.offset);
    let filePath = fileInfo.path;
    try {
      await excelParsing(depositName, filePath, depositOffset);
      res.send({
        text: `месторождение ${depositName} успешно загружено`,
      });
    } catch (e) {
      res.send({
        text: e.message,
      });
    }
  });
}
