import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  CreateAxiosDefaults,
} from "axios";
import { ApiResponse } from "./Api.types";

import Config from "react-native-config";
import { t } from "i18next";

const DEFAULT_TIMEOUT = 10000;

const config: CreateAxiosDefaults = {
  baseURL: "https://terminal.sm-local.duckdns.org/api/",
  timeout: DEFAULT_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

class Api {
  private _token: string = "";
  private _axios: AxiosInstance;

  constructor(customConfig?: CreateAxiosDefaults) {
    this._axios = axios.create(customConfig || config);
    this._setupInterceptors();
  }

  private _setupInterceptors(): void {
    // Request interceptor
    this._axios.interceptors.request.use(
      async (config) => {
        // // Add token to request
        if (this._token) {
          // config.headers.Authorization = `Bearer ${this._token}`;
        }
        config.headers["X-Session-Id"] = "f46888c9-d567-4d16-8b5e-85488c19aa59";
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this._axios.interceptors.response.use(
      (response) => {
        console.log(response);
        return response;
      },
      (error: AxiosError) => Promise.reject(error)
    );
  }

  private _formatResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      data: response.data?.data ?? response.data,
      metadata: response.data?.metadata,
      status: response.status,
      messageCode: response.data?.messageCode ?? "unknown_error",
      message: t(response.data?.messageCode, {
        defaultValue: response.data?.message ?? "An unknown error occurred",
      }),
      extraData: response.data?.extraData,
    };
  }

  // Public API methods
  async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this._axios.get(url, config);
    return this._formatResponse<T>(response);
  }

  async post<T>(
    url: string,
    data?: any,
    config?: any
  ): Promise<ApiResponse<T>> {
    const response = await this._axios.post(url, data, config);
    return this._formatResponse<T>(response);
  }

  async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this._axios.put(url, data, config);
    return this._formatResponse<T>(response);
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: any
  ): Promise<ApiResponse<T>> {
    const response = await this._axios.patch(url, data, config);
    return this._formatResponse<T>(response);
  }

  async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this._axios.delete(url, config);
    return this._formatResponse<T>(response);
  }

  injectToken(token: string): void {
    this._token = token;
  }

  ejectToken(): void {
    this._token = "";
  }
}

// Create and export the API instance
export const api = new Api();
