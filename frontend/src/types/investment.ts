import { Skin } from './skin';

export interface Investment {
  id: number;
  idItem: number;
  countItems: number;
  buyPrice: number;
  dateBuyItem: string;
  updatedAt: string;
  skin: Skin;
}

export interface CreateInvestmentRequest {
  idItem: number;
  countItems: number;
  buyPrice: number;
  dateBuyItem: string;
}

export interface UpdateInvestmentRequest extends CreateInvestmentRequest {
  id: number;
}
