/**
 * Enhanced API Response type with better error handling
 *
 * T for successful data type
 * E for extra data type when error occurs
 */
export type ApiResponse<T, E = Record<string, any>> = {
  data: T;
  metadata?: any;
  status: number;
  messageCode: string;
  message: string;
  extraData?: E;
};

/**
 * API setup parameters
 */
export type TApiSetupParams = {
  enableLogging?: boolean;
  token?: string;
};

/**
 * Request configuration with cancellation
 */
export type RequestConfig = {
  params?: Record<string, any>;
  headers?: Record<string, any>;
  timeout?: number;
  cancelToken?: any;
};

export type TSearchParams<T> = {
  contains?: T;
  equals?: T;
  notEquals?: T;
  specified?: boolean;
  in?: T[];
  notIn?: T[];
  greaterThan?: T;
  lessThan?: T;
  greaterThanOrEqual?: T;
  lessThanOrEqual?: T;
};

export type KSearchParams<T> = keyof TSearchParams<T>;

export type ListRequestParams<T = Record<string, any>> = {
  page?: number;
  size?: number;
  sort?: string;
} & {
  [K in keyof T]?: TSearchParams<T[K]>;
};

/**
 * Enhanced nil check that properly handles all falsy values we want to exclude
 * @param value - Value to check
 * @returns True if value should be filtered out
 */
function isNil(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (
    typeof value === "object" &&
    value !== null &&
    Object.keys(value).length === 0
  )
    return true;
  return false;
}

/**
 * Deeply clean an object by removing nil values at any level
 * @param obj - Object to clean
 * @returns Cleaned object without nil values
 */
function deepCleanObject(obj: any): any {
  if (isNil(obj)) return undefined;

  if (Array.isArray(obj)) {
    const cleaned = obj
      .map((item) => deepCleanObject(item))
      .filter((item) => !isNil(item));
    return cleaned.length > 0 ? cleaned : undefined;
  }

  if (typeof obj === "object" && obj !== null) {
    const cleaned: any = {};

    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = deepCleanObject(value);
      if (!isNil(cleanedValue)) {
        cleaned[key] = cleanedValue;
      }
    }

    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }

  return obj;
}

/**
 * Convert nested object to flat query params with dot notation
 * @param obj - Object to flatten
 * @param prefix - Current prefix for keys
 * @returns Flattened object
 */
function flattenObject(obj: any, prefix: string = ""): Record<string, any> {
  const flattened: Record<string, any> = {};

  if (isNil(obj)) return flattened;

  Object.entries(obj).forEach(([key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (isNil(value)) {
      // Skip nil values
      return;
    }

    if (Array.isArray(value)) {
      // Handle arrays by joining non-nil values and encoding
      const cleanArray = value.filter((item) => !isNil(item));
      if (cleanArray.length > 0) {
        // Join array items and encode the final string
        const joinedValue = cleanArray.join(",");
        flattened[newKey] = joinedValue;
      }
    } else if (typeof value === "object" && value !== null) {
      // Recursively flatten nested objects
      const nestedFlattened = flattenObject(value, newKey);
      Object.assign(flattened, nestedFlattened);
    } else {
      // Primitive values - encode them
      flattened[newKey] = String(value);
    }
  });

  return flattened;
}

/**
 * Convert search params to query params with deep object support
 * @param searchParams - Search params object with field names as keys
 * @returns Flattened query params object
 * @example
 * searchParamsToQueryParams({
 *   name: { contains: "John", specified: true },
 *   age: { greaterThan: 18, lessThan: 65 },
 *   nested: { deep: { value: "test", empty: null } }
 * })
 * // Returns: {
 * //   "name.contains": "John",
 * //   "name.specified": true,
 * //   "age.greaterThan": 18,
 * //   "age.lessThan": 65,
 * //   "nested.deep.value": "test"
 * // }
 */
export function searchParamsToQueryParams(
  searchParams: ListRequestParams | undefined
): Record<string, any> {
  if (!searchParams) return {};

  const { page, size, sort, ...rest } = searchParams;

  // First, deep clean the object to remove all nil values
  const cleanedParams = deepCleanObject(rest);

  if (!cleanedParams) return { page, size, sort };

  // Then flatten the cleaned object
  return {
    ...flattenObject(cleanedParams),
    page,
    size,
    sort,
  };
}


export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

