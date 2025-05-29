const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Portfolio = sequelize.define('portfolio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  namePortfolio: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Название портфолио не может быть пустым',
      },
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
}, {
  tableName: 'portfolios',
  timestamps: true,
});

module.exports = Portfolio;
