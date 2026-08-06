import { MovingAverageType } from "@/enums";
import { RotationHistory } from "@/provider";

export enum WarningSeverity {
  INFO = "INFO",
  WARNING = "WARNING",
  CRITICAL = "CRITICAL",
}

export enum EAssetClass {
  STOCK = "STOCK",
  CRYPTO = "CRYPTO",
  COMMODITY = "COMMODITY",
  FOREX = "FOREX",
  ETF = "ETF",
}

export enum EAssetStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  STOPPED = "STOPPED",
}

export enum EStrategyMode {
  FULLY_AUTOMATED = "FULLY_AUTOMATED",
  ADVISORY_NOTIFY_ONLY = "ADVISORY_NOTIFY_ONLY",
  ADVISORY_MANUAL_APPROVE = "ADVISORY_MANUAL_APPROVE",
}

export enum SignalType {
  BULL = "BULL",
  NEUTRAL = "NEUTRAL",
  BEAR = "BEAR",
}

export enum EWarningSeverity {
  INFO = "INFO",
  WARNING = "WARNING",
  CRITICAL = "CRITICAL",
}

export enum SignalStatus {
  PENDING = "PENDING",
  AUTO_EXECUTED = "AUTO_EXECUTED",
  MANUALLY_EXECUTED = "MANUALLY_EXECUTED",
  IGNORED = "IGNORED",
  SUPERSEDED = "SUPERSEDED",
  EXPIRED = "EXPIRED",
  NOTIFIED = "NOTIFIED",
}

export type TStrategy = {
  id: number;
  userId: number;
  name: string;
  walletCredentialsId: any;
  totalCapital: number;
  assets: string[];
  defensiveAsset: string;
  indexCurrency: string;
  indexCurrencyPrice: number;
  status: EAssetStatus;
  checkIntervalMinutes: number;
  timeframe: string;
  shortMaPeriod: number;
  longMaPeriod: number;
  lastCheckAt: string;
  nextCheckAt: string;
  numberOfPortfolios: number;
  createdAt: string;
  updatedAt: string;
  maType: MovingAverageType;
  mode: EStrategyMode;
  notificationEmail: string;
  sendEmailAlerts: boolean;
  slackWebhookUrl: any;
  sendSlackAlerts: boolean;
  telegramChatId: any;
  sendTelegramAlerts: boolean;
  assetClass: EAssetClass;
  region: string;
  scheduledRunTime: string;
};

export type TIndexPortfolio = {
  id: number;
  strategyId: number;
  indexAsset: string;
  allocatedCapital: number; // BigDecimal
  lotSize: number; // BigDecimal
  numberOfLots: number;
  currentDominantAsset?: string;
  currentPositionAssetQuantity?: number; // BigDecimal
  lastRotationAt?: string; // ISO LocalDateTime
  rotationHistories: RotationHistory[];
  createdAt: string; // ISO LocalDateTime
  updatedAt?: string; // ISO LocalDateTime
  indexCurrency: string;
  indexCurrencyPrice: number;
};

export interface AssetSignalDetail {
  asset: string;
  crossoverDetected: boolean;
  currentPrice: number;
  longMa: number;
  shortMa: number;
  signal: SignalType;
}

export interface PortfolioSignal {
  bullCandidates: string[];
  dominantAsset: string;
  indexAsset: string;
  signals: AssetSignalDetail[];
}

export interface TTradingSignals {
  strategyId: number;
  strategyName: string;
  timeframe: string;
  maType: string;
  shortMaPeriod: number;
  longMaPeriod: number;
  defensiveAsset: string;
  nextCheckAt: string;
  creationTime: string;
  portfolioSignals: PortfolioSignal[];
  isRotated: boolean;
}
export interface CreateStrategyPreviewResponse {
  strategyName: string;
  totalCapital: number;
  numberOfAssets: number;
  allocationPreview: AllocationPreview;
  warnings: PreviewWarning[];
  summary: string;
}

export interface AllocationPreview {
  totalCapital: number;
  numberOfAssets: number;
  allocatedPerAsset: number;
  allocations: AssetAllocation[];
  totalEstimatedLossUsdt: number;
  totalLossPercent: number;
}
export interface PreviewWarning {
  severity: EWarningSeverity;
  code: string;
  message: string;
  recommendation?: string;
}

export interface AssetAllocation {
  asset: string;
  allocatedCapital: number;
  fromAsset: string;
  fromPrice: number;
  toPrice: number;
  expectedAmount: number;
  estimatedActualAmount: number;
  estimatedRatio: number;
  valueBeforeUsdt: number;
  estimatedValueAfterUsdt: number;
  estimatedLossUsdt: number;
  estimatedSlippagePercent: number;
  quoteAvailable: boolean;
}

export interface AddAssetPreviewResponse {
  asset: string;
  strategyId: number;
  strategyName: string;
  currentState: StateSnapshot | null;
  afterAddState: StateSnapshot | null;
  conversions: AssetConversion[] | null;
  contributionPerOldAsset: number | null;
  newAllocationPerAsset: number | null;
  totalEstimatedFees: number | null;
  warnings: PreviewWarning[];
  summary: string | null;
}

export interface StateSnapshot {
  totalValue: number | null;
  assetsCount: number;
  allocationPerAsset: number | null;
  portfolios: PortfolioState[] | null;
}

export interface AssetConversion {
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  fromPrice: number;
  toPrice: number;
  valueBaseAsset: number;
  estimatedFee: number;
  estimatedSlippage: number;
  ratio: number;
  quoteAvailable: boolean;
}

export interface PortfolioState {
  indexAsset: string | null;
  asset: string;
  value: number | null;
  quantity: number | null;
  price: number | null;
  changeValue: number | null;
  changeQuantity: number | null;
}

export interface RemoveAssetPreviewResponse {
  asset: string;
  strategyId: number;
  strategyName: string;
  currentState: StateSnapshot | null;
  afterRemoveState: StateSnapshot | null;
  conversions: AssetConversion[] | null;
  contributionPerRemaining: number | null;
  removedPortfolioValue: number | null;
  totalEstimatedFees: number | null;
  warnings: PreviewWarning[];
  summary: string | null;
  canRemove: boolean;
  cannotRemoveReason: string | null;
}

export interface CreateStrategyRequest {
  name: string;
  walletCredentialsId?: string; // ID of the wallet credentials (required only for FULLY_AUTOMATED)
  totalCapital: number; // BigDecimal
  assets: string[]; // ["AAVE", "LTC", "LINK", ...]
  defensiveAsset: string; // "PAXG"
  indexCurrency: string; // "USDT", "PAXG", "BTC", "ETH" - benchmark currency
  checkIntervalMinutes: number; // Minimum 1
  timeframe?: string; // Kline interval: 1m, 5m, 15m, 1h, 4h, 1d (default: 1h)
  shortMaPeriod?: number; // Short MA period (default: 50)
  longMaPeriod?: number; // Long MA period (default: 200)
  maType: MovingAverageType; // Moving average type: SMA, EMA, WMA, HMA (required)

  // Strategy Mode fields
  mode?: EStrategyMode; // default FULLY_AUTOMATED
  notificationEmail?: string; // must be valid email format
  sendEmailAlerts?: boolean; // default false
  slackWebhookUrl?: string;
  sendSlackAlerts?: boolean; // default false
  telegramChatId?: string;
  sendTelegramAlerts?: boolean; // default false
  assetClass?: EAssetClass; // default CRYPTO

  // STOCK-specific fields
  scheduledRunTime?: string; // Daily run time for STOCK (format: "HH:mm"), required when assetClass = STOCK
}

export interface UpdateStrategyRequest {
  name?: string;
  walletCredentialsId?: number; // ID of the wallet credentials to use
  addedCoins?: string[];
  removedCoins?: string[];
  indexCurrency?: string; // Benchmark currency: "USDT", "PAXG", "BTC", "ETH"
  checkIntervalMinutes?: number;
  timeframe?: string; // Kline interval: 1m, 5m, 15m, 1h, 4h, 1d
  shortMaPeriod?: number; // Short MA period
  longMaPeriod?: number; // Long MA period
  maType?: MovingAverageType; // Moving average type: SMA, EMA, WMA, HMA (optional)

  // Strategy Mode fields
  mode?: EStrategyMode;
  notificationEmail?: string; // must be valid email format
  sendEmailAlerts?: boolean;
  slackWebhookUrl?: string;
  sendSlackAlerts?: boolean;
  telegramChatId?: string;
  sendTelegramAlerts?: boolean;

  // STOCK-specific fields
  scheduledRunTime?: string; // Daily run time for STOCK (format: "HH:mm")
}
export interface SignalResponse {
  id: number;
  portfolioId: number;
  indexAsset: string;
  signalType: SignalType | null;

  // Signal info
  fromAsset: string;
  toAsset: string;
  reason: string;
  confidenceScore: number | null;

  // Timestamps
  detectedAt: string;
  notifiedAt: string | null;
  executedAt: string | null;
  expiresAt: string | null;
  createdAt: string;

  // Status
  status: SignalStatus;

  // Helper fields (computed by backend)
  expired: boolean;
  canExecute: boolean;
  remainingSeconds: number;

  // Links
  rotationHistoryId: number | null;
  supersededById: number | null;
}
