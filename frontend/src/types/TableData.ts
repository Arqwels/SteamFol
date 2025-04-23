export interface TableData {
  id: number;
  idItem: number;
  dateBuyItem: string;
  market_name: string;
  market_hash_name: string;
  price_item: number;
  change_price_percent_24h: number;
  change_price_profit_24h: number;
  image_url: string;
  count_items: number;
  buy_price: number;
  currencyCode?: string;
};