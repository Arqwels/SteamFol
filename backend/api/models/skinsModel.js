const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Skins = sequelize.define('skin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  market_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  market_hash_name: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  price_skin: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  currency_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date_update: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: false,
  updatedAt: 'date_update'
});

module.exports = Skins;
