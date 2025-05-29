const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const User = sequelize.define('user', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActivated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  activationLink: {
    type: DataTypes.STRING
  },
}, {
  timestamps: true,
});

module.exports = User;
