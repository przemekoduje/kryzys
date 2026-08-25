import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { ScreenType } from '../navigation/useNavigationState';
import { Logger } from '../../core/logger';

interface CategoryTile {
  id: ScreenType | string;
  title: string;
  subtitle: string;
  enabled: boolean;
  code: string;
}

const CATEGORIES: CategoryTile[] = [
  {
    id: 'przejazd',
    title: 'PRZEJAZDY KOLEJOWE',
    subtitle: 'Awaria pojazdu lub blokada na torach. Procedura 3 razy P.',
    enabled: true,
    code: '01'
  },
  {
    id: 'pozar',
    title: 'POŻARY',
    subtitle: 'Procedura ewakuacji i gaszenia w zarzewiu.',
    enabled: true,
    code: '02'
  },
  {
    id: 'udar',
    title: 'PIERWSZA POMOC',
    subtitle: 'Resuscytacja krążeniowo-oddechowa i urazy.',
    enabled: true,
    code: '03'
  }
];

interface HomeScreenProps {
  navigateTo: (screen: ScreenType) => void;
  navigationTraceId: string;
}

export function HomeScreen({ navigateTo, navigationTraceId }: HomeScreenProps) {
  const handleTilePress = (tile: CategoryTile) => {
    if (!tile.enabled) {
      Logger.info(navigationTraceId, 'User clicked on disabled category tile', {
        tileId: tile.id,
        tileTitle: tile.title
      });
      return;
    }

    Logger.info(navigationTraceId, 'User selected category tile', {
      tileId: tile.id,
      tileTitle: tile.title
    });

    navigateTo(tile.id as ScreenType);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Dieter Rams Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>KRYZYS</Text>
          <Text style={styles.appSubtitle}>SYSTEM WSPOMAGANIA DECYZYJNEGO W SYTUACJACH AWARYJNYCH</Text>
          <View style={styles.divider} />
        </View>

        {/* Tiles Grid */}
        <View style={styles.tilesContainer}>
          {CATEGORIES.map((tile) => (
            <TouchableOpacity
              key={tile.id}
              style={[
                styles.tile,
                !tile.enabled && styles.tileDisabled
              ]}
              onPress={() => handleTilePress(tile)}
              activeOpacity={tile.enabled ? 0.7 : 1}
            >
              <View style={styles.tileHeader}>
                <Text style={styles.tileCode}>{tile.code}</Text>
                {!tile.enabled && (
                  <View style={styles.inactiveBadge}>
                    <Text style={styles.inactiveBadgeText}>WKRÓTCE</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.tileTitle}>{tile.title}</Text>
              <Text style={styles.tileSubtitle}>{tile.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dieter Rams Footer / Status bar */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SYSTEM STATUS: GOTOWY</Text>
          <Text style={styles.footerTrace}>SESJA: {navigationTraceId.substring(0, 15)}...</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    padding: 32,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 24,
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -2,
    lineHeight: 48,
  },
  appSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666666',
    marginTop: 8,
    letterSpacing: 1.5,
    lineHeight: 14,
  },
  divider: {
    height: 4,
    backgroundColor: '#000000',
    marginTop: 24,
  },
  tilesContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  tile: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0, // Dieter Rams: kąty ostre, proste formy
    padding: 24,
    marginBottom: 20,
  },
  tileDisabled: {
    borderColor: '#D1D1D6',
    opacity: 0.5,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tileCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  inactiveBadge: {
    borderWidth: 1,
    borderColor: '#8E8E93',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  inactiveBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#8E8E93',
  },
  tileTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tileSubtitle: {
    fontSize: 13,
    color: '#48484A',
    lineHeight: 18,
  },
  footer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderColor: '#E5E5EA',
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 1,
  },
  footerTrace: {
    fontSize: 9,
    color: '#8E8E93',
  },
});
