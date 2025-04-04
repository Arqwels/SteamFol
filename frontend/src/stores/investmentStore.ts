import { makeAutoObservable } from 'mobx';
import { Investment } from './types';

class InvestmentStore {
  investments: Investment[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setInvestments(data: Investment[]): void {
    this.investments = data;
  }
  // Подсчёт профита или убытка скина в портфеле
  getInvestmentProfit(buyPrice: number, countItems: number, price_item: number): number {
    return (countItems * price_item) - (buyPrice * countItems);
  }
  // Тоже подсчёт профита, только с учётом комиссии
  getNetProfit(buyPrice: number, countItems: number, price_item: number): number {
    const profit = this.getInvestmentProfit(buyPrice, countItems, price_item);
    return profit - (profit * 0.13);
  }
  // Подсчёт всего актива скина
  getTotalAssets(buyPrice: number, countItems: number, price_item: number): number {
    return (buyPrice * countItems) + this.getInvestmentProfit(buyPrice, countItems, price_item);
  }
  // Подсчёт всего актива скина, только с учётом комиссии
  getNetTotalAssets(buyPrice: number, countItems: number, price_item: number): number {
    const totalAssets = this.getTotalAssets(buyPrice, countItems, price_item);
    return totalAssets - (totalAssets * 0.13);
  }
}

const investmentStore = new InvestmentStore();
export default investmentStore;