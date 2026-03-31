# Kontextzustand

Der Kontextstatus ist ein Mechanismus in ofa.js für die gemeinsame Nutzung von Daten über Komponenten hinweg. Durch das Provider-Consumer-Muster können Daten zwischen Eltern- und Kindkomponenten sowie über verschiedene Ebenen hinweg übergeben werden, ohne dass sie durch Props stufenweise weitergereicht werden müssen.

## Kernkonzepte

- **o-provider**: Datenanbieter, definiert die zu teilenden Daten
- **o-consumer**: Datenverbraucher, ruft Daten vom nächstgelegenen Anbieter ab
- **watch:xxx**: Überwacht Änderungen der Verbraucherdaten und bindet sie an die Eigenschaften von Komponenten oder Seitenmodulen

## o-provider Anbieter

Die `o-provider`-Komponente wird verwendet, um einen Anbieter für gemeinsam genutzte Daten zu definieren. Sie identifiziert ihren eigenen Namen über das `name`-Attribut und definiert die zu teilenden Daten über Attribute (wie `custom-a="value"`).

```html
<o-provider name="userInfo" custom-name="Zhang San" custom-age="25">
  ...
</o-provider>
```

### Attribute

- `name`: Der eindeutige Identifikationsname des Anbieters, der für den Verbraucher zur Suche des entsprechenden Anbieters verwendet wird

### Eigenschaften

1. **Automatische Attributweitergabe**: Alle nicht reservierten Attribute des Providers werden als gemeinsame Daten übergeben
2. **Reaktive Aktualisierung**: Wenn sich die Daten des Providers ändern, wird der Consumer mit dem entsprechenden Namen automatisch aktualisiert
3. **Hierarchische Suche**: Der Consumer beginnt mit der nächsthöheren Provider-Instanz und sucht nach Daten mit dem entsprechenden Namen

## o-consumer Konsument

Die `o-consumer`-Komponente wird verwendet, um Daten von einem Provider zu konsumieren (zu verwenden). Sie gibt über das `name`-Attribut den Namen des zu konsumierenden Providers an.

```html
<o-consumer name="userInfo"></o-consumer>
```

### Attribute

- `name`: Der Name des Anbieters, der konsumiert werden soll

### Eigenschaften

1. **Automatische Datenbeschaffung**: Der Consumer bezieht automatisch die Daten des nächsthöheren Providers mit dem entsprechenden Namen.
2. **Attributzusammenführung**: Haben mehrere Provider mit demselben Namen ein Attribut, hat der dem Consumer am nächsten liegende Provider Vorrang.
3. **Attributbeobachtung**: Über `watch:xxx` lassen sich Änderungen bestimmter Attribute beobachten.

## Datenänderungen überwachen

Durch `watch:xxx` können Änderungen der Anbieterdaten überwacht werden:

```html
<o-consumer name="userInfo" watch:custom-age="age"></o-consumer>

<script>
export default {
  data:{
    age: 0,
  },
};
</script>
```

## Grundlegendes Beispiel

<o-playground name="Grundlagenbeispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" user-id="9527">
        <o-page src="page1.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./user-avatar.html"></l-m>
      <l-m src="./user-name.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #007acc;
          padding: 10px;
        }
      </style>
      <user-avatar></user-avatar>
      <div>Benutzer-ID: {{userId}}</div>
      <user-name></user-name>
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default {
          data:{
            userId: 0,
          },
        };
      </script>
    </template>
  </code>
  <code path="user-avatar.html">
    <template component>
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(68, 107, 133, 1);
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
      </style>
      {{userId}} Avatar
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-avatar",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="user-name.html">
    <template component>
      <style>
        :host {
          display: block;
          color: rgba(204, 153, 0, 1);
        }
      </style>
      Benutzer-{{userId}}
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-name",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
</o-playground>

## o-root-provider Root-Anbieter

`o-root-provider` ist ein globaler Provider auf Root-Ebene, dessen Gültigkeitsbereich das gesamte Dokument umfasst. Auch ohne übergeordneten Provider können Consumer die Daten des Root-Providers abrufen.

```html
<!-- Definieren des globalen Root-Providers -->
<o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>

<!-- Kann an beliebiger Stelle der Seite konsumiert werden -->
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

### Eigenschaften

1. **Globaler Geltungsbereich**: Die Daten des Root-Providers sind auf der gesamten Seite verfügbar.
2. **Priorität**: Wenn sowohl ein Provider als auch ein Root-Provider mit demselben Namen existieren, hat der dem Consumer nächstgelegene Provider Vorrang.
3. **Entfernbar**: Nach dem Entfernen des Root-Providers greift der Consumer auf die Suche nach anderen Providern zurück.

## root-provider Beispiel

<o-playground name="root-provider Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./header.html"></l-m>
      <l-m src="./content.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .info {
          padding: 10px;
          border: 1px solid #007acc;
        }
      </style>
      <div class="info">
        <div>Theme: {{theme}}</div>
        <div>Sprache: {{language}}</div>
      </div>
      <header-com></header-com>
      <content-com></content-com>
      <o-consumer name="globalConfig" watch:custom-theme="theme" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          data: {
            theme: "",
            language: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="header.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: #333;
          color: white;
        }
      </style>
      Header - Theme: {{theme}}
      <o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
      <script>
        export default {
          tag:"header-com",
          data: {
            theme: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="content.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: rgba(137, 133, 133, 1);
        }
      </style>
      Content - Sprache: {{language}}
      <o-consumer name="globalConfig" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          tag:"content-com",
          data: {
            language: "",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

### Beispiel für Prioritäten

```html
<o-root-provider name="test" custom-value="root"></o-root-provider>

<o-provider name="test" custom-value="parent">
 ...
 <!-- Hier👇 ist der abgerufene custom-value "parent" -->
 <o-consumer name="test"></o-consumer>
 ...
</o-provider>

<!-- Hier👇 ist der abgerufene custom-value "root" -->
<o-consumer name="test"></o-consumer>

```

### Beispieldemonstration der Priorität

<o-playground name="Prioritäts-Beispiel-Demo" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="test" custom-value="root"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./child.html"></l-m>
      <o-provider name="test" custom-value="parent">
        <div style="padding: 10px; border: 1px solid #007acc;">
          <p>Wert im übergeordneten Provider: {{parentValue}}</p>
          <child-com></child-com>
        </div>
        <o-consumer name="test" watch:custom-value="parentValue"></o-consumer>
      </o-provider>
      <div style="padding: 10px; border: 1px solid #cc6600; margin-top: 10px;">
        <p>Wert des Root-Providers: {{rootValue}}</p>
      </div>
      <child-com></child-com>
      <o-consumer name="test" watch:custom-value="rootValue"></o-consumer>
      <script>
        export default () => ({
          data: {
            parentValue: "",
            rootValue: "",
          },
        });
      </script>
    </template>
  </code>
  <code path="child.html">
    <template component>
      <div style="padding: 10px;  border: 1px dashed gray;">
        Wert in der Child-Komponente: {{customValue}} (am nächsten ist {{customValue}} provider)
      </div>
      <o-consumer name="test" watch:custom-value="customValue"></o-consumer>
      <script>
        export default () => ({
          tag:"child-com",
          data: {
            customValue: "",
          },
        });
      </script>
    </template>
  </code>
</o-playground>

## getProvider(name) Methode

`getProvider(name)` ist eine Instanzmethode, die das Provider-Element mit dem entsprechenden Namen abruft. Sie durchläuft das DOM nach oben und sucht den nächstgelegenen übergeordneten Provider; falls keiner gefunden wird, wird der root-provider zurückgegeben.

### Verwendung der getProvider(name)-Methode innerhalb von Komponenten oder Seitenmodulen

```html
<script>
...
proto:{
  changeValue(){
    const provider = this.getProvider("name");
    provider.customValue = "new value";
  }
}
...
</script>
```

## getProvider Beispiel

<o-playground name="getProvider Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" custom-name="ZhangSan" custom-age="25">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <button on:click="getProviderData">Provider-Daten abrufen</button>
      <div>Aktueller Name: {{currentName}}</div>
      <div>Aktuelles Alter: {{currentAge}}</div>
      <div style="margin-top: 10px;">
        <button on:click="updateProvider">Provider-Daten ändern</button>
      </div>
      <o-consumer name="userInfo" watch:custom-name="currentName" watch:custom-age="currentAge"></o-consumer>
      <script>
        export default {
          data: {
            currentName: "",
            currentAge: 0,
          },
          proto: {
            getProviderData() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                console.log("Provider gefunden:", provider);
                console.log("Name:", provider.customName);
                console.log("Alter:", provider.customAge);
                alert(`Provider-Daten: ${provider.customName}, ${provider.customAge} Jahre`);
              }
            },
            updateProvider() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                provider.customName = "LiSi";
                provider.customAge = 30;
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

### Provider über das Element abrufen

```javascript
// Provider der übergeordneten Ebene des aktuellen Elements abrufen
const provider = $(".my-element").getProvider("userInfo");

if (provider) {
  console.log("Provider gefunden:", provider.customName);
}

// Direkt den globalen Root-Provider abrufen
const globalProvider = $.getRootProvider("globalConfig");
```

### Anwendungsfall

1. **Manuelle Datenabfrage**: Wird in Szenarien verwendet, in denen direkter Zugriff auf die Daten des Anbieters erforderlich ist
2. **Über Shadow DOM hinweg**: Sucht im Inneren des Shadow DOM nach dem übergeordneten Provider
3. **Ereignisverarbeitung**: Erhalten des entsprechenden Anbieters im Ereignis-Rückruf

## dispatch Ereignisverteilung

Der Provider kann Ereignisse an alle Consumer verteilen, die ihn nutzen:

```html
<o-provider name="test" id="myProvider" custom-value="Hallo">
  <o-consumer name="test" on:custom-event="handleEvent">
    <div>{{customValue}}</div>
  </o-consumer>
</o-provider>

<script>
// Ereignis auslösen
$("#myProvider").dispatch("custom-event", {
  data: { message: "Hallo Welt" }
});
</script>
```

## Beispiel für Event-Dispatch

<o-playground name="Beispiel für Ereignisverteilung" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="chat" custom-messages='["Willkommen im Chatroom"]' id="chatProvider">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./chat-list.html"></l-m>
      <l-m src="./chat-input.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
        }
      </style>
      <h3>Chatroom</h3>
      <chat-list></chat-list>
      <chat-input></chat-input>
    </template>
  </code>
  <code path="chat-list.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
          max-height: 200px;
          overflow-y: auto;
        }
        .message {
          padding: 5px;
          margin: 5px 0;
          background: gray;
          border-radius: 4px;
        }
      </style>
      <div class="messages">
        <o-fill :value="messages">
          <div class="message">{{$data}}</div>
        </o-fill>
      </div>
      <o-consumer name="chat" on:new-message="addMessage"></o-consumer>
      <script>
        export default {
          tag:"chat-list",
          data: {
            messages: [],
          },
          proto: {
            addMessage(event) {
              this.messages.push(event.data.text);
            },
          },
        };
      </script>
    </template>
  </code>
  <code path="chat-input.html">
    <template component>
      <style>
        :host {
          display: flex;
          gap: 10px;
        }
        input {
          flex: 1;
          padding: 8px;
        }
        button {
          padding: 8px 16px;
          background: #007acc;
          color: white;
          border: none;
          cursor: pointer;
        }
      </style>
      <input type="text" sync:value="inputText" placeholder="Nachricht eingeben...">
      <button on:click="sendMessage">Senden</button>
      <script>
        export default {
          tag:"chat-input",
          data: {
            inputText: "",
          },
          proto: {
            sendMessage() {
              const provider = this.getProvider("chat");
              if (provider && this.inputText.trim()) {
                provider.dispatch("new-message", {
                  data: { text: this.inputText }
                });
                this.inputText = "";
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## Best Practices

1. **Sinnvolle Benennung**: Verwenden Sie aussagekräftige Namen für Provider und Consumer, um Nachverfolgung und Wartung zu erleichtern  
2. **Übermäßige Nutzung vermeiden**: Kontextstatus ist für datenübergreifende Komponenten gedacht; für gewöhnliche Eltern-Kind-Komponenten werden Props empfohlen  
3. **Root-Provider für globale Konfiguration**: Themen, Sprache, globaler Status usw. eignen sich für die Verwendung eines Root-Providers  
4. **Rechtzeitiges Aufräumen**: Wenn ein Provider entfernt wird, werden die Daten des Consumers automatisch gelöscht, eine manuelle Behandlung ist nicht erforderlich