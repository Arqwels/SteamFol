const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Invest = sequelize.define('invest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idItem: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'skins',
      key: 'id'
    }
  },
  countItems: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  buyPrice: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  dateBuyItem: {
    type: DataTypes.DATE,
    allowNull: true
  },
}, {
  timestamps: true,
  createdAt: false
});

module.exports = Invest;
