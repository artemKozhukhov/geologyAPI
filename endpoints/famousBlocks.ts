export default (app) => {
  app.get('/famousBlocks/', async (req, res) => {
    const { deposit, size } = req.query;
    try {
      // let aFamousBlocks = await getFamousBlocks(deposit, parseFloat(size));
      // res.send(aFamousBlocks);
    } catch (e) {
      res.send({
        text: 'не удалось получить блоки',
      });
    }
  });

  app.post('/famousBlocks/', async function (req, res) {
    const { deposit, size } = req.body;
    try {
      // let aFamousBlocks = await getFamousBlocks(deposit, parseFloat(size));
      // console.log(aFamousBlocks);
      // FamousBlock.insertMany(aFamousBlocks);
      // res.send({
      //   text: `блоки размерностью ${size} созданы в бд`,
      // });
    } catch (e) {
      res.send({
        text: 'не удалось получить блоки',
      });
    }
  });
}
