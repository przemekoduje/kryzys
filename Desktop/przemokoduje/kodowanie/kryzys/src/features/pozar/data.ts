import { PozarStep } from './types';

export const POZAR_STEPS: PozarStep[] = [
  {
    id: 'warning',
    title: '1. Ostrzeżenie i zakaz',
    description: 'BEZWZGLĘDNY ZAKAZ GASZENIA WODĄ! Polanie rozgrzanego tłuszczu wodą spowoduje natychmiastowy wybuch pary i rozprzestrzenienie ognia na całe pomieszczenie.',
    colorCode: '#FF3B30', // Czerwony ostrzegawczy
    iconName: 'warning'
  },
  {
    id: 'cutoff',
    title: '2. Odcięcie energii',
    description: 'Wyłącz źródło zasilania płyty grzewczej (palnik gazowy, indukcję lub bezpiecznik), aby zatrzymać dalsze dostarczanie ciepła do płonącego tłuszczu.',
    colorCode: '#FFCC00', // Żółty
    iconName: 'power'
  },
  {
    id: 'smother',
    title: '3. Tłumienie pokrywką',
    description: 'Nasunąć ostrożnie metalową pokrywkę lub wilgotny, dobrze wyciśnięty ręcznik/koc gaśniczy na patelnię, odcinając dopływ tlenu do ognia. Nie rzucaj nim, aby nie rozchlapać tłuszczu.',
    colorCode: '#FFCC00', // Żółty
    iconName: 'cover'
  },
  {
    id: 'timer',
    title: '4. Czas na ostygnięcie',
    description: 'NIE ZDEJMUJ POKRYWKI przez minimum 15 minut! Przedwczesny dopływ tlenu spowoduje ponowny samozapłon gorących oparów oleju. Uruchom odliczanie.',
    colorCode: '#34C759', // Zielony
    iconName: 'timer'
  }
];
