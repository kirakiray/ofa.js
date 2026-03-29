# Host-Styles injizieren

In Web Components ist es aufgrund der Einschränkungen von `slot`-Slots nicht möglich, die Stile von Elementen auf mehreren Ebenen innerhalb des Slots direkt festzulegen. Um dieses Problem zu lösen, bietet ofa.js die Komponente `<inject-host>` an, die es ermöglicht, Stile von innerhalb der Komponente in das Host-Element zu injizieren, wodurch die Stilkontrolle über Elemente auf mehreren Ebenen im Slot-Inhalt ermöglicht wird.

> Beachten Sie, dass es empfohlen wird, den [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted)-Selektor zu verwenden, um die Styles des Slot-Inhalts festzulegen. Verwenden Sie die Komponente `<inject-host>` nur, wenn die Anforderungen damit nicht erfüllt werden können.

## Grundlegende Verwendung

```html
<template component>
    <style>
        :host {
            display: block;
            border: 1px solid #007acc;
            padding: 10px;
        }
        /* Stile für direkte untergeordnete Elemente festlegen */
        /* ::slotted(user-list-item) {
            background-color: aqua;
        } */
    </style>
    <inject-host>
        <style>
            user-list user-list-item {
                background-color: aqua;
            }
            /* Stile für mehrstufig verschachtelte Elemente können ebenfalls festgelegt werden */
            user-list user-list-item .user-list-item-content {
                color: red;
            }
        </style>
    </inject-host>
    <script>
        export default async () => {
            return {
                tag: "user-list",
                // ...
            };
        };
    </script>
</template>
```

## Fallbeispiel

Das folgende Beispiel zeigt, wie man mit `<inject-host>` die Stile von verschachtelten Elementen innerhalb eines Slots setzt. Wir erstellen zwei Komponenten: die `user-list`-Komponente als Listencontainer und die `user-list-item`-Komponente als Listeneintrag. Über `<inject-host>` können wir in der `user-list`-Komponente die Stile von `user-list-item` und dessen inneren Elementen festlegen.

<o-playground name="Host-Styling-Injektion" style="--editor-height: 500px">
  <code path="index.html" preview>
    <template>
      <l-m src="./user-list.html"></l-m>
      <l-m src="./user-list-item.html"></l-m>
      <user-list>
        <user-list-item>
          <span>Zhang San</span>
          <span slot="age">25</span>
        </user-list-item>
        <user-list-item>
          <span class="item-name">Li Si</span>
          <span slot="age">30</span>
        </user-list-item>
      </user-list>
    </template>
  </code>
  <code path="user-list.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid gray;
          padding: 10px;
        }
      </style>
      <inject-host>
        <style>
          user-list user-list-item {
            background-color: blue;
            display: block;
            padding: 10px;
            margin: 5px 0;
          }
          user-list user-list-item .item-name {
            color: red;
            font-weight: bold;
          }
        </style>
      </inject-host>
      <slot></slot>
      <script>
        export default async () => {
          return {
            tag: "user-list",
          };
        };
      </script>
    </template>
  </code>
  <code path="user-list-item.html">
    <template component>
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
      <div class="item-age">
        Alter: <slot name="age"></slot>
      </div>
      <script>
        export default async () => {
          return {
            tag: "user-list-item",
          };
        };
      </script>
    </template>
  </code>
</o-playground>

In den Laufzeit-Ergebnissen ist zu sehen:- Die Hintergrundfarbe der `user-list-item`-Komponente ist aqua (über das `<inject-host>` der `user-list`-Komponente gesetzt)
- Die Textfarbe des Namens ist rot (über das `<inject-host>` der `user-list`-Komponente mit dem Stil `user-list-item .item-name` gesetzt)

## Funktionsweise

Die Komponente "<inject-host>" injiziert die intern enthaltenen Tag-Inhalte von "<style>" in das Host-Element der Komponente. Auf diese Weise können die injizierten Stilregeln die Komponentengrenzen durchbrechen und auf Elemente innerhalb der Slot-Platzhalter wirken.

Auf diese Weise kannst du:- Stile für Elemente beliebiger Tiefe innerhalb des Slot-Inhalts festlegen
- Den vollständigen Selektor-Pfad verwenden, um sicherzustellen, dass die Stile nur auf das Ziel-Element angewendet werden
- Die Kapselung der Komponentenstile beibehalten und gleichzeitig ein flexibles Stile-Durchdringen erreichen

## Hinweise

⚠️ **Risiko der Stilverunreinigung**: Da die injizierten Stile auf den Gültigkeitsbereich des Host-Elements wirken, können sie Elemente in anderen Komponenten beeinflussen. Halten Sie sich bei der Verwendung unbedingt an die folgenden Grundsätze:

1. **Verwenden Sie spezifische Selektoren**: Verwenden Sie nach Möglichkeit vollständige Komponenten-Tag-Pfade und vermeiden Sie zu allgemeine Selektoren.
2. **Fügen Sie Namensraum-Präfixe hinzu**: Fügen Sie Ihren Stilklassen eindeutige Präfixe hinzu, um Konflikte mit anderen Komponenten zu reduzieren.
3. **Vermeiden Sie allgemeine Tag-Selektoren**: Verwenden Sie nach Möglichkeit Klassennamen oder Attributselektoren anstelle von Tag-Selektoren.
4. **Überdenken Sie das Komponentendesign**: Überlegen Sie, ob Sie die Verwendung von `<inject-host>` durch Optimierung des Komponentendesigns vermeiden können. Beispielsweise ist die Verwendung des [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted)-Selektors in Kombination mit Kindkomponenten oft eleganter.

```html
<!-- Empfohlen ✅: Konkrete Selektoren verwenden -->
<inject-host>
    <style>
        user-list .list-item-content {
            color: red;
        }
    </style>
</inject-host>

<!-- Nicht empfohlen ❌: Zu allgemeine Selektoren verwenden -->
<inject-host>
    <style>
        .content {  /* Leicht mit anderen Komponenten in Konflikt geraten */
            color: red;
        }
    </style>
</inject-host>
```

### Leistungshinweise

Da `<inject-host>` das erneute Injizieren der Host-Stile auslöst und daraus möglicherweise ein Reflow oder ein Repaint der Komponente resultiert, sollte es mit Vorsicht in Szenarien mit häufigen Aktualisierungen verwendet werden.  
Wenn Sie Stile nur für Elemente der ersten Ebene innerhalb eines Slots festlegen müssen, verwenden Sie bevorzugt den [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted)-Pseudoklassenselektor, um zusätzlichen Render-Aufwand durch durchdringende Injektion zu vermeiden und eine bessere Leistung zu erzielen.