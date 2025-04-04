const sequelize = require('../../db');
const Invest = require('./investModel');
const SkinPriceHistory = require('./SkinPriceHistory');
const Skins = require('./skinsModel');

module.exports = {
  sequelize,
  Skins,
  Invest,
  SkinPriceHistory
};
