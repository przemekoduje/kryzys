import { PrzejazdStep } from './types';

export const PRZEJAZD_STEPS: PrzejazdStep[] = [
  {
    id: 'evacuation',
    title: '1. Ewakuacja',
    description: 'W przypadku awarii lub zablokowania pojazdu na przejeździe kolejowym, natychmiast ewakuuj wszystkich pasażerów poza rogatki i obszar torowiska.',
    colorCode: '#FF3B30', // Czerwony (ostrzegawczy)
    iconName: 'exit-run'
  },
  {
    id: 'sticker',
    title: '2. Żółta naklejka',
    description: 'Znajdź żółtą naklejkę, która znajduje się na napędzie rogatkowym lub od wewnętrznej strony krzyża św. Andrzeja. Odczytaj z niej 9-cyfrowy numer identyfikacyjny przejazdu.',
    colorCode: '#FFCC00', // Żółty
    iconName: 'label'
  },
  {
    id: 'call112',
    title: '3. Telefon 112',
    description: 'Zadzwoń na numer alarmowy 112. Zgłoś awarię/wypadek, podając dyspozytorowi 9-cyfrowy numer identyfikacyjny przejazdu z żółtej naklejki. Umożliwi to wstrzymanie ruchu pociągów. Powiedz dyspozytorowi: Awaria przejazdu kolejowego!',
    colorCode: '#34C759', // Zielony
    iconName: 'phone'
  }
];
