# PATH



Das `PATH`-Attribut wird normalerweise auf benutzerdefinierten Komponenten oder Seitenkomponenten verwendet, um die Dateiadresse der registrierten Komponente abzurufen. Dies kann während der Entwicklung helfen, die Herkunft der Komponente zu verstehen, insbesondere wenn du andere Ressourcendateien referenzieren oder laden musst. Dabei kannst du das `PATH`-Attribut verwenden, um Dateipfade zu erstellen.

Im Folgenden finden Sie ein einfaches Beispiel, das demonstriert, wie man in einer benutzerdefinierten Komponente die Eigenschaft `PATH` verwendet:

```javascript
const componentPath = $("#myCustomComponent").PATH;
```

In diesem Beispiel haben wir ein `my-comp`-Element mit der `id` "myCustomComponent" ausgewählt und dann über das `PATH`-Attribut den Dateipfad dieser benutzerdefinierten Komponente abgerufen. Sie können die Variable `componentPath` nach Bedarf im Skriptteil verwenden, beispielsweise um Pfade für andere Ressourcendateien zu erstellen oder andere Operationen durchzuführen.