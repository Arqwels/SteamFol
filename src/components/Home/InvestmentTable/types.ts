export interface InvestmentData {
  id: number;
  market_name: string;
  market_hash_name: string;
  price_item: number;
  image_url: string;
  countItems: number;
  buyPrice: number;
}

export interface InvestmentTableProps {
  data: InvestmentData[];
}

export interface InvestmentTableRowProps {
  investment: InvestmentData;
  isOpen: boolean;          // Добавлено для отслеживания состояния меню
  toggleMenu: () => void;   // Добавлено для открытия/закрытия меню
  closeMenu: () => void;    // Добавлено для закрытия меню
}
