# Raport: KRYZYS-006-UDAR-FAST

Pomyślnie zaimplementowano moduł testu FAST dla podejrzenia udaru mózgu. Poniżej znajduje się podsumowanie zmian i nowo wdrożonych plików.

---

## 1. Struktura i typowanie testu FAST

### [NEW] `src/features/udar/types.ts`
```typescript
export interface UdarStep {
  id: 'face' | 'arms' | 'speech' | 'result';
  title: string;
  question?: string;
  description: string;
  instruction?: string;
}

export interface UdarAnswers {
  face: boolean | null;
  arms: boolean | null;
  speech: boolean | null;
}
```

### [NEW] `src/features/udar/data.ts`
```typescript
import { UdarStep } from './types';

export const UDAR_STEPS: UdarStep[] = [
  {
    id: 'face',
    title: 'F - Face (Twarz)',
    question: 'Czy opada kącik ust?',
    description: 'Poproś osobę o uśmiechnięcie się lub pokazanie zębów. Zwróć uwagę, czy uśmiech jest symetryczny i czy jeden kącik ust nie opada.'
  },
  {
    id: 'arms',
    title: 'A - Arms (Ramiona)',
    question: 'Czy jedno ramię opada przy podnoszeniu rąk?',
    description: 'Poproś osobę o zamknięcie oczu i wyciągnięcie obu rąk przed siebie wnętrzem dłoni do góry na 10 sekund. Zwróć uwagę, czy jedna ręka opada lub opuszcza się.'
  },
  {
    id: 'speech',
    title: 'S - Speech (Mowa)',
    question: 'Czy mowa jest bełkotliwa lub niezrozumiała?',
    description: 'Poproś osobę o powtórzenie prostego zdania (np. "Dzisiaj jest ładna pogoda"). Zwróć uwagę na bełkotanie, niewyraźną mowę lub trudności ze zrozumieniem polecenia.'
  },
  {
    id: 'result',
    title: 'T - Time / SOS',
    description: 'Czas to mózg! Każda sekunda opóźnienia zwiększa ryzyko trwałego uszkodzenia mózgu. Zareaguj natychmiast.'
  }
];
```

---

## 2. Stan z logiką szybkiego przekierowania

### [NEW] `src/features/udar/useUdarState.ts`
```typescript
import { useState, useEffect, useRef } from 'react';
import { UDAR_STEPS } from './data';
import { UdarAnswers } from './types';
import { Logger } from '../../core/logger';

export function useUdarState() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UdarAnswers>({
    face: null,
    arms: null,
    speech: null
  });
  
  const traceIdRef = useRef<string>('');
  
  if (!traceIdRef.current) {
    traceIdRef.current = Logger.generateTraceId();
  }
  
  const traceId = traceIdRef.current;
  const currentStep = UDAR_STEPS[currentIndex];
  
  useEffect(() => {
    Logger.info(traceId, 'FAST stroke test screen initialized');
  }, []);

  const hasSymptoms = answers.face === true || answers.arms === true || answers.speech === true;

  const handleAnswer = (answer: boolean) => {
    const stepId = currentStep.id;
    if (stepId === 'result') return;

    const newAnswers = { ...answers, [stepId]: answer };
    setAnswers(newAnswers);
    
    Logger.info(traceId, `User answered FAST test step: ${stepId}`, {
      step: stepId,
      answer,
      currentAnswers: newAnswers
    });

    if (answer === true) {
      setCurrentIndex(3);
      Logger.info(traceId, 'FAST stroke symptom detected. Immediate redirect to SOS/Result screen.');
    } else {
      if (currentIndex < 2) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(3);
      }
    }
  };

  const restartTest = () => {
    setAnswers({
      face: null,
      arms: null,
      speech: null
    });
    setCurrentIndex(0);
    Logger.info(traceId, 'FAST stroke test restarted');
  };

  return {
    currentStep,
    currentIndex,
    steps: UDAR_STEPS,
    answers,
    hasSymptoms,
    handleAnswer,
    restartTest,
    traceId
  };
}
```

---

## 3. Zmiany w istniejących plikach (Nawigacja i HomeScreen)

### [MODIFY] `src/features/navigation/useNavigationState.ts`
```diff
-export type ScreenType = 'home' | 'przejazd' | 'pozar';
+export type ScreenType = 'home' | 'przejazd' | 'pozar' | 'udar';
```

### [MODIFY] `App.tsx`
```diff
 import { PrzejazdScreen } from './src/features/przejazd/PrzejazdScreen';
 import { PozarScreen } from './src/features/pozar/PozarScreen';
+import { UdarScreen } from './src/features/udar/UdarScreen';
 
 export default function App() {
@@ -17,4 +18,6 @@ export default function App() {
       case 'pozar':
         return <PozarScreen />;
+      case 'udar':
+        return <UdarScreen />;
       default:
```

### [MODIFY] `src/features/home/HomeScreen.tsx`
```diff
   {
-    id: 'pierwsza_pomoc',
+    id: 'udar',
     title: 'PIERWSZA POMOC',
     subtitle: 'Resuscytacja krążeniowo-oddechowa i urazy.',
-    enabled: false,
+    enabled: true,
     code: '03'
   }
```

---

## 4. Weryfikacja statyczna
Uruchomiono:
```bash
npx tsc --noEmit
```
Status kompilacji: **Sukces** (0 błędów).
