# Skript-Einführung

ofa.js kann direkt über ein script-Tag eingebunden werden. Fügen Sie dazu einfach folgenden Code im `<head>`- oder `<body>`-Bereich Ihrer HTML-Datei ein:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## Grundlegende Verwendung

Nach dem Einbinden des Skripts erstellt ofa.js eine `$`-Variable im globalen Scope. Alle Kernfunktionen werden über dieses Objekt bereitgestellt. Sie können über dieses Objekt auf die verschiedenen Methoden und Eigenschaften von ofa.js zugreifen. Die folgenden Tutorials werden die spezifische Verwendung im Detail vorstellen.

## Debug-Modus

Während der Entwicklung können Sie den Debug-Modus aktivieren, indem Sie den Parameter `#debug` an die Skript-URL anhängen:

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs#debug" type="module"></script>
```

Der Debug-Modus aktiviert die Source-Map-Funktion, sodass Sie in den Browser-Entwicklertools direkt auf den ursprünglichen Quellcode der Dateien zugreifen und ihn debuggen können, was die Entwicklungseffizienz erheblich steigert.

## ESM-Module

ofa.js unterstützt auch den Import über ESM-Module. Sie können ofa.js in Ihrem Projekt mit einer `import`-Anweisung einbinden:

```javascript
import 'https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs';
```

Bei der Verwendung von ESM-Modulen können Sie die Variable `$` direkt im Code verwenden, ohne über den globalen Gültigkeitsbereich darauf zuzugreifen.