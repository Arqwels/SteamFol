module.exports.getCurrencyAndPrice = function(skinData) {
  // Цена делится на 100, т.к. приходит в копейках
  let price = skinData.sell_price / 100;
  let currency_code = 'RUB';

  // Если цена содержит символ $, меняем валюту на USD
  if (skinData.sell_price_text && skinData.sell_price_text.trim().startsWith('$')) {
    currency_code = 'USD';
  }

  return { price, currency_code };
};