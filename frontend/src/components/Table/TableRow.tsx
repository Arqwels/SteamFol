import React, { useState } from 'react';
import { TableCell_Object } from './TableCell/TableCell_Object';
import { TableCell_Price24h } from './TableCell/TableCell_Price24h';
import { TableCell_24hProfit } from './TableCell/TableCell_24hProfit';
import { TableCell_InvestmentsAndCount } from './TableCell/TableCell_InvestmentsAndCount';
import { TableCell_BuyPrice } from './TableCell/TableCell_BuyPrice';
import { TableCell_CurrentProfit } from './TableCell/TableCell_CurrentProfit';
import { TableCell_Holdings } from './TableCell/TableCell_Holdings';
import { TableData } from '../../types';
import { InvestItem } from '../Invest/InvestItem';
import { useDeleteInvestmentMutation, useUpdateInvestmentMutation } from '../../api/investmentApi';
import { useAppSelector } from '../../stores/hooks';

export const TableRow = ({ row }: { row: TableData }) => {
  const [modalActive, setModalActive] = useState(false);
  const portfolioId = useAppSelector(state => state.activePortfolio.portfolioId!);

  // RTK Query мутации
  const [updateInvestment, { isLoading: isUpdating }] = useUpdateInvestmentMutation();
  const [deleteInvestment, { isLoading: isDeleting }] = useDeleteInvestmentMutation();

  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setModalActive(true);
    }
  };

  // колбэк для сохранения (обновления)
  const handleSave = async (countItems: number, buyPrice: number) => {
    try {
      await updateInvestment({
        id: row.id,
        idItem: row.idItem,
        portfolioId: portfolioId,
        dateBuyItem: row.dateBuyItem,
        countItems,
        buyPrice,
      }).unwrap();
      setModalActive(false);
    } catch (error) {
      console.log('Error1: ', error);
    }
  }

  // колбэк для «продажи» (удаления)
  //! Написать логику по продаже инвестиций (Продумать всё)
  const handleSell = async () => {
    try {
      await deleteInvestment(row.id).unwrap();
      setModalActive(false);
    } catch (error) {
      console.log('Error2: ', error);
    }
  }

  return (
    <>
      <tr
        onClick={() => setModalActive(true)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{ cursor: 'pointer' }}
      >
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

      <InvestItem
        data={row}
        active={modalActive}
        setActive={setModalActive}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        onSaveChanges={handleSave}
        onSell={handleSell}
      />
    </>
  )
};
