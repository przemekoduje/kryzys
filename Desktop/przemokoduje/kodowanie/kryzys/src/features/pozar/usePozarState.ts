import { useState, useEffect, useRef } from 'react';
import { POZAR_STEPS } from './data';
import { PozarStep } from './types';
import { Logger } from '../../core/logger';

const TIMER_SECONDS = 900; // 15 minut = 900 sekund

export function usePozarState() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isTimerFinished, setIsTimerFinished] = useState(false);
  
  const traceIdRef = useRef<string>('');
  const timerIntervalRef = useRef<any>(null);

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

    // Cleanup przy wychodzeniu z ekranu
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        Logger.info(traceId, 'Timer interval cleaned up on screen unmount');
      }
    };
  }, []);

  // Obsługa timera w osobnym efekcie reagującym na stan aktywności i liczbę sekund
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

  // Automatyczne uruchomienie timera przy wejściu na krok 'timer'
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

      Logger.info(traceId, 'User navigated to next fire step', {
        fromIndex: currentIndex,
        fromStepId: currentStep.id,
        toIndex: nextIndex,
        toStepId: nextStepData.id
      });

      setCurrentIndex(nextIndex);
    }
  };

  const prevStep = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevStepData = POZAR_STEPS[prevIndex];

      Logger.info(traceId, 'User navigated to previous fire step', {
        fromIndex: currentIndex,
        fromStepId: currentStep.id,
        toIndex: prevIndex,
        toStepId: prevStepData.id
      });

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

  // Formatowanie sekund do MM:SS
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
