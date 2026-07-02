import { Linking } from 'react-native';
import { Logger } from './logger';

export class LinkingService {
  /**
   * Wywołuje systemowe połączenie telefoniczne z podanym numerem.
   */
  public static async makeCall(phoneNumber: string, traceId: string): Promise<void> {
    const url = `tel:${phoneNumber}`;
    Logger.info(traceId, 'LinkingService.makeCall requested', { phoneNumber });

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
        Logger.info(traceId, 'LinkingService.makeCall dialer opened successfully');
      } else {
        Logger.warn(traceId, 'LinkingService.makeCall failed: protocol not supported on this device', { url });
      }
    } catch (error) {
      Logger.error(traceId, 'LinkingService.makeCall exception occurred', {
        error: String(error),
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
