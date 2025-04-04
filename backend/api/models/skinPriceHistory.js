const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const SkinPriceHistory = sequelize.define('skin_price_history', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  skinId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'skins',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  price_skin: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  recorded_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

module.exports = SkinPriceHistory;
