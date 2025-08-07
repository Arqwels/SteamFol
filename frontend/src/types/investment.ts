import { Skin } from './skin';

export interface Investment {
  id: number;
  idItem: number;
  portfolioId: number;
  countItems: number;
  buyPrice: number;
  dateBuyItem: string;
  updatedAt: string;
  skin: Skin;
  changePercent: number;
  changePrice: number;
}

export interface CreateInvestmentRequest {
  idItem: number;
  portfolioId: number;
  countItems: number;
  buyPrice: number;
  dateBuyItem: string;
}

export interface UpdateInvestmentRequest extends CreateInvestmentRequest {
  id: number;
}
