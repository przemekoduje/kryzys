import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { usePozarState } from './usePozarState';
import { AudioService } from '../../core/audio';

const { width } = Dimensions.get('window');

export function PozarScreen() {
  const {
    currentStep,
    nextStep,
    prevStep,
    isFirst,
    isLast,
    currentIndex,
    steps,
    traceId,
    formattedTime,
    isTimerFinished,
    isTimerActive,
    resetTimer
  } = usePozarState();

  // Automatyczna asysta głosowa TTS przy załadowaniu/zmianie kroku
  useEffect(() => {
    let textToSpeak = `${currentStep.title}. ${currentStep.description}`;
    
    // Jeśli to jest krok z timerem, dodaj informację o odliczaniu
    if (currentStep.id === 'timer') {
      textToSpeak += ' Timer bezpieczeństwa piętnaście minut został uruchomiony.';
    }

    AudioService.speak(textToSpeak, traceId);

    return () => {
      AudioService.stop();
    };
  }, [currentStep, traceId]);

  return (
    <View style={styles.container}>
      {/* Pasek postępu */}
      <View style={styles.progressContainer}>
        {steps.map((step, idx) => (
          <View
            key={step.id}
            style={[
              styles.progressBar,
              {
                backgroundColor: idx <= currentIndex ? step.colorCode : '#E0E0E0',
                flex: 1,
              },
              idx > 0 && { marginLeft: 6 }
            ]}
          />
        ))}
      </View>

      {/* Główna karta procedury */}
      <View style={[styles.card, { borderColor: currentStep.colorCode }]}>
        <View style={[styles.badge, { backgroundColor: currentStep.colorCode }]}>
          <Text style={styles.badgeText}>{currentStep.title.toUpperCase()}</Text>
        </View>

        <Text style={styles.description}>{currentStep.description}</Text>

        {/* Karta z odliczaniem czasu na ostatnim kroku */}
        {currentStep.id === 'timer' && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>CZAS DO OSTYGNĘCIA TŁUSZCZU:</Text>
            <Text style={[
              styles.timerText,
              isTimerFinished ? styles.timerFinishedText : null
            ]}>
              {formattedTime}
            </Text>
            {isTimerFinished ? (
              <View style={styles.safetyStatus}>
                <Text style={styles.safetyStatusText}>MOŻNA BEZPIECZNIE ZDJĄĆ POKRYWKĘ</Text>
              </View>
            ) : (
              <View style={styles.warningStatus}>
                <Text style={styles.warningStatusText}>NIE ZDEJMUJ POKRYWKI! TRWA SCHŁADZANIE</Text>
              </View>
            )}

            <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
              <Text style={styles.resetButtonText}>ZRESETUJ TIMER</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Przyciski nawigacyjne */}
      <View style={styles.navigation}>
        {!isFirst ? (
          <TouchableOpacity style={[styles.button, styles.backButton]} onPress={prevStep}>
            <Text style={styles.buttonTextBack}>Wróć</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonPlaceholder} />
        )}

        {!isLast ? (
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: currentStep.colorCode }
            ]}
            onPress={nextStep}
          >
            <Text style={styles.buttonTextNext}>Dalej</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonPlaceholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    padding: 24,
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    height: 6,
    width: '100%',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 240,
    justifyContent: 'center',
    marginBottom: 40,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  description: {
    fontSize: 18,
    lineHeight: 26,
    color: '#1C1C1E',
    marginBottom: 16,
  },
  timerContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: '#E5E5EA',
    paddingTop: 20,
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8E8E93',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  timerText: {
    fontSize: 54,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
    marginBottom: 12,
  },
  timerFinishedText: {
    color: '#34C759',
  },
  safetyStatus: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  safetyStatusText: {
    color: '#2E7D32',
    fontWeight: '800',
    fontSize: 12,
  },
  warningStatus: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningStatusText: {
    color: '#C62828',
    fontWeight: '800',
    fontSize: 12,
  },
  resetButton: {
    borderWidth: 1,
    borderColor: '#8E8E93',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#E5E5EA',
    marginRight: 12,
  },
  buttonPlaceholder: {
    flex: 1,
    marginRight: 12,
  },
  buttonTextBack: {
    color: '#3A3A3C',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextNext: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
