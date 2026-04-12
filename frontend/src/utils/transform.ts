/**
 * Recursively transforms snake_case keys in an object to camelCase.
 * Handles arrays, objects, and primitive values.
 */

type Primitive = string | number | boolean | null | undefined;

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function transformKeysToCamelCase<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => transformKeysToCamelCase(item)) as T;
  }

  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const key of Object.keys(obj as Record<string, any>)) {
      const camelKey = toCamelCase(key);
      const value = (obj as Record<string, any>)[key];
      result[camelKey] = transformKeysToCamelCase(value);
    }
    return result as T;
  }

  return obj;
}

/**
 * Transform API response data from snake_case to camelCase.
 * Handles paginated responses and direct arrays.
 */
export function transformApiResponse<T>(data: any): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle paginated response { items, total, page, page_size }
  if (data.items && Array.isArray(data.items)) {
    return {
      ...transformKeysToCamelCase(data),
      items: transformKeysToCamelCase(data.items)
    } as T;
  }

  // Handle direct array response
  if (Array.isArray(data)) {
    return transformKeysToCamelCase(data) as T;
  }

  // Handle single object response
  return transformKeysToCamelCase(data);
}
