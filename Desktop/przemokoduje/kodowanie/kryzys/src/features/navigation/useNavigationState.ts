import { useState, useEffect, useRef } from 'react';
import { Logger } from '../../core/logger';

export type ScreenType = 'home' | 'przejazd' | 'pozar' | 'udar';

export function useNavigationState() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const traceIdRef = useRef<string>('');

  if (!traceIdRef.current) {
    traceIdRef.current = Logger.generateTraceId();
  }

  const traceId = traceIdRef.current;

  useEffect(() => {
    Logger.info(traceId, 'Navigation initialized, user is on Home Screen', {
      initialScreen: 'home'
    });
  }, []);

  const navigateTo = (screen: ScreenType) => {
    Logger.info(traceId, 'User requested navigation', {
      currentScreen,
      targetScreen: screen
    });
    setCurrentScreen(screen);
  };

  return {
    currentScreen,
    navigateTo,
    traceId
  };
}
