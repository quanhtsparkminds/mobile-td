import { EAssetClass } from "../portfolioApi";

export enum ExchangeProvider {
  BINANCE = "BINANCE",
}

export type TWalletCredential = {
  id: number;
  userId: number;
  provider: ExchangeProvider;
  maskedApiKey: string;
  maskedSecretKey: string;
  exists: boolean;
  name: string;
  assetClass: EAssetClass; // default CRYPTO
};

export interface TWalletCredentialsStat {
  isUsing: boolean;
  usingBy: string[];
}


export interface WalletCredentialsStatResponse {
  isUsing: boolean;
  usingBy: string[];
}

export interface CreateWalletCredentialsRequest {
  id?: number | null;
  name: string;
  apiKey: string;
  secretKey: string;
  provider?: ExchangeProvider;
}

export interface UpdateWalletCredentialsRequest {
  id: number;
  name?: string;
  apiKey?: string;
  secretKey?: string;
  provider?: ExchangeProvider;
}

export type WalletCredentialsRequest =
  | CreateWalletCredentialsRequest
  | UpdateWalletCredentialsRequest;