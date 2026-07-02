import * as Speech from 'expo-speech';
import { Logger } from './logger';

export class AudioService {
  /**
   * Zatrzymuje aktualną syntezę mowy.
   */
  public static async stop(): Promise<void> {
    try {
      await Speech.stop();
    } catch (error) {
      // Ciche zignorowanie błędu przy stopie, jeśli silnik nie był uruchomiony
    }
  }

  /**
   * Odczytuje podany tekst na głos.
   * Przed odtworzeniem zatrzymuje aktualnie czytany komunikat.
   */
  public static async speak(text: string, traceId: string): Promise<void> {
    Logger.info(traceId, 'AudioService.speak requested', { textLength: text.length });
    
    try {
      // Najpierw zatrzymaj poprzednie odtwarzanie
      await this.stop();

      // Rozpocznij syntezę mowy w języku polskim
      Speech.speak(text, {
        language: 'pl-PL',
        onError: (err) => {
          Logger.error(traceId, 'TTS native callback error occurred', { error: String(err) });
        }
      });

      Logger.info(traceId, 'AudioService.speak successfully initiated');
    } catch (error) {
      Logger.error(traceId, 'AudioService.speak failed to execute', {
        error: String(error),
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
