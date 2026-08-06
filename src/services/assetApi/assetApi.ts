import { api } from "../Api";
import {
  ApiResponse,
  ListRequestParams,
  PageResponse,
  searchParamsToQueryParams,
} from "../Api.types";
import {
  CreateAssetRequest,
  TAsset,
  TAssetPrice,
  UpdateAssetRequest,
} from "./assetApi.types";

const getAssets = (
  params: ListRequestParams
): Promise<ApiResponse<PageResponse<TAsset>>> => {
  const queryParams = searchParamsToQueryParams(params);
  return api.get<PageResponse<TAsset>>("/v1/assets", { params: queryParams });
};

const getPrice = (symbol: string): Promise<ApiResponse<TAssetPrice[]>> => {
  return api.get<TAssetPrice[]>(`/v1/asset-prices/${symbol}`);
};

const getAllPrices = (): Promise<ApiResponse<TAssetPrice[]>> => {
  return api.get<TAssetPrice[]>("/v1/asset-prices");
};

const toggleStatus = (id: string): Promise<ApiResponse<void>> => {
  return api.patch<void>(`/v1/assets/${id}/toggle-status`);
};

const getActiveAssets = (): Promise<ApiResponse<TAsset[]>> => {
  return api.get<TAsset[]>("/v1/assets/active");
};

const createAsset = (
  data: CreateAssetRequest
): Promise<ApiResponse<TAsset>> => {
  return api.post<TAsset>("/v1/assets", data);
};

const updateAsset = (
  id: string,
  data: UpdateAssetRequest
): Promise<ApiResponse<TAsset>> => {
  return api.put<TAsset>(`/v1/assets/${id}`, data);
};

export const assetApi = {
  getAssets,
  getPrice,
  getAllPrices,
  toggleStatus,
  getActiveAssets,
  createAsset,
  updateAsset,
};
