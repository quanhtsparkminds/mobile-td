import { EAssetClass } from "../portfolioApi";

export enum PriceProvider {
  COINDESK = "COINDESK",
  TWELVE_DATA = "TWELVE_DATA",
}

export type PriceFlag = "UP" | "DOWN";

export interface TAssetData {
  asset: TAsset;
  price?: TAssetPrice;
}
export type TAsset = {
  id: number;
  symbol: string;
  name: string;
  logoUrl: string;
  assetClass: EAssetClass;
  region: string;
  active: boolean;
  priceProvider: PriceProvider;
  canBeIndexAsset: boolean;
  canBeIndexCurrency: boolean;
  canBeDefensiveAsset: boolean;
  maxDecimals: number;
  minDecimals: number;
  displayOrder: number;
  description: any;
  createdAt: string;
  updatedAt: string;
};

export interface TAssetPrice {
  id: number;
  symbol: string;
  instrument: string;
  price: number;
  priceFlag: PriceFlag;
  high24h: number;
  low24h: number;
  open24h: number;
  volume24h: number;
  quoteVolume24h: number;
  change24h: number;
  changePct24h: number;
  high7d: number;
  low7d: number;
  change7d: number;
  changePct7d: number;
  change30d: number;
  changePct30d: number;
  lastUpdateTs: number;
  createdAt: string;
}



export interface CreateAssetRequest {
  symbol: string;
  name: string;
  logoUrl?: string;
  assetClass: EAssetClass;
  region?: string; // Only for STOCK assets
  active?: boolean;
  canBeIndexAsset?: boolean;
  priceProvider?: PriceProvider;
  canBeIndexCurrency?: boolean;
  canBeDefensiveAsset?: boolean;
  maxDecimals?: number;
  minDecimals?: number;
  displayOrder?: number;
  description?: string;
}

export interface UpdateAssetRequest {
  symbol?: string;
  name?: string;
  logoUrl?: string;
  assetClass: EAssetClass;
  region?: string; // Only for STOCK assets
  active?: boolean;
  canBeIndexAsset?: boolean;
  priceProvider?: PriceProvider;
  canBeIndexCurrency?: boolean;
  canBeDefensiveAsset?: boolean;
  maxDecimals?: number;
  minDecimals?: number;
  displayOrder?: number;
  description?: string;
}