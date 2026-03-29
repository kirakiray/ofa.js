# Bedingtes Rendering

In ofa.js ist bedingtes Rendern eine wichtige Funktion, die es ermöglicht, basierend auf dem Datenstatus zu entscheiden, ob ein Element oder eine Komponente gerendert wird. ofa.js bietet eine komponentenbasierte Lösung für bedingtes Rendern, die über die Komponenten `o-if`, `o-else-if` und `o-else` realisiert wird.

## o-if Komponente

Die `o-if`-Komponente wird verwendet, um basierend auf dem Wahrheitswert eines Ausdrucks zu entscheiden, ob ihr Inhalt gerendert werden soll. Wenn der gebundene `value`-Attributwert wahr ist, wird der Inhalt innerhalb der Komponente gerendert; andernfalls erscheint der Inhalt nicht im DOM.

<o-playground name="o-if Funktionsprinzip Beispiel" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="isHide = !isHide">Toggle Display</button>
      <o-if :value="!isHide">
        <p>{{val}}</p>
      </o-if>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Funktionsweise von o-if

`o-if` rendert Inhalte nur dann in das DOM, wenn die Bedingung wahr ist. Wenn die Bedingung falsch ist, werden die DOM-Elemente innerhalb von o-if vollständig entfernt. Diese Implementierungsweise eignet sich für Situationen, in denen sich die Bedingungen nicht allzu häufig ändern, da sie die Erstellung und Zerstörung von DOM beinhaltet.

## o-else-if- und o-else-Komponenten

Wenn mehrere bedingte Verzweigungen benötigt werden, können die Komponenten `o-else-if` und `o-else` in Kombination mit `o-if` verwendet werden, um mehrfache bedingte Rendering zu realisieren.

- `o-if`：erforderliche erste Bedingungskomponente
- `o-else-if`：optionale mittlere Bedingungskomponente, kann mehrere geben
- `o-else`：optionale Standardbedingungskomponente, wird zuletzt platziert

<o-playground name="Beispiel für Mehrfach-Verzweigungs-Rendering" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="num++">Toggle Display - {{num}}</button>
      <!-- Je nach Rest von num geteilt durch 3 wird unterschiedlicher Inhalt angezeigt -->
      <o-if :value="num % 3 === 0">
        <p>❤️ 0 / 3</p>
      </o-if>
      <o-else-if :value="num % 3 === 1">
        <p>😊 1 / 3</p>
      </o-else-if>
      <o-else>
        <p>😭 2 / 3</p>
      </o-else>
      <script>
        export default async () => {
          return {
            data: {
              num: 0,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Praktische Anwendungsszenarien

### Benutzerrechte-Steuerung

<o-playground name="Benutzerberechtigungssteuerungsbeispiel" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .admin-panel {
          background-color: #813b3bff;
          padding: 10px;
          margin: 10px 0;
        }
        .user-info {
          background-color: #3f6e86ff;
          padding: 10px;
          margin: 10px 0;
        }
      </style>
      <div>
        <button on:click="toggleUserRole">Benutzerrolle wechseln</button>
        <p>Aktuelle Rolle: {{role}}</p>
        <o-if :value="role === 'admin'">
          <div class="admin-panel">
            <h3>Administrator-Panel</h3>
            <button>Benutzer verwalten</button>
            <button>Systemeinstellungen</button>
          </div>
        </o-if>
        <o-else-if :value="role === 'user'">
          <div class="user-info">
            <h3>Benutzerinformationen</h3>
            <p>Willkommen {{userName}}!</p>
          </div>
        </o-else-if>
        <o-else>
          <p>Bitte melden Sie sich an, um Inhalte anzuzeigen</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              role: 'guest',
              userName: 'Gast'
            },
            proto: {
              toggleUserRole() {
                if (this.role === 'guest') {
                  this.role = 'user';
                  this.userName = 'Zhang San';
                } else if (this.role === 'user') {
                  this.role = 'admin';
                } else {
                  this.role = 'guest';
                  this.userName = '';
                }
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Anzeige des Formularvalidierungsstatus

<o-playground name="Beispiel für Anzeige des Formular-Validierungsstatus" style="--editor-height: 500px">
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
      <div>
        <h3>Beispiel zur E-Mail-Validierung</h3>
        <input type="email" :value="email" on:input="email = $event.target.value" placeholder="E-Mail-Adresse eingeben">
        <o-if :value="email && isValidEmail(email)">
          <p style="color:green;">✓ E-Mail-Format korrekt</p>
        </o-if>
        <o-else-if :value="email && !isValidEmail(email) && email.length > 0">
          <p style="color:red;">✗ E-Mail-Format inkorrekt</p>
        </o-else-if>
        <o-else>
          <p style="color:orange;">Bitte E-Mail-Adresse zur Validierung eingeben</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              email: ''
            },
            proto: {
              isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Best Practices für bedingtes Rendering

1. **Anwendungsszenario**: Wenn ein Element unter verschiedenen Bedingungen selten umgeschaltet wird, ist die Verwendung von `o-if` angemessener, da dadurch nicht benötigte Elemente vollständig entfernt und Speicher gespart wird.

2. **Leistungsüberlegung**: Für häufig umgeschaltete Elemente eignet sich eher eine Klassenbindung (z. B. `class:hide`) als eine bedingte Darstellung, da letztere das Erstellen und Entfernen des DOM beinhaltet.

3. **Klare Struktur**: Die bedingte Darstellung ist besonders gut geeignet für Inhalte mit unterschiedlicher Struktur, wie Tabs oder Schritt-für-Schritt-Anleitungen.