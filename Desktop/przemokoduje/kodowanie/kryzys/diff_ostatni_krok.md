# Raport Code Review: KRYZYS-005-POZAR-KUCHNA

Wdrożenie modułu "Pożar tłuszczu na patelni w kuchni" (wraz z 15-minutowym timerem bezpieczeństwa, obsługą stanu kroków, integracją z asystą głosową oraz odblokowaniem ekranu w menu głównym) zostało zakończone sukcesem. Kompilator TypeScript (`npx tsc --noEmit`) nie wykazał żadnych błędów.

Poniżej znajdują się nowo wdrożone oraz zmodyfikowane moduły:

---

## 1. Typowanie i algorytm: [types.ts](file:///c:/Users/Admin/Desktop/przemokoduje/kodowanie/kryzys/src/features/pozar/types.ts) oraz [data.ts](file:///c:/Users/Admin/Desktop/przemokoduje/kodowanie/kryzys/src/features/pozar/data.ts)
```typescript
// types.ts
export interface PozarStep {
  id: 'warning' | 'cutoff' | 'smother' | 'timer';
  title: string;
  description: string;
  colorCode: string;
  iconName: string;
}

// data.ts
import { PozarStep } from './types';

export const POZAR_STEPS: PozarStep[] = [
  {
    id: 'warning',
    title: '1. Ostrzeżenie i zakaz',
    description: 'BEZWZGLĘDNY ZAKAZ GASZENIA WODĄ! Polanie rozgrzanego tłuszczu wodą spowoduje natychmiastowy wybuch pary i rozprzestrzenienie ognia na całe pomieszczenie.',
    colorCode: '#FF3B30',
    iconName: 'warning'
  },
  {
    id: 'cutoff',
    title: '2. Odcięcie energii',
    description: 'Wyłącz źródło zasilania płyty grzewczej (palnik gazowy, indukcję lub bezpiecznik), aby zatrzymać dalsze dostarczanie ciepła do płonącego tłuszczu.',
    colorCode: '#FFCC00',
    iconName: 'power'
  },
  {
    id: 'smother',
    title: '3. Tłumienie pokrywką',
    description: 'Nasunąć ostrożnie metalową pokrywkę lub wilgotny, dobrze wyciśnięty ręcznik/koc gaśniczy na patelnię, odcinając dopływ tlenu do ognia. Nie rzucaj nim, aby nie rozchlapać tłuszczu.',
    colorCode: '#FFCC00',
    iconName: 'cover'
  },
  {
    id: 'timer',
    title: '4. Czas na ostygnięcie',
    description: 'NIE ZDEJMUJ POKRYWKI przez minimum 15 minut! Przedwczesny dopływ tlenu spowoduje ponowny samozapłon gorących oparów oleju. Uruchom odliczanie.',
    colorCode: '#34C759',
    iconName: 'timer'
  }
];
```

---

## 2. Stan z timerem: [usePozarState.ts](file:///c:/Users/Admin/Desktop/przemokoduje/kodowanie/kryzys/src/features/pozar/usePozarState.ts)
```typescript
import { useState, useEffect, useRef } from 'react';
import { POZAR_STEPS } from './data';
import { PozarStep } from './types';
import { Logger } from '../../core/logger';

const TIMER_SECONDS = 900;

export function usePozarState() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isTimerFinished, setIsTimerFinished] = useState(false);
  
  const traceIdRef = useRef<string>('');
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  if (!traceIdRef.current) {
    traceIdRef.current = Logger.generateTraceId();
  }

  const traceId = traceIdRef.current;
  const currentStep = POZAR_STEPS[currentIndex];

  useEffect(() => {
    Logger.info(traceId, 'Kitchen fire procedure screen initialized', {
      totalSteps: POZAR_STEPS.length,
      initialStep: currentStep.id
    });

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        Logger.info(traceId, 'Timer interval cleaned up on screen unmount');
      }
    };
  }, []);

  useEffect(() => {
    if (isTimerActive && secondsLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            setIsTimerFinished(true);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            Logger.info(traceId, '15-minute kitchen fire safety timer finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerActive, secondsLeft]);

  useEffect(() => {
    if (currentStep.id === 'timer' && !isTimerActive && !isTimerFinished && secondsLeft === TIMER_SECONDS) {
      setIsTimerActive(true);
      Logger.info(traceId, '15-minute kitchen fire safety timer started');
    }
  }, [currentIndex]);

  const nextStep = () => {
    if (currentIndex < POZAR_STEPS.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextStepData = POZAR_STEPS[nextIndex];
      setCurrentIndex(nextIndex);
    }
  };

  const prevStep = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevStepData = POZAR_STEPS[prevIndex];
      setCurrentIndex(prevIndex);
    }
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setIsTimerFinished(false);
    setSecondsLeft(TIMER_SECONDS);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    Logger.info(traceId, 'Safety timer manually reset');
  };

  const formatTime = (): string => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
    const secsStr = secs < 10 ? `0${secs}` : `${secs}`;
    return `${minsStr}:${secsStr}`;
  };

  return {
    currentStep,
    currentIndex,
    steps: POZAR_STEPS,
    nextStep,
    prevStep,
    traceId,
    isFirst: currentIndex === 0,
    isLast: currentIndex === POZAR_STEPS.length - 1,
    formattedTime: formatTime(),
    isTimerFinished,
    isTimerActive,
    resetTimer
  };
}
```

---

## 3. Ekran UI z zegarem: [PozarScreen.tsx](file:///c:/Users/Admin/Desktop/przemokoduje/kodowanie/kryzys/src/features/pozar/PozarScreen.tsx)
*(Zaprojektowany z wielkim wyświetlaczem czasu 54px typu tabular-nums, dedykowanym przyciskiem resetu i stanami schładzania patelni w tle).*

---

## 4. Zaktualizowane menu główne: [HomeScreen.tsx](file:///c:/Users/Admin/Desktop/przemokoduje/kodowanie/kryzys/src/features/home/HomeScreen.tsx)
```diff
@@ -17,7 +17,7 @@
   {
     id: 'pozar',
     title: 'POŻARY',
     subtitle: 'Procedura ewakuacji i gaszenia w zarzewiu.',
-    enabled: false,
+    enabled: true,
     code: '02'
   },
```
*(Przed modyfikacją utworzono poprawnie plik kopii zapasowej [HomeScreen.tsx.bak](file:///c:/Users/Admin/Desktop/przemokoduje/kodowanie/kryzys/src/features/home/HomeScreen.tsx.bak)).*
