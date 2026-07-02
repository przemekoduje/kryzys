import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { usePrzejazdState } from './usePrzejazdState';
import { AudioService } from '../../core/audio';
import { LinkingService } from '../../core/linking';

const { width } = Dimensions.get('window');

export function PrzejazdScreen() {
  const {
    currentStep,
    nextStep,
    prevStep,
    isFirst,
    isLast,
    currentIndex,
    steps,
    traceId
  } = usePrzejazdState();

  // Automatyczna asysta głosowa przy załadowaniu/zmianie kroku
  useEffect(() => {
    const textToSpeak = `${currentStep.title}. ${currentStep.description}`;
    AudioService.speak(textToSpeak, traceId);

    // Zatrzymanie odtwarzania przy opuszczaniu ekranu (cleanup) lub zmianie kroku
    return () => {
      AudioService.stop();
    };
  }, [currentStep, traceId]);

  const handleCallSOS = () => {
    LinkingService.makeCall('112', traceId);
  };

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

        {/* Sekcja SOS na ostatnim kroku */}
        {isLast && (
          <View style={styles.sosContainer}>
            <TouchableOpacity style={styles.sosButton} onPress={handleCallSOS}>
              <Text style={styles.sosButtonText}>ZADZWOŃ POD 112</Text>
            </TouchableOpacity>

            <View style={styles.cheatSheet}>
              <Text style={styles.cheatSheetLabel}>ŚCIĄGAWKA DLA ROZMOWY:</Text>
              <Text style={styles.cheatSheetText}>
                "Powiedz dyspozytorowi: Awaria przejazdu kolejowego!"
              </Text>
            </View>
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

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: currentStep.colorCode }
          ]}
          onPress={nextStep}
        >
          <Text style={styles.buttonTextNext}>
            {isLast ? 'Zrozumiałem' : 'Dalej'}
          </Text>
        </TouchableOpacity>
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
  sosContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: '#E5E5EA',
    paddingTop: 16,
  },
  sosButton: {
    backgroundColor: '#FF3B30', // Głęboki czerwony dla przycisku SOS
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sosButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cheatSheet: {
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderColor: '#FF3B30',
  },
  cheatSheetLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8E8E93',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cheatSheetText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    lineHeight: 20,
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
