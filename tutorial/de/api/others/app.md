# o-app Komponente

`o-app` ist eine der Kernkomponenten in ofa.js und wird zur Konfiguration und Verwaltung der gesamten Anwendung verwendet. Im Folgenden einige Schlüsselattribute und -methoden der App:

## src



Das `src`-Attribut wird verwendet, um die spezifische Adresse des Anwendungsparameter-Konfigurationsmoduls anzugeben.

```javascript
const app = $("o-app");
console.log(app.src);
```

## current



Das `current`-Attribut wird verwendet, um die Instanz der aktuell angezeigten Seite abzurufen. Dies kann Ihnen helfen, auf die aktuell angezeigte Seite zuzugreifen und sie zu bearbeiten, z. B. um deren Inhalt zu aktualisieren oder bestimmte Aktionen auszuführen.

```javascript
const currentPage = app.current;
```

## goto



Die Methode `goto` wird verwendet, um zu einer bestimmten Seite zu springen. Sie können die Adresse der Zielseite übergeben, und die Anwendung lädt und zeigt diese Seite an. Dies ist eine wichtige Methode für die Navigation in der Anwendung.

```javascript
app.goto("/page2.html");
```

## replace



Die Methode `replace` ist ähnlich wie `goto`, ersetzt jedoch die aktuelle Seite anstatt eine neue Seite auf den Stapel zu legen. Sie kann verwendet werden, um eine Seitenersetzung statt einer Stapelnavigation zu realisieren.

```javascript
app.replace("/new-page.html");
```

## back



Die `back`-Methode wird verwendet, um zur vorherigen Seite zurückzukehren und ermöglicht die Navigation rückwärts durch die Seiten. Dadurch wird der Benutzer zur vorherigen Seite zurückgeleitet.

```javascript
app.back();
```

## routers



Die Eigenschaft `routers` enthält die Routing-Konfigurationsinformationen der Anwendung. Dies ist eine wichtige Eigenschaft, die die Routing-Regeln und Zuordnungen der einzelnen Seiten innerhalb der Anwendung definiert. Die Routing-Konfiguration bestimmt die Navigation zwischen Seiten und die Behandlung von URLs.

```javascript
const routeConfig = app.routers;
```