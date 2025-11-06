# Hotwire - Cable Connection Game

Ein interaktives Drahtspiel, bei dem Spieler Kabel mit passenden Farben verbinden müssen, bevor die Zeit abläuft.

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
- [Rechtliches & Lizenz](#rechtliches--lizenz)

## Überblick

Hotwire ist ein spannendes Reaktionsspiel, bei dem Spieler unter Zeitdruck Kabelverbindungen herstellen müssen. Das Spiel kombiniert visuell ansprechende SVG-Grafiken mit intuitiver Drag-and-Drop-Interaktion und progressiv steigendem Schwierigkeitsgrad.

## Features

### Gameplay
- **Zeitbasierte Runden**: 45 Sekunden pro Runde (konfigurierbar)
- **Drag & Drop Interface**: Intuitive Maussteuerung für Kabelverbindungen
- **Visuelles Feedback**: Animierte Erfolgs-/Fehlschlag-Indikatoren
- **Progressiver Schwierigkeitsgrad**: Bis zu 10 verschiedene Kabelfarben
- **Fehlertoleranz**: Maximal 3 Fehlversuche pro Runde
- **Multi-Round System**: Bis zu 3 verlorene Runden vor permanentem Game Over

### Visuelle Effekte
- **Animierte Kabelverbindungen**: Realistische Kurven mit dynamischen Kontrollpunkten
- **Glow-Effekte**: Leuchtende Kabel und Anschlüsse
- **Farbkodierung**: 10 unterschiedliche Kabelfarben für klare Unterscheidung
- **Responsive Design**: Anpassung an verschiedene Bildschirmgrößen
- **Flash-Feedback**: Visuelle Rückmeldung bei Fehlern und Erfolg

## Technologien

- **Frontend**: React 18.3.1 mit TypeScript
- **Build Tool**: Vite 7.0.6
- **Icons**: Lucide React 0.344.0
- **Styling**: CSS mit SVG-Grafiken
- **Linting**: ESLint mit TypeScript-Support
- **Entwicklungssprache**: TypeScript 5.5.3

## Projektstruktur

```
hotwire/
├── public/                 # Statische Assets
├── src/
│   ├── components/
│   │   └── CableGame.tsx  # Hauptspiel-Komponente
│   ├── config/
│   │   └── gameConfig.ts  # Spielkonfiguration
│   ├── App.tsx            # Root-Komponente
│   ├── main.tsx           # Eintrittspunkt
│   ├── index.css          # Globale Styles
│   └── vite-env.d.ts      # Vite TypeScript Definitionen
├── index.html             # HTML Template
├── package.json           # Projekt-Dependencies
├── vite.config.ts         # Vite-Konfiguration
├── tsconfig.json          # TypeScript-Konfiguration
└── README.md              # Projektdokumentation
```

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

Die gebauten Dateien befinden sich im `dist/` Ordner und können auf jedem statischen Webserver deployed werden.

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
    "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6",
    "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#64748b"
  ]
};
```

## Anpassung & Erweiterung

### Neue Features hinzufügen
- **Schwierigkeitslevel**: Erweitere `gameConfig.ts` um Level-basierte Einstellungen
- **Sound-Effekte**: Integriere Audio-Feedback für Aktionen
- **Scoring-System**: Implementiere Punkte basierend auf Geschwindigkeit und Genauigkeit
- **Power-Ups**: Füge spezielle Fähigkeiten hinzu (Zeitverlängerung, Farbhilfen)

### Styling anpassen
- **Themes**: Erweitere `index.css` um verschiedene Farbthemen
- **Animationen**: Passe SVG-Animationen in `CableGame.tsx` an
- **Responsive Breakpoints**: Optimiere für verschiedene Gerätegrößen

## Rechtliches & Lizenz

**Proprietäre Software** - Alle Rechte vorbehalten.

Dieses Projekt ist urheberrechtlich geschützt. Die Nutzung, Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des Autors.

### Erlaubte Nutzung
- Persönliche, nicht-kommerzielle Nutzung
- Lokale Entwicklung und Testing

### Nicht erlaubt
- Kommerzielle Nutzung ohne Lizenz
- Weiterverbreitung des Codes
- Ableitung von Werken ohne Genehmigung

**Entwickelt von**: devsYn 

