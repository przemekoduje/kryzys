import { useState, useEffect, useRef } from 'react';
import { PRZEJAZD_STEPS } from './data';
import { PrzejazdStep } from './types';
import { Logger } from '../../core/logger';

export function usePrzejazdState() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const traceIdRef = useRef<string>('');

  // Generuj traceId raz na sesję ekranu awaryjnego przejazdu
  if (!traceIdRef.current) {
    traceIdRef.current = Logger.generateTraceId();
  }

  const traceId = traceIdRef.current;
  const currentStep = PRZEJAZD_STEPS[currentIndex];

  useEffect(() => {
    Logger.info(traceId, 'Emergency procedure screen initialized', {
      totalSteps: PRZEJAZD_STEPS.length,
      initialStep: currentStep.id
    });
  }, []);

  const nextStep = () => {
    if (currentIndex < PRZEJAZD_STEPS.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextStepData = PRZEJAZD_STEPS[nextIndex];
      
      Logger.info(traceId, 'User navigated to next step', {
        fromIndex: currentIndex,
        fromStepId: currentStep.id,
        toIndex: nextIndex,
        toStepId: nextStepData.id
      });
      
      setCurrentIndex(nextIndex);
    } else {
      Logger.info(traceId, 'User tried to go to next step, but already at the end', {
        currentIndex,
        stepId: currentStep.id
      });
    }
  };

  const prevStep = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevStepData = PRZEJAZD_STEPS[prevIndex];
      
      Logger.info(traceId, 'User navigated to previous step', {
        fromIndex: currentIndex,
        fromStepId: currentStep.id,
        toIndex: prevIndex,
        toStepId: prevStepData.id
      });
      
      setCurrentIndex(prevIndex);
    } else {
      Logger.info(traceId, 'User tried to go to previous step, but already at the start', {
        currentIndex,
        stepId: currentStep.id
      });
    }
  };

  return {
    currentStep,
    currentIndex,
    steps: PRZEJAZD_STEPS,
    nextStep,
    prevStep,
    traceId,
    isFirst: currentIndex === 0,
    isLast: currentIndex === PRZEJAZD_STEPS.length - 1
  };
}
