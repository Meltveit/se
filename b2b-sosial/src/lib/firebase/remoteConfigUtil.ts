// src/lib/firebase/remoteConfigUtil.ts
import { remoteConfig } from './config';
import { fetchAndActivate, getValue, getAll } from 'firebase/remote-config';

/**
 * Safe utility functions for working with Firebase Remote Config
 * These functions will work gracefully in both client and server environments,
 * and handle the case where Remote Config is not available
 */

/**
 * Initialize and activate Remote Config
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export const initializeRemoteConfig = async (): Promise<boolean> => {
  // Skip in build/SSR context or if disabled
  if (typeof window === 'undefined' || 
      process.env.NEXT_PUBLIC_DISABLE_REMOTE_CONFIG === 'true') {
    return false;
  }

  if (!remoteConfig) {
    console.warn('Remote Config not available');
    return false;
  }

  try {
    const activated = await fetchAndActivate(remoteConfig);
    return activated;
  } catch (error) {
    console.error('Failed to initialize Remote Config:', error);
    return false;
  }
};

/**
 * Get a value from Remote Config with fallback
 * @param key - The parameter key
 * @param defaultValue - Default value if key doesn't exist or Remote Config is unavailable
 * @returns The value or default
 */
export const getRemoteConfigValue = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined' || 
      !remoteConfig || 
      process.env.NEXT_PUBLIC_DISABLE_REMOTE_CONFIG === 'true') {
    return defaultValue;
  }

  try {
    const value = getValue(remoteConfig, key);
    
    // Handle different value types
    if (typeof defaultValue === 'boolean') {
      return value.asBoolean() as unknown as T;
    } else if (typeof defaultValue === 'number') {
      return value.asNumber() as unknown as T;
    } else if (typeof defaultValue === 'object') {
      try {
        return JSON.parse(value.asString()) as T;
      } catch (e) {
        return defaultValue;
      }
    } else {
      return value.asString() as unknown as T;
    }
  } catch (error) {
    console.warn(`Error getting Remote Config value for ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Get all Remote Config values
 * @returns Object with all values or empty object if unavailable
 */
export const getAllRemoteConfigValues = (): Record<string, any> => {
  if (typeof window === 'undefined' || 
      !remoteConfig || 
      process.env.NEXT_PUBLIC_DISABLE_REMOTE_CONFIG === 'true') {
    return {};
  }

  try {
    const allValues = getAll(remoteConfig);
    const result: Record<string, any> = {};
    
    Object.entries(allValues).forEach(([key, value]) => {
      try {
        // Try to parse as JSON first
        result[key] = JSON.parse(value.asString());
      } catch (e) {
        // If not JSON, get as string
        result[key] = value.asString();
      }
    });
    
    return result;
  } catch (error) {
    console.warn('Error getting all Remote Config values:', error);
    return {};
  }
};