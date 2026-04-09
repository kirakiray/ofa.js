# Zustandsverwaltung

## Was ist ein Status

In ofa.js bezieht sich **State** (Zustand) auf das `data`-Attribut der Komponente oder des Seitenmoduls selbst. Dieser Zustand kann nur innerhalb der aktuellen Komponente verwendet werden und dient zum Speichern und Verwalten der internen Daten der Komponente.

Wenn mehrere Komponenten oder Seiten dieselben Daten teilen müssen, besteht die herkömmliche Vorgehensweise darin, sie über Events oder durch mehrere Ebenen von props weiterzugeben. In komplexen Anwendungen führt dies zu schwer wartbarem Code. Daher ist **State-Management** erforderlich – durch Definition eines gemeinsamen State-Objekts können mehrere Komponenten oder Seitenmodule auf diese Daten zugreifen und sie ändern, wodurch der Status geteilt wird.

> **Hinweis**: State-Management ist für Szenarien geeignet, in denen Daten über Komponenten und Seiten hinweg geteilt werden müssen, wie z. B. Benutzerinformationen, Warenkorb, Theme-Konfiguration, globale Konfiguration usw.

## Generieren des Statusobjekts

Erstelle ein reaktives Statusobjekt mit `$.stanz({})`. Diese Methode erhält ein gewöhnliches Objekt als Ausgangsdaten und gibt einen reaktiven Status-Proxy zurück.

### Grundlegende Verwendung

<o-playground name="Zustandsmanagement-Beispiel" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // Startseitenadresse der Anwendung
    export const home = "./list.html";
    // Konfiguration für Seitenwechselanimationen
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="data.js">
  export const contacts = $.stanz({
    list: [{
        id: 10010,
        name: "Peter",
        info: "Jeder Tag ist ein Neuanfang, nach dem Regen kommt die Sonne.",
    },{
        id: 10020,
        name: "Mike",
        info: "Das Leben ist wie ein Ozean, nur wer starken Willens ist, erreicht das andere Ufer.",
    },{
        id: 10030,
        name: "John",
        info: "Das Geheimnis des Erfolgs liegt darin, an seinen Träumen festzuhalten und niemals aufzugeben.",
    }]
  });
  // await fetch("/list.api").then(e=>e.json()).then(list=>data.list = list)
  </code>
  <code path="list.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <h2>Adressbuch</h2>
      <ul>
        <o-fill :value="list">
          <li>
          Name: {{$data.name}} <button on:click="$host.gotoDetail($data)">Details</button>
          </li>
        </o-fill>
      </ul>
      <script>
        export default async ({load}) => {
          const { contacts } = await load("./data.js");
          return {
            data: {
              list:[]
            },
            proto:{
                gotoDetail(user){
                    this.goto(`./detail.html?id=${user.id}`);
                }
            },
            attached(){
              this.list = contacts.list;
            },
            detached(){
              this.list = []; // Beim Zerstören der Komponente werden die bereitgestellten Zustandsdaten geleert
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="detail.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        .avatar{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: rgba(204, 204, 204, 1);
            color: rgba(58, 58, 58, 1);
        }
        .user-info{
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Zurück</button> </div>
      <div class="user-info">
        <div class="avatar">Avatar</div>
        <div style="font-size: 24px;">
        Benutzername:
          <o-if :value="editorMode">
            <input type="text" sync:value="userData.name"/>
            <button on:click="editorMode = false">✅</button>
          </o-if>
          <o-else>
            <span>{{userData.name}}</span>
            <button on:click="editorMode = true">🖊️</button>
          </o-else>
        </div>
        <div style="font-size: 16px;">Benutzer-ID: {{userData.id}}</div>
        <p style="font-size: 14px;">{{userData.info}}</p>
      </div>
      <script>
        export default async ({ load,query }) => {
          const { contacts } = await load("./data.js");
          return {
            data: {
              userData:{},
              editorMode:false
            },
            attached(){
              this.userData = contacts.list.find(e=>e.id == query.id);
            },
            detached(){
              this.userData = {}; // Beim Zerstören der Komponente werden die bereitgestellten Zustandsdaten geleert
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Eigenschaften von Zustandsobjekten

### 1. Reaktive Aktualisierung

`$.stanz()` erstellte Zustandsobjekte sind reaktiv. Wenn sich die Zustandsdaten ändern, werden alle Komponenten, die diese Daten referenzieren, automatisch aktualisiert.

```javascript
const store = $.stanz({ count: 0 });

// In der Komponente
export default {
  data: {
    store: {}
  },
  proto:{
    increment() {
        store.count++; // Alle Komponenten, die auf store.count verweisen, werden automatisch aktualisiert
    }
  },
  attached() {
    // Direktes Referenzieren der Eigenschaften des Zustandsobjekts
    this.store = store;
  },
  detached(){
    this.store = {}; // Beim Zerstören der Komponente, die angehängten Zustandsdaten leeren
  }
};
```

### 2. Tiefe Reaktivität

Das Statusobjekt unterstützt tiefe Reaktivität; Änderungen an verschachtelten Objekten und Arrays werden ebenfalls überwacht.

```javascript
const store = $.stanz({
  user: {
    name: "Zhang San",
    settings: {
      theme: "dark"
    }
  },
  list: []
});

// Änderungen an verschachtelten Eigenschaften lösen ebenfalls Updates aus
store.user.name = "Li Si";
store.user.settings.theme = "light";
store.list.push({ id: 1, title: "Neue Aufgabe" });
```

## Best Practices

### 1. Den Status in der Attached-Phase der Komponente einhängen

Es wird empfohlen, den gemeinsamen Status im `attached`-Lebenszyklus der Komponente zu mounten:

```javascript
export default {
  data: {
    list: []
  },
  attached() {
    // Den gemeinsamen Status an die data des Components hängen
    this.list = data.list;
  },
  detached() {
    // Beim Zerstören des Components die angehängten Zustandsdaten löschen, um Speicherlecks zu verhindern
    this.list = [];
  }
};
```

### 2. Angemessene Verwaltung des Statusgültigkeitsbereichs

- **Globaler Zustand**: Geeignet für Daten, auf die die gesamte Anwendung zugreifen muss (z. B. Benutzerinformationen, globale Konfiguration)
- **Modulzustand**: Geeignet für Daten, die innerhalb eines bestimmten Funktionsmoduls gemeinsam genutzt werden

```javascript
// Globaler Aufrufstatus
export const globalStore = $.stanz({ user: null, theme: "light" });

// Innerhalb des Moduls verwendeter Status
const cartStore = $.stanz({ total: 0 });
```

## Zustandsverwaltung innerhalb des Moduls

<o-playground name="Beispiel für Statusverwaltung innerhalb eines Moduls" style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html">
    <template page>
      <l-m src="./demo-comp.html"></l-m>
      <style>
        :host {
          display: block;
          padding: 8px;
        }
      </style>
      <button on:click="addItem">Add Item</button>
      <o-fill :value="list">
        <div>{{$index}} - <demo-comp :val="$data.val"></demo-comp></div>
      </o-fill>
      <script>
        export default async () => {
          return {
            data: {
                list:[{
                    val:Math.random().toString(36).slice(2, 6)
                }]
            },
            proto:{
                addItem(item){
                    this.list.push({
                        val:Math.random().toString(36).slice(2, 6)
                    });
                }
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host{
            display: inline-block;
        }
      </style>
      {{val}} - {{cartStore.total}} <button on:click="addStoreTotal">Add Store Total</button>
      <script>
        const cartStore = $.stanz({ total: 0 });
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
                val:"",
                cartStore:{}
            },
            proto:{
                addStoreTotal(){
                    this.cartStore.total++;
                }
            },
            attached(){
                this.cartStore = cartStore;
            },
            detached(){
                this.cartStore = {}; // Beim Zerstören der Komponente die gemounteten Statusdaten löschen
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Hinweise

1. **Zustandsbereinigung**: Bereinigen Sie im `detached`-Lebenszyklus der Komponente zeitnah Referenzen auf Zustandsdaten, um Speicherlecks zu vermeiden.

2. **Vermeidung von Zirkelabhängigkeiten**: Erzeugen Sie keine zirkulären Verweise zwischen Zustandsobjekten, da dies das Reaktivitätssystem beeinträchtigen kann.

3. **Große Datenstrukturen**: Verwenden Sie bei großen Datenstrukturen berechnete Eigenschaften oder fragmentiertes Management, um unnötige Leistungseinbußen zu vermeiden.

4. **Zustandskonsistenz**: Achten Sie bei asynchronen Operationen auf die Konsistenz des Zustands; nutzen Sie Transaktionen oder Stapelaktualisierungen, um die Datenintegrität sicherzustellen.

