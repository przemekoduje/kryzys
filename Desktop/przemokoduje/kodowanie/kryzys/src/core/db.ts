import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logger } from './logger';

export interface PendingAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
}

export class OfflineStore {
  private static SYNC_QUEUE_KEY = '@kryzys_sync_queue';

  /**
   * Save a key-value pair locally.
   */
  public static async setItem(key: string, value: any, traceId: string): Promise<void> {
    Logger.debug(traceId, `OfflineStore: Saving key "${key}"`);
    try {
      const stringifiedValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringifiedValue);
      Logger.info(traceId, `OfflineStore: Successfully saved key "${key}"`);
    } catch (error) {
      Logger.error(traceId, `OfflineStore: Error saving key "${key}"`, { error });
      throw error;
    }
  }

  /**
   * Retrieve a value by key.
   */
  public static async getItem<T>(key: string, traceId: string): Promise<T | null> {
    Logger.debug(traceId, `OfflineStore: Fetching key "${key}"`);
    try {
      const value = await AsyncStorage.getItem(key);
      if (!value) {
        Logger.info(traceId, `OfflineStore: Key "${key}" not found`);
        return null;
      }
      Logger.debug(traceId, `OfflineStore: Found value for key "${key}"`);
      return JSON.parse(value) as T;
    } catch (error) {
      Logger.error(traceId, `OfflineStore: Error reading key "${key}"`, { error });
      return null;
    }
  }

  /**
   * Remove a value by key.
   */
  public static async removeItem(key: string, traceId: string): Promise<void> {
    Logger.debug(traceId, `OfflineStore: Removing key "${key}"`);
    try {
      await AsyncStorage.removeItem(key);
      Logger.info(traceId, `OfflineStore: Key "${key}" removed successfully`);
    } catch (error) {
      Logger.error(traceId, `OfflineStore: Error removing key "${key}"`, { error });
      throw error;
    }
  }

  /**
   * Queue an API sync action for when the connection returns.
   */
  public static async queueSyncAction(type: string, payload: any, traceId: string): Promise<void> {
    Logger.info(traceId, `OfflineStore: Queueing sync action of type "${type}"`);
    try {
      const currentQueue = await this.getItem<PendingAction[]>(this.SYNC_QUEUE_KEY, traceId) || [];
      const newAction: PendingAction = {
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type,
        payload,
        timestamp: Date.now(),
      };
      currentQueue.push(newAction);
      await this.setItem(this.SYNC_QUEUE_KEY, currentQueue, traceId);
      Logger.info(traceId, `OfflineStore: Sync action queued. Total queue size: ${currentQueue.length}`);
    } catch (error) {
      Logger.error(traceId, `OfflineStore: Failed to queue sync action`, { error });
      throw error;
    }
  }

  /**
   * Retrieve all pending sync actions.
   */
  public static async getPendingSyncActions(traceId: string): Promise<PendingAction[]> {
    Logger.debug(traceId, 'OfflineStore: Fetching pending sync actions');
    return (await this.getItem<PendingAction[]>(this.SYNC_QUEUE_KEY, traceId)) || [];
  }

  /**
   * Clear processed sync actions from queue.
   */
  public static async removeSyncAction(actionId: string, traceId: string): Promise<void> {
    Logger.info(traceId, `OfflineStore: Removing sync action "${actionId}" from queue`);
    try {
      const currentQueue = await this.getItem<PendingAction[]>(this.SYNC_QUEUE_KEY, traceId) || [];
      const filteredQueue = currentQueue.filter(action => action.id !== actionId);
      await this.setItem(this.SYNC_QUEUE_KEY, filteredQueue, traceId);
      Logger.info(traceId, `OfflineStore: Sync action removed. Total queue size: ${filteredQueue.length}`);
    } catch (error) {
      Logger.error(traceId, `OfflineStore: Failed to remove sync action "${actionId}"`, { error });
      throw error;
    }
  }
}
