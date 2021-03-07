import express from 'express';
import enableEndPoints from './endpoints';
import config from './config';
import mongoose from 'mongoose';

const app = express();
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
