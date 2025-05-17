require('dotenv').config()
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const apiRouter = require('./api/routes/index');
const initAssociations = require('./api/models/associations');
const cron = require('node-cron');
const { fetchAndSaveSkins } = require('./api/services/skinsTaskService');

const app = express();
const PORT = process.env.PORT || 2000;

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/api', apiRouter);

// Импорт моделей и ассоциаций
initAssociations();

// Сделать запрос через node-cron

// Запланировать выполнение задачи каждые 6 часов (в 0 минут каждого 6-го часа)
cron.schedule('0 */6 * * *', async () => {
  console.log('Запуск задачи: получение скинов и сохранение истории цен');
  try {
    await fetchAndSaveSkins();
    console.log('Данные успешно обновлены.');
  } catch (error) {
    console.error("Ошибка при выполнении запланированной задачи:", error);
  }
});

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту - ${PORT}`)
    });
  } catch (error) {
    console.log(`⛔ Ошибка с подключение к БД - ${error}`)
  }
};

start();
