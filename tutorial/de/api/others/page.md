# o-page Komponente

`o-page` ist eine der Kernkomponenten in ofa.js und steht für eine eigenständige Seite oder Seitenmodul. Im Folgenden einige Schlüsselattribute und -methoden von `o-page`:

## src-Attribut

`src`-Attribut wird verwendet, um die spezifische Adresse eines Seitenmoduls anzugeben. Dies ist ein wichtiges Attribut zur Festlegung des Seiteninhalts und -verhaltens, das der Anwendung mitteilt, woher der Inhalt einer bestimmten Seite geladen werden soll.

```javascript
const page = this;
```

## goto-Methode

Die `goto`-Methode wird verwendet, um von der aktuellen Seite zu einer anderen Seite zu springen. Im Vergleich zur `goto`-Methode von `app` kann die `goto`-Methode von `page` **relative Adressen** verwenden, um zu anderen Seiten zu navigieren.

```javascript
page.goto("./page2.html");
```

## replace-Methode

Die `replace`-Methode dient dazu, die aktuelle Seite durch eine andere zu ersetzen. Sie ähnelt der `replace`-Methode von `app`, führt jedoch den Ersatz innerhalb der Seite aus.

```javascript
page.replace("./new-page.html");
```

## back-Methode

Die `back`-Methode wird verwendet, um zur vorherigen Seite zurückzukehren. Dies navigiert den Benutzer zur vorherigen Seite, ähnlich wie der Zurück-Button im Browser.

```javascript
page.back();
```