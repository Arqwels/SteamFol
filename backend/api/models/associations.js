const { Invest, Skins, SkinPriceHistory } = require('./');

const initAssociations = () => {
  // Связь для инвестиций
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

  // Связи для истории цен
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
