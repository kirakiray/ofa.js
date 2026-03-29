# Listener

Der Watcher ist eine Funktion in ofa.js zum Überwachen von Datenänderungen und zum Ausführen entsprechender Logik. Wenn sich reaktive Daten ändern, löst der Watcher automatisch eine Callback-Funktion aus, die es Ihnen ermöglicht, Aufgaben wie Datentransformation, Nebeneffekt-Operationen oder asynchrone Verarbeitung auszuführen.

## Grundlegende Verwendung

Listener werden im `watch`-Objekt der Komponente definiert, wobei der Schlüsselname dem zu beobachtenden Datenattribut entspricht und der Wert die Callback-Funktion ist, die ausgeführt wird, wenn sich die Daten ändern.

<o-playground name="watchers - Grundlegende Verwendung" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>
        count:{{count}}
        <br />
        doubleCount:{{doubleCount}}
      </p>
      <input sync:value="count" type="number" />
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              doubleCount: 0,
            },
            watch: {
              count(count) {
                setTimeout(() => {
                  this.doubleCount = count * 2;
                }, 500);
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Rückruffunktionsparameter

Der Listener-Callback empfängt zwei Parameter:- `newValue`：Der neue Wert nach der Änderung
- `{watchers}`：Alle Watcher-Objekte der aktuellen Komponente

Nach einer Datenänderung wird zunächst eine Debouncing-Verarbeitung durchgeführt, bevor der Callback in `watch` ausgeführt wird; der Parameter `watchers` ist die Menge aller während dieser Debouncing-Periode zusammengefassten Änderungen.

Die Funktion in "watch" wird unmittelbar nach der Initialisierung der Komponente aufgerufen, um die Datenüberwachung einzurichten. Man kann durch die Überprüfung, ob die watchers eine Länge haben, unterscheiden, ob es sich um den ersten Aufruf handelt.

<o-playground name="watchers - 回调参数" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .log {
          margin-top: 10px;
          padding: 10px;
          background-color: #7e7e7eff;
          font-family: monospace;
          white-space: pre-wrap;
        }
      </style>
      <p>名字: {{name}}</p>
      <p>年龄: {{age}}</p>
      <input sync:value="name" placeholder="输入名字" />
      <input sync:value="age" type="number" placeholder="输入年龄" />
      <div class="log">{{log}}</div>
      <script>
        export default async () => {
          return {
            data: {
              name: "张三",
              age: 25,
              log: "",
            },
            watch: {
              name(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // 获取其中一个
                this.log += `属性 "${watcher.name}" 从 "${watcher.oldValue}" 变为 "${watcher.value}"\n`;
              },
              age(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // 获取其中一个
                this.log += `属性 "${watcher.name}" 从 "${watcher.oldValue}" 变为 "${watcher.value}"\n`;
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Tiefe Überwachung

Bei verschachtelten Daten vom Typ Objekt oder Array wird innerhalb von watch automatisch eine tiefe Überwachung durchgeführt.

<o-playground name="Watchers - Tiefe Überwachung" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
        .info {
          margin-top: 10px;
          padding: 10px;
          background-color: gray;
        }
      </style>
      <div>
        <p>Benutzerinformation:</p>
        <p>Name: {{user.name}}</p>
        <p>Alter: {{user.age}}</p>
        <p>Hobbys: {{user.hobbies.join(', ')}}</p>
      </div>
      <div>
        <button on:click="updateName">Name ändern</button>
        <button on:click="updateAge">Alter ändern</button>
        <button on:click="addHobby">Hobby hinzufügen</button>
        <button on:click="updateHobby">Hobby ändern</button>
      </div>
      <div class="info" :html="log"></div>
      <script>
        export default async () => {
          return {
            data: {
              user: {
                name: "Zhang San",
                age: 25,
                hobbies: ["Basketball", "Fußball"],
              },
              log: "",
            },
            watch: {
              user(newVal,{watchers}) {
                if(!watchers){
                  return;
                }
                const watcher = watchers[0]; // Einen davon abrufen
                console.log("Änderung: ",watcher.target);
                if(watcher.type === 'set'){
                  this.log += `Wert geändert-> Eigenschaft "${watcher.name}" von "${watcher.oldValue}" zu "${watcher.value}" <br>`;
                }else{
                  this.log += `Methode ausgeführt ${watcher.type}-> Funktionsname "${watcher.name}"  Parameter "${watcher.args}" <br>`;
                }
              },
            },
            proto: {
              updateName() {
                this.user.name = "Li Si";
              },
              updateAge() {
                this.user.age = 30;
              },
              addHobby() {
                this.user.hobbies.push("Schwimmen");
              },
              updateHobby() {
                this.user.hobbies[0] = "Badminton";
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Mehrere Datenquellen beobachten

Sie können gleichzeitig auf die Änderung mehrerer Daten lauschen und im Rückruf entsprechende Logik basierend auf diesen Änderungen ausführen.

<o-playground name="watchers - Mehrere Datenquellen" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px;
          padding: 5px;
        }
      </style>
      <p>Breite: {{rectWidth}}</p>
      <p>Höhe: {{rectHeight}}</p>
      <p>Fläche: {{area}}</p>
      <input sync:value="rectWidth" type="number" placeholder="Breite" />
      <input sync:value="rectHeight" type="number" placeholder="Höhe" />
      <script>
        export default async () => {
          return {
            data: {
              rectWidth: 10,
              rectHeight: 5,
              area: 0,
            },
            watch: {
              // "rectWidth,rectHeight"(){
              ["rectWidth,rectHeight"](){
                this.area = (this.rectWidth || 0) * (this.rectheight || 0);
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Praktische Anwendungsszenarien

### 1. Formularvalidierung

<o-playground name="watchers - Formularvalidierung" style="--editor-height: 800px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
        }
        input {
          display: block;
          margin: 10px 0;
          padding: 8px;
          width: 200px;
        }
        .error {
          color: red;
          font-size: 12px;
        }
      </style>
      <input sync:value="username" placeholder="Benutzername (3-10 Zeichen)" />
      <span class="error">{{usernameError}}</span>
      <input sync:value="email" placeholder="E-Mail" />
      <span class="error">{{emailError}}</span>
      <script>
        export default async () => {
          return {
            data: {
              username: "",
              email: "",
              usernameError: "",
              emailError: "",
            },
            watch: {
              username(val) {
                if (val.length < 3 || val.length > 10) {
                  this.usernameError = "Benutzername muss 3-10 Zeichen lang sein";
                } else {
                  this.usernameError = "";
                }
              },
              email(val) {
                const emailRegex = /^.+@.+\..+$/;
                if (!emailRegex.test(val)) {
                  this.emailError = "Bitte geben Sie eine gültige E-Mail-Adresse ein";
                } else {
                  this.emailError = "";
                }
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### 2. Design einrichten

<o-playground name="Watchers - Thema einstellen" style="--editor-height: 800px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
        }
      </style>
      <p>Einstellungen: {{settings.theme}}</p>
      <p>Speicherstatus: {{saveStatus}}</p>
      <button on:click="setLight">Helles Thema</button>
      <button on:click="setDark">Dunkles Thema</button>
      <button on:click="resetSettings">Zurücksetzen</button>
      <script>
        export default async () => {
          return {
            data: {
              settings: {
                theme: "light",
              },
              saveStatus: "Gespeichert",
            },
            watch: {
              settings(){
                  this.saveStatus = "Speichern...";
                  setTimeout(() => {
                    this.saveStatus = "Gespeichert";
                    console.log("Einstellungen gespeichert:", this.settings);
                  }, 500);
              }
            },
            proto: {
              setLight() {
                this.settings.theme = "light";
              },
              setDark() {
                this.settings.theme = "dark";
              },
              resetSettings() {
                this.settings = { theme: "light" };
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Hinweise

- **Vermeiden Sie die Änderung der überwachten Daten**: Das Ändern der überwachten Daten im Watcher-Callback kann zu einer Endlosschleife führen. Wenn Sie Änderungen vornehmen müssen, stellen Sie sicher, dass angemessene Bedingungsprüfungen vorhanden sind.
- **Erwägen Sie stattdessen Computed Properties**: Wenn Sie einen neuen Wert basierend auf Änderungen mehrerer Daten berechnen müssen, wird empfohlen, [Computed Properties](./computed-properties.md) anstelle von Watchern zu verwenden.