import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useNavigationState } from './src/features/navigation/useNavigationState';
import { HomeScreen } from './src/features/home/HomeScreen';
import { PrzejazdScreen } from './src/features/przejazd/PrzejazdScreen';
import { PozarScreen } from './src/features/pozar/PozarScreen';
import { UdarScreen } from './src/features/udar/UdarScreen';

export default function App() {
  const { currentScreen, navigateTo, traceId } = useNavigationState();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen navigateTo={navigateTo} navigationTraceId={traceId} />;
      case 'przejazd':
        return <PrzejazdScreen />;
      case 'pozar':
        return <PozarScreen />;
      case 'udar':
        return <UdarScreen />;
      default:
        return <HomeScreen navigateTo={navigateTo} navigationTraceId={traceId} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentScreen === 'home' ? (
        renderScreen()
      ) : (
        <View style={styles.screenWrapper}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('home')}>
              <Text style={styles.backButtonText}>← POWRÓT DO MENU</Text>
            </TouchableOpacity>
          </View>
          {renderScreen()}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenWrapper: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 1,
  },
});
