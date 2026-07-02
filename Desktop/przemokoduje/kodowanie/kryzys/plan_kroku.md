# Plan Kroku: KRYZYS-005-POZAR-KUCHNA

## 1. Cel
Implementacja nowego, odizolowanego modułu funkcjonalnego "Pożar tłuszczu na patelni w kuchni" w katalogu `src/features/pozar` zgodnie ze specyfikacją krok po kroku oraz wbudowanym 15-minutowym timerem bezpieczeństwa. Zadanie obejmuje również odblokowanie modułu "Pożary" na ekranie głównym.

## 2. Pliki (Struktura i nowo tworzone pliki)

### Tworzone pliki i foldery:
*   [NEW] `src/features/pozar/types.ts` – typy i interfejsy dla kroku pożaru (`PozarStep`).
*   [NEW] `src/features/pozar/data.ts` – niezmienna sekwencja kroków awaryjnych pożaru tłuszczu.
*   [NEW] `src/features/pozar/usePozarState.ts` – hook stanu obsługujący kroki, nadrzędny traceId oraz logikę 15-minutowego timera na ostatnim etapie.
*   [NEW] `src/features/pozar/PozarScreen.tsx` – minimalistyczny ekran procedury pożaru w kuchni, zintegrowany z TTS (AudioService) oraz wyświetlaczem timera.

### Zmiany w plikach:
*   [MODIFY] `src/features/home/HomeScreen.tsx` – odblokowanie kafelka "POŻARY" i umożliwienie przejścia do `PozarScreen`. Przed edycją wykonano już kopię `HomeScreen.tsx.bak`.
*   [MODIFY] `App.tsx` – zintegrowanie nowego stanu ekranu `'pozar'` i renderowanie `PozarScreen`.
*   [MODIFY] `src/features/navigation/useNavigationState.ts` – rozszerzenie typu `ScreenType` o status `'pozar'`.

## 3. Logika działania

### Krok po kroku i typowanie
Procedura pożaru tłuszczu:
1. **Krok 1**: BEZWZGLĘDNY ZAKAZ GASZENIA WODĄ! Ewakuacja jeśli ogień jest zbyt duży. [Tło/Akcent: `#FF3B30` - Czerwony]
2. **Krok 2**: Wyłącz źródło zasilania (płytę indukcyjną, gaz). [Tło/Akcent: `#FFCC00` - Żółty]
3. **Krok 3**: Przykryj patelnię metalową pokrywką lub wilgotnym ręcznikiem. [Tło/Akcent: `#FFCC00` - Żółty]
4. **Krok 4**: NIE ZDEJMUJ POKRYWKI przez minimum 15 minut do ostygnięcia tłuszczu. Uruchomienie timera. [Tło/Akcent: `#34C759` - Zielony]

### 15-minutowy Timer Bezpieczeństwa
- Timer jest aktywowany automatycznie, kiedy użytkownik wkracza na ostatni krok (`Krok 4`).
- Odliczanie zaczyna się od `900` sekund (15 minut).
- Hook udostępnia sformatowany czas w postaci `MM:SS` (np. `15:00`) oraz flagę `isTimerFinished`.
- Logger loguje fakt startu timera, zakończenia oraz ewentualnego resetu.

### Integracja TTS i Nawigacja
- Przy każdym kroku asysta głosowa automatycznie czyta tytuł i opis.
- Po wejściu na krok 4 asysta odczyta instrukcję, a timer zacznie odliczanie.
- Przycisk "Wróć" na ekranie pożaru pozwala wrócić do menu głównego, wyciszając jednocześnie lektora i zatrzymując timer.

## 4. Koszty i ryzyka
- **Wydajność Timera w JS Thread**: Standardowy `setInterval` w React Native może spowalniać aplikację, jeśli wykonuje skomplikowane operacje. Nasze odliczanie modyfikuje jedynie stan liczby sekund raz na sekundę i nie wpływa na wydajność. Logowanie będzie ograniczone wyłącznie do kluczowych zdarzeń (Start / Koniec / Reset), co zapobiegnie zapychaniu konsoli.
