import { api } from "../Api";
import { ApiResponse } from "../Api.types";
import * as Types from "./portfolioApi.types";

const getStrategies = (
  assetClass?: Types.EAssetClass
): Promise<ApiResponse<Types.TStrategy[]>> => {
  return api.get<Types.TStrategy[]>("/v1/strategies", {
    params: { assetClass },
  });
};

const getIndexPortfolios = (
  strategyId: number
): Promise<ApiResponse<Types.TIndexPortfolio[]>> => {
  return api.get<Types.TIndexPortfolio[]>(
    `/v1/strategies/${strategyId}/portfolios`
  );
};

const getStrategyById = (
  strategyId: number
): Promise<ApiResponse<Types.TStrategy>> => {
  return api.get<Types.TStrategy>(`/v1/strategies/${strategyId}`);
};

const getTradingSignals = (
  strategyId: number
): Promise<ApiResponse<Types.TTradingSignals>> => {
  return api.get<Types.TTradingSignals>(
    `/v1/trading-signals/strategy/${strategyId}`
  );
};

// Preview method (only for create)
const previewCreate = (data: Types.CreateStrategyRequest) => {
  return api.post<Types.CreateStrategyPreviewResponse>(
    "/v1/strategies/preview",
    data
  );
};

// Add/Remove Asset APIs
const previewAddAsset = (strategyId: number, asset: string) => {
  return api.post<Types.AddAssetPreviewResponse>(
    `/v1/strategies/${strategyId}/preview-add-asset?asset=${asset}`
  );
};

const addAsset = (strategyId: number, asset: string) => {
  return api.post<Types.TStrategy>(`/v1/strategies/${strategyId}/add-asset`, {
    asset,
  });
};

const previewRemoveAsset = (strategyId: number, asset: string) => {
  return api.post<Types.RemoveAssetPreviewResponse>(
    `/v1/strategies/${strategyId}/preview-remove-asset?asset=${asset}`
  );
};

const removeAsset = (strategyId: number, asset: string) => {
  return api.post<Types.TStrategy>(
    `/v1/strategies/${strategyId}/remove-asset`,
    {
      asset,
    }
  );
};

const updateStrategy = (
  strategyId: number,
  data: Types.UpdateStrategyRequest
) => {
  return api.put<Types.TStrategy>(`/v1/strategies/${strategyId}`, data);
};

const createStrategy = (data: Types.CreateStrategyRequest) => {
  return api.post<Types.TStrategy>("/v1/strategies", data);
};

const getStrategySignals = (
  strategyId: number
): Promise<ApiResponse<Types.SignalResponse[]>> => {
  return api.get<Types.SignalResponse[]>(`/v1/signals/strategy/${strategyId}`);
};

export const portfolioApi = {
  getStrategies,
  getIndexPortfolios,
  getStrategyById,
  getTradingSignals,
  previewCreate,
  previewAddAsset,
  addAsset,
  previewRemoveAsset,
  removeAsset,
  updateStrategy,
  createStrategy,
  getStrategySignals,
};
