# Stilabfragen



## Kernkonzepte

- **match-var**: Stil-Matching-Komponente, die entscheidet, ob interne Stile angewendet werden, basierend auf dem Wert der CSS-Variablen
- **Attribut-Matching**: Definiert über Komponentenattribute, welche CSS-Variablen und erwarteten Werte abgeglichen werden sollen
- **Stilanwendung**: Bei erfolgreichem Matching werden die Stile des internen `<style>`-Tags auf die Komponente angewendet

## Grundlegende Verwendung

Die `match-var`-Komponente definiert über Attribute die abzugleichenden CSS-Variablen und die erwarteten Werte. Sobald der CSS-Variablenwert der Komponente mit dem angegebenen Attributwert übereinstimmt, werden die innerhalb definierten Stile angewendet.

```html
<match-var theme="dark">
  <style>
    :host {
      background-color: #333;
      color: white;
    }
  </style>
</match-var>
```

### Attribute

Die `match-var`-Komponente verwendet beliebige Attribute, um die Übereinstimmungsregeln für CSS-Variablen zu definieren. Der Attributname entspricht dem CSS-Variablennamen (ohne das `--`-Präfix), und der Attributwert ist der erwartete Übereinstimmungswert.

### Funktionsweise

1. **Browser-Unterstützung**: Wenn der Browser `@container style()`-Abfragen unterstützt, werden die nativen CSS-Fähigkeiten direkt verwendet.

2. **Fallback-Behandlung**: Wenn dies nicht unterstützt wird, werden Änderungen der CSS-Variablenwerte durch Abfrage erkannt, und nach erfolgreicher Übereinstimmung werden Stile dynamisch injiziert.

3. **Manuelle Aktualisierung**: Die Stilerkennung kann manuell durch die Methode `$.checkMatch()` ausgelöst werden.

## Grundlegendes Beispiel

<o-playground name="Grundlegendes Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./theme-box.html"></l-m>
      <style>
        :host{
            display: block;
        }
      </style>
      <style>
        .container{
           --theme: data(currentTheme);
        }
      </style>
      <button on:click="changeTheme">Thema wechseln</button> - Thema:{{currentTheme}}
      <div class="container">
        <theme-box>
          Zeigt unterschiedliche Stile basierend auf CSS-Variablen an
        </theme-box>
      </div>
        <theme-box style="--theme: light;">
          Zeigt helles Thema an
        </theme-box>
        <theme-box style="--theme: dark;">
          Zeigt dunkles Thema an
        </theme-box>
      </div>
      <script>
        export default async ()=>{
          return {
            data: {
                currentTheme: "light",
            },
            proto:{
                changeTheme(){
                    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
                }
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="theme-box.html" active>
    <template component>
      <style>
        :host {
          display: block;
          margin: 8px 0;
        }
        .content {
          padding: 20px;
          border-radius: 4px;
        }
      </style>
      <match-var theme="light">
        <style>
          .content {
            background-color: #f5f5f5;
            color: #333;
          }
        </style>
      </match-var>
      <match-var theme="dark">
        <style>
          .content {
            background-color: #333;
            color: white;
          }
        </style>
      </match-var>
      <div class="content">
        <slot></slot>
      </div>
      <script>
        export default {
          tag: "theme-box",
          data: {
            theme: "light",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## Mehrfachbedingungs-Abgleich

Mehrere Attribute können gleichzeitig verwendet werden, um komplexere Übereinstimmungsbedingungen zu definieren; Stile werden nur angewendet, wenn alle CSS-Variablen übereinstimmen.

```html
<match-var theme="dark" size="large">
  <style>
    :host {
      padding: 20px;
      font-size: 18px;
    }
  </style>
</match-var>
```

## Beispiel für die Mehrfachbedingungsabgleichung

<o-playground name="Beispiel für Attribut-Übereinstimmung" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="./page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <style>
        :host {
            display: block;
        }
      </style>
      <style>
        .content{
            --theme: data(theme);
            --size: data(size);
        }
      </style>
      <l-m src="./test-card.html"></l-m>
      <div>Theme: {{theme}} <button on:click="changeTheme">Theme wechseln</button></div>
      <div>Größe: {{size}} <button on:click="changeSize">Größe wechseln</button></div>
      <div class="content">
        <test-card>
          <div>Beispiel für Mehrfach-Stil-Übereinstimmung</div>
        </test-card>
      </div>
      <script>
        export default async ()=>{
            return {
                data:{
                    theme:"light",
                    size:"small"
                },
                proto:{
                    changeTheme(){
                        this.theme = this.theme === "light" ? "dark" : "light";
                    },
                    changeSize(){
                        this.size = this.size === "small" ? "large" : "small";
                    }
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="test-card.html" active>
    <template component>
      <style>
        :host {
          display: block;
          padding: 20px;
          margin: 10px;
        }
      </style>
      <match-var theme="light" size="small">
        <style>
          :host {
            background-color: #e3f2fd;
            border: 1px solid #2196f3;
          }
        </style>
      </match-var>
      <match-var theme="light" size="large">
        <style>
          :host {
            background-color: #bbdefb;
            border: 2px solid #1976d2;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="small">
        <style>
          :host {
            background-color: #424242;
            border: 1px solid #757575;
            color: white;
          }
        </style>
      </match-var>
      <match-var theme="dark" size="large">
        <style>
          :host {
            background-color: #212121;
            border: 2px solid #616161;
            color: white;
          }
        </style>
      </match-var>
      <slot></slot>
      <script>
        export default {
          tag: "test-card",
          data: {},
        };
      </script>
    </template>
  </code>
</o-playground>

## checkMatch Manuelle Aktualisierung

In manchen Fällen können Änderungen an CSS-Variablen möglicherweise nicht automatisch erkannt werden. In solchen Fällen kann die Methode `$.checkMatch()` manuell aufgerufen werden, um die Stilerkennung auszulösen.

Derzeit unterstützt Firefox die `@container style()`-Abfrage noch nicht, daher muss `$.checkMatch()` manuell aufgerufen werden; sobald die native Browser-Unterstützung in Zukunft verfügbar ist, wird das System automatisch Variablenänderungen erkennen und manuelle Aufrufe sind nicht mehr erforderlich.

```javascript
proto: {
  updateTheme() {
    this.theme = 'dark';
    // Manuell die Stilerkennung auslösen
    $.checkMatch();
  }
}
```

## Best Practices

1. **Prioritize native CSS capabilities**: `match-var` prioritizes using the browser's native `@container style()` queries, which offer better performance in modern browsers.
2. **Organize styles logically**: Group related matching styles together for easier maintenance and understanding.
3. **Utilize data() binding**: Combine with the `data()` directive to achieve responsive style switching.