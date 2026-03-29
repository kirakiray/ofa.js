# Merkmale der Beispieldaten

Durch `$` abgerufene oder erstellte Instanzobjekte verfügen über vollständige stanz-Datenmerkmale, da `$`-Instanzen von stanz erben. Das bedeutet, dass Sie die von `stanz` bereitgestellten Datenoperationen und Merkmale nutzen können, um die Daten von Instanzobjekten zu manipulieren und zu überwachen.

> Die folgenden Beispiele verwenden reguläre Elemente, da benutzerdefinierte Komponenten in der Regel bereits registrierte Daten mitbringen, während reguläre Elemente normalerweise nur Tag-Informationen enthalten und daher besser für die Demonstration geeignet sind.

## watch



Instanzen können Änderungen von Werten über die `watch`-Methode beobachten; selbst wenn der Wert eines Unterobjekts des Objekts geändert wird, kann die Änderung in der `watch`-Methode des Objekts wahrgenommen werden.

Im Folgenden finden Sie ein Beispiel, das zeigt, wie man die `$`-Instanz und die `watch`-Methode verwendet:

<o-playground name="stanz - watch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target.aaa = "Ich bin aaa";
        }, 600);
        setTimeout(() => {
          target.bbb = {
            child: {
              val: "Ich bin bbb child val",
            },
          };
        }, 1200);
        setTimeout(() => {
          target.bbb.child.val = "ändere bbb child val";
        }, 1800);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel erstellen wir zunächst eine `$`-Instanz `target` und verwenden dann die Methode `watch`, um ihre Änderungen zu überwachen. Selbst wenn wir Werte in untergeordneten Objekten ändern, z. B. den Wert von `target.bbb.child.val`, werden diese Änderungen von der Methode `watch` erkannt und der Inhalt des `logger`-Elements aktualisiert. Dies zeigt die leistungsstarke Funktionalität der `$`-Instanz und ermöglicht es dir, Objektänderungen mühelos zu überwachen.

## watchTick



`watchTick` und die `watch`-Methode haben ähnliche Funktionen, aber `watchTick` führt intern eine Drosselung durch und wird in einem einzelnen Thread nur einmal ausgeführt, daher kann es in Szenarien mit höheren Leistungsanforderungen effizienter Datenänderungen überwachen.

Nachfolgend ein Beispiel, das zeigt, wie die `watchTick`-Methode einer `$`-Instanz verwendet wird:

<o-playground name="stanz - watchTick" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        let count1 = 0;
        target.watch(() => {
          count1++;
          \$("#logger1").text = 'watch Anzahl der Ausführungen:' + count1;
        });
        let count2 = 0;
        target.watchTick(()=>{
          count2++;
          \$("#logger2").text = 'watchTick Anzahl der Ausführungen:' + count2;
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.bbb = "I am bbb";
          target.ccc = "I am ccc";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel erstellen wir zunächst eine `$`-Instanz namens `target`. Danach verwenden wir die Methoden `watch` und `watchTick`, um Änderungen am Objekt zu überwachen. Die Methode `watch` wird sofort bei Datenänderungen ausgeführt, während `watchTick` innerhalb eines einzelnen Threads nur einmal läuft und dadurch die Häufigkeit der Überwachungsoperationen begrenzt. Du kannst je nach Bedarf `watch` oder `watchTick` wählen, um Datenänderungen zu überwachen.

## unwatch



Die `unwatch`-Methode wird verwendet, um die Überwachung von Daten aufzuheben und kann zuvor registrierte `watch`- oder `watchTick`-Überwachungen widerrufen.

Hier ist ein Beispiel, das zeigt, wie man die `unwatch`-Methode der `$`-Instanz verwendet:

<o-playground name="stanz - unwatch" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger1" style="border: blue solid 1px; margin: 8px"></div>
      <div id="logger2" style="border: red solid 1px; margin: 8px"></div>
      <script>
        const target = $("#target");
        const tid1 = target.watch(() => {
          \$("#logger1").text = JSON.stringify(target);
        });
        const tid2 = target.watchTick(()=>{
          \$("#logger2").text = JSON.stringify(target);
        });
        setTimeout(() => {
          target.aaa = "I am aaa";
          target.unwatch(tid1);
          target.unwatch(tid2);
        }, 500);
        setTimeout(() => {
          target.bbb = "I am aaa";
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel erstellen wir zunächst eine `$`-Instanz `target` und registrieren dann mit der `watch`-Methode und der `watchTick`-Methode jeweils einen Listener. Anschließend widerrufen wir diese beiden Listener, indem wir der `unwatch`-Methode die zuvor gespeicherten Rückgabewerte `tid1` und `tid2` übergeben. Das bedeutet, dass die Attributänderung im ersten `setTimeout` keinen Listener auslöst, da die Listener bereits widerrufen wurden.

## Nicht überwachte Werte

In `$` Instanzen zeigen Attributnamen, die mit einem Unterstrich `_` beginnen, an, dass diese Werte nicht von den Methoden `watch` oder `watchTick` überwacht werden. Dies ist sehr nützlich für temporäre oder private Attribute, die du beliebig ändern kannst, ohne eine Überwachung auszulösen.

In der Vorlage wird dies als [nicht-reaktive Daten](../../documentation/state-management.md) bezeichnet.

Hier ist ein Beispiel, das zeigt, wie man Eigenschaftswerte mit Unterstrich am Anfang verwendet, um Abhörversuche zu vermeiden:

<o-playground name="stanz - Nicht-reaktive Daten" style="--editor-height: 480px">
  <code path="demo.html">
    <template>
      <div id="target"></div>
      <br />
      <div id="logger" style="border: #aaa solid 1px; padding: 8px"></div>
      <script>
        const target = $("#target");
        \$("#logger").text = target;
        target.watch(() => {
          \$("#logger").text = target;
        });
        setTimeout(() => {
          target._aaa = "Ich bin aaa";
        }, 600);
        setTimeout(() => {
          target._aaa = "ändere aaa";
        }, 1200);
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel erstellen wir eine `$`-Instanz `target` und verwenden die `watch`-Methode, um Änderungen von Eigenschaftswerten zu überwachen. In `setTimeout` versuchen wir, den Wert der Eigenschaft `_aaa` zu ändern, diese Änderung löst jedoch keine Überwachung aus. Dies ist sehr nützlich für Fälle, in denen Eigenschaftswerte aktualisiert werden sollen, ohne eine Überwachung auszulösen.

## Grundmerkmale

Objektdaten, die auf der Instanz gesetzt werden, werden in eine Stanz-Instanz konvertiert, und diese Stanz-Instanz ermöglicht das Abhören.

```javascript
const obj = {
  val: "Ich bin obj"
};

$("#target").obj = obj;
console.log($("#target").obj.val === obj.val);
console.log($("#target").obj === obj);
```

Wir können auch `$.stanz` verwenden, um Stanz-Daten zu erstellen, die nicht an eine Instanz gebunden sind.

```javascript
const data = $.stanz({
  val: "Ich bin val"
});

data.watch(() => {
  console.log(data.val);
});

data.val = "val ändern";
```

Diese Beispiele zeigen grundlegende Merkmale beim Setzen von Objektdaten als Stanz-Instanz zum Lauschen.

Weitere vollständige Funktionen finden Sie unter [stanz](https://github.com/ofajs/stanz).