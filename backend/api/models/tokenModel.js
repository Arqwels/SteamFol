const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Token = sequelize.define('token', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  timestamps: true,
});

module.exports = Token;
