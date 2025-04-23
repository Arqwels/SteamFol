import { Investment } from '../types/investment';
import { TableData } from '../types/tableData';

/**
 * Функция преобразует объект Investment (структура ответа API)
 * в объект TableData, пригодный для отображения в таблице.
 *
 * Здесь можно добавить вычисления (например, процентов или прибыли за 24 часа),
 * если соответствующие данные появятся.
 */
export function mapInvestmentToTableData(investment: Investment): TableData {
  return {
    id: investment.id,
    idItem: investment.idItem,
    dateBuyItem: investment.dateBuyItem,
    market_name: investment.skin.market_name,
    market_hash_name: investment.skin.market_hash_name,
    price_item: investment.skin.price_skin,
    //! Нужно будет сделать
    change_price_percent_24h: 0,
    change_price_profit_24h: 0,
    image_url: investment.skin.image_url,
    count_items: investment.countItems,
    buy_price: investment.buyPrice,
    currencyCode: investment.skin.currency_code
  };
}
