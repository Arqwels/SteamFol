const { Invest, Skins, SkinPriceHistory, Portfolio } = require('./');

const initAssociations = () => {
  // Invest <-> Skins
  Invest.belongsTo(Skins, { 
    foreignKey: 'idItem',
    targetKey: 'id',
    as: 'skin',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  Skins.hasMany(Invest, { 
    foreignKey: 'idItem',
    as: 'investments'
  });

  // Invest <-> Portfolio
  Invest.belongsTo(Portfolio, {
    foreignKey: 'portfolioId',
    targetKey: 'id',
    as: 'portfolio',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  Portfolio.hasMany(Invest, {
    foreignKey: 'portfolioId',
    as: 'investments'
  });

  // SkinPriceHistory <-> Skins
  SkinPriceHistory.belongsTo(Skins, {
    foreignKey: 'skinId',
    as: 'skin',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  Skins.hasMany(SkinPriceHistory, {
    foreignKey: 'skinId',
    as: 'priceHistory'
  });
};

module.exports = initAssociations;
