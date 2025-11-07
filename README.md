# Hotwire - Cable Connection Game

Ein interaktives React-basiertes Drahtspiel, bei dem Spieler Kabel mit passenden Farben verbinden müssen, bevor die Zeit abläuft.

## Inhaltsverzeichnis

- [Überblick](#überblick)
- [Features](#features)
- [Technologien](#technologien)
- [Projektstruktur](#projektstruktur)
- [Installation & Entwicklung](#installation--entwicklung)
- [Build & Deployment](#build--deployment)
- [Spielregeln](#spielregeln)
- [Konfiguration](#konfiguration)
- [Anpassung & Erweiterung](#anpassung--erweiterung)
- [Lizenz](#lizenz)

## Überblick

Hotwire ist ein spannendes Reaktionsspiel, entwickelt mit React und TypeScript, bei dem Spieler unter Zeitdruck Kabelverbindungen herstellen müssen. Das Spiel kombiniert visuell ansprechende SVG-Grafiken mit intuitiver Drag-and-Drop-Interaktion und bietet eine herausfordernde Spielerfahrung.

## Features

### Gameplay
- **Zeitbasierte Runden**: 45 Sekunden pro Runde (konfigurierbar)
- **Drag & Drop Interface**: Intuitive Maussteuerung für Kabelverbindungen
- **Visuelles Feedback**: Animierte Erfolgs-/Fehlschlag-Indikatoren
- **10 verschiedene Kabelfarben**: Farbkodierte Verbindungselemente
- **Fehlertoleranz**: Maximal 3 Fehlversuche pro Runde
- **Multi-Round System**: Bis zu 3 verlorene Runden vor permanentem Game Over
- **Responsive Design**: Optimiert für verschiedene Bildschirmgrößen

### Visuelle Effekte
- **Animierte Kabelverbindungen**: Realistische Kurven mit dynamischen Kontrollpunkten
- **Glow-Effekte**: Leuchtende Kabel und Anschlüsse
- **Farbkodierung**: 10 unterschiedliche Kabelfarben für klare Unterscheidung
- **Flash-Feedback**: Visuelle Rückmeldung bei Fehlern und Erfolg
- **Timer-Animation**: Visueller Countdown mit Farbwechseln

## Technologien

### Frontend Stack
- **React 18.3.1**: Moderne UI-Bibliothek mit funktionalen Komponenten
- **TypeScript 5.5.3**: Statische Typisierung für bessere Code-Qualität
- **Vite 7.0.6**: Schnelles Build-Tool und Entwicklungsserver

### Entwicklungstools
- **ESLint 9.9.1**: Code-Qualität und Konsistenz
- **TypeScript ESLint 8.3.0**: TypeScript-spezifische Linting-Regeln
- **Vite Plugin React 4.3.1**: Hot Module Replacement für React

### UI & Styling
- **Lucide React 0.344.0**: Moderne Icon-Bibliothek
- **CSS3**: Native Styling mit SVG-Grafiken
- **Custom SVG**: Maßgeschneiderte Kabel-Visualisierung

## Projektstruktur

```
hotwire/
├── src/
│   ├── components/
│   │   └── CableGame.tsx      # Hauptspiel-Komponente (671 Zeilen)
│   ├── config/
│   │   └── gameConfig.ts      # Spielkonfiguration & Konstanten
│   ├── App.tsx                # Root-Komponente
│   ├── main.tsx               # React-Eintrittspunkt
│   ├── index.css              # Globale Styles & Animationen
│   └── vite-env.d.ts          # Vite TypeScript Definitionen
├── index.html                 # HTML Template
├── package.json               # Dependencies & Scripts
├── LICENSE                    # MIT Lizenz
├── vite.config.ts             # Vite Build-Konfiguration
├── tsconfig.json              # TypeScript-Konfiguration
├── tsconfig.app.json          # App-spezifische TS-Config
├── tsconfig.node.json         # Node-spezifische TS-Config
└── README.md                  # Projektdokumentation
```

### Wichtige Dateien

- **`CableGame.tsx`**: Kern des Spiels mit kompletter Spiellogik
- **`gameConfig.ts`**: Zentrale Konfiguration (Zeit, Farben, Limits)
- **`vite.config.ts`**: Build-Konfiguration mit GitHub Pages Support

## Installation & Entwicklung

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### Lokale Entwicklung

1. **Repository klonen**
   ```bash
   git clone https://github.com/sYnaTiion/hotwire.git
   cd hotwire
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```
   Das Spiel ist dann unter `http://localhost:5173` verfügbar.

4. **Code-Qualität prüfen**
   ```bash
   npm run lint
   ```

## Build & Deployment

### Production Build erstellen
```bash
npm run build
```

### Build lokal testen
```bash
npm run preview
```

### GitHub Pages Deployment
Das Projekt ist für GitHub Pages vorkonfiguriert:
- Base URL ist auf `/hotwire/` gesetzt (siehe `vite.config.ts`)
- Build-Artefakte werden im `dist/` Ordner erstellt
- Kann direkt über GitHub Actions deployed werden

Die gebauten Dateien können auf jedem statischen Webserver deployed werden.

## Spielregeln

### Ziel
Verbinde alle Kabel von der linken Seite mit den entsprechenden gleichfarbigen Anschlüssen auf der rechten Seite, bevor die Zeit abläuft.

### Steuerung
- **Drag & Drop**: Klicke auf einen linken Anschluss und ziehe zur entsprechenden Farbe rechts
- **Visuelle Hilfen**: Kabel leuchten beim Überfahren auf
- **Verbindungen**: Erfolgreich verbundene Kabel werden dauerhaft angezeigt

### Spielmechanik
- **Timer**: 45 Sekunden pro Runde
- **Fehlversuche**: Maximal 3 falsche Verbindungen pro Runde
- **Runden**: Bei Zeitüberschreitung oder zu vielen Fehlern verlierst du eine Runde
- **Game Over**: Nach 3 verlorenen Runden ist das Spiel beendet
- **Neustart**: Klicke "Neues Spiel starten" um von vorne zu beginnen

## Konfiguration

Die Spieleinstellungen können in `src/config/gameConfig.ts` angepasst werden:

```typescript
export const GAME_CONFIG = {
  timePerRound: 45,           
  numberOfCables: 10,       
  maxFailedAttempts: 3,     
  maxLostRounds: 3,           

  cableColors: [           
    "#ef4444",  // Rot
    "#3b82f6",  // Blau  
    "#10b981",  // Grün
    "#f59e0b",  // Gelb
    "#8b5cf6",  // Violett
    "#ec4899",  // Pink
    "#06b6d4",  // Cyan
    "#84cc16",  // Lime
    "#f97316",  // Orange
    "#64748b"   // Grau
  ]
};
```

### Verfügbare Optionen
- **timePerRound**: Zeit in Sekunden (Standard: 45)
- **numberOfCables**: Anzahl der Kabel (max. 10 wegen Farbarray)
- **maxFailedAttempts**: Fehlertoleranz pro Runde (Standard: 3)
- **maxLostRounds**: Anzahl verlorener Runden bis Game Over (Standard: 3)
- **cableColors**: Array mit Hex-Farbcodes für die Kabel

## Anpassung & Erweiterung

### Code-Architektur
Das Spiel ist modular aufgebaut und einfach erweiterbar:

- **`CableGame.tsx`**: Hauptkomponente mit State-Management
- **`gameConfig.ts`**: Zentrale Konfigurationsdatei
- **React Hooks**: useState, useEffect, useCallback für State-Management
- **TypeScript Interfaces**: Typisierte Datenstrukturen

### Neue Features hinzufügen
- **Schwierigkeitslevel**: Erweitere `gameConfig.ts` um Level-basierte Einstellungen
- **Sound-Effekte**: Integriere Web Audio API für Feedback
- **Scoring-System**: Implementiere Punkte basierend auf Zeit und Genauigkeit
- **Power-Ups**: Füge spezielle Fähigkeiten hinzu (Zeitverlängerung, Farbhilfen)
- **Bestenliste**: LocalStorage für persistente Highscores

### Styling & UI anpassen
- **Themes**: Erweitere `index.css` um CSS Custom Properties
- **Animationen**: Nutze CSS-Animationen und SVG-Transformationen
- **Icons**: Erweitere mit weiteren Lucide React Icons
- **Responsive Design**: Optimiere Breakpoints für Mobile/Tablet

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](./LICENSE) für Details.

**MIT License** - Copyright (c) 2025 devsYn

Freie Verwendung, Modifikation und Verteilung erlaubt. Keine Gewährleistung.

