import { api } from "../Api";
import { ApiResponse } from "../Api.types";
import {
  TWalletCredential,
  TWalletCredentialsStat,
  WalletCredentialsRequest,
} from "./walletApi.types";

const getWalletCreadential = (): Promise<ApiResponse<TWalletCredential[]>> => {
  return api.get<TWalletCredential[]>("/v1/wallet-credentials");
};

const deleteCredentials = (id: number) => {
  return api.delete<void>(`/v1/wallet-credentials/${id}`);
};

const checkHasCredentials = () => {
  return api.get<boolean>("/v1/wallet-credentials/exists");
};

const getStat = (id: number) => {
  return api.get<TWalletCredentialsStat>(`/v1/wallet-credentials/stat/${id}`);
};

const createOrUpdate = (data: WalletCredentialsRequest) => {
  return api.post<TWalletCredential>("/v1/wallet-credentials", data);
};

export const walletApi = {
  getWalletCreadential,
  deleteCredentials,
  checkHasCredentials,
  getStat,
  createOrUpdate,
};
