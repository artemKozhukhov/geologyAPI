import express from 'express';
import enableEndPoints from './endpoints';
import config from './config';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './swagger.json';

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

mongoose.connect(
  `mongodb://${config.DBServer}:${config.DBServerPort}/geology`,
  { useNewUrlParser: true },
  function (err) {
    if (err) return console.log('Не удалось запустить сервер, ошибка подключения к БД', err);
    app.listen(config.appHostPort, function () {
      enableEndPoints(app);
      console.log(`Сервер запущен на порту ${config.appHostPort}`);
    });
  },
);
