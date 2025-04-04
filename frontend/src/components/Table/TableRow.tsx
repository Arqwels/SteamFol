import React from 'react';
import { TableCell_Object } from './TableCell/TableCell_Object'
import { TableCell_Price24h } from './TableCell/TableCell_Price24h'
import { TableCell_24hProfit } from './TableCell/TableCell_24hProfit'
import { TableCell_InvestmentsAndCount } from './TableCell/TableCell_InvestmentsAndCount'
import { TableCell_BuyPrice } from './TableCell/TableCell_BuyPrice'
import { TableCell_CurrentProfit } from './TableCell/TableCell_CurrentProfit'
import { TableCell_Holdings } from './TableCell/TableCell_Holdings'
import { TableData } from '../../types/TableData';

interface TableRowProps {
  row: TableData;
}

export const TableRow: React.FC<TableRowProps> = ({ row }) => {
  return (
    <tr>
      <TableCell_Object
        image_url={row.image_url}
        item_hash_name={row.market_hash_name}
        item_name={row.market_name}
      />
      <TableCell_Price24h
        price_item={row.price_item}
        change_price_percent_24h={row.change_price_percent_24h}
        currencyCode={row.currencyCode}
      />
      <TableCell_24hProfit
        change_price_profit_24h={row.change_price_profit_24h}
        currencyCode={row.currencyCode}
      />
      <TableCell_InvestmentsAndCount
        count_items={row.count_items}
        buy_price={row.buy_price}
        currencyCode={row.currencyCode}
      />
      <TableCell_BuyPrice
        buy_price={row.buy_price}
        currencyCode={row.currencyCode}
      />
      <TableCell_CurrentProfit
        price_item={row.price_item}
        buy_price={row.buy_price}
        count_items={row.count_items}
        currencyCode={row.currencyCode}
      />
      <TableCell_Holdings
        price_item={row.price_item}
        count_items={row.count_items}
        currencyCode={row.currencyCode}
      />
    </tr>
  );
};
