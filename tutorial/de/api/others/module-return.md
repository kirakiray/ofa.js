# Modul-Rückgabeobjekteigenschaften

In ofa.js müssen sowohl Seitenmodule als auch Komponentenmodule über `export default async () => {}` ein Objekt zurückgeben, um die Konfiguration und das Verhalten des Moduls zu definieren. Dieses Dokument fasst alle Eigenschaften zusammen, die das zurückgegebene Objekt enthalten kann.

## Attributübersicht

| Attribut | Typ | Seitenmodul | Komponentenmodul | Beschreibung | Relevante Dokumentation |
|------|------|:-------:|:-------:|------|------|
| `tag` | `string` | ❌ | ✅ Erforderlich | Name des Komponenten-Tags | [Komponente erstellen](../../documentation/create-component.md) |
| `data` | `object` | ✅ | ✅ | Reaktives Datenobjekt | [Eigenschaftsreaktion](../../documentation/property-response.md) |
| `attrs` | `object` | ❌ | ✅ | Definition der Komponenteneigenschaften | [Vererbung von Attributen](../../documentation/inherit-attributes.md) |
| `proto` | `object` | ✅ | ✅ | Methoden und berechnete Eigenschaften | [Berechnete Eigenschaften](../../documentation/computed-properties.md) |
| `watch` | `object` | ✅ | ✅ | Watcher | [Watchers](../../documentation/watchers.md) |
| `ready` | `function` | ✅ | ✅ | Wird aufgerufen, wenn DOM erstellt wurde | [Lebenszyklus](../../documentation/lifecycle.md) |
| `attached` | `function` | ✅ | ✅ | Wird beim Einhängen in das DOM aufgerufen | [Lebenszyklus](../../documentation/lifecycle.md) |
| `detached` | `function` | ✅ | ✅ | Wird beim Entfernen aus dem DOM aufgerufen | [Lebenszyklus](../../documentation/lifecycle.md) |
| `loaded` | `function` | ✅ | ✅ | Wird aufgerufen, wenn vollständig geladen | [Lebenszyklus](../../documentation/lifecycle.md) |
| `routerChange` | `function` | ✅ Übergeordnete Seite | ❌ | Wird bei Routenänderungen aufgerufen | [Verschachtelte Seiten/Routen](../../documentation/nested-routes.md) |> **Spezieller Export**: `export const parent = "./layout.html"` - wird für verschachtelte Routen verwendet, um den Pfad der übergeordneten Seite anzugeben (nicht im zurückgegebenen Objekt enthalten). Siehe [Verschachtelte Seiten/Routen](../../documentation/nested-routes.md).

## Kernattribute

### tag



`tag` ist der Tag-Name der Komponente, **Komponentenmodule müssen dieses Attribut definieren**. Seitenmodule müssen `tag` nicht definieren.

```javascript
export default async () => {
  return {
    tag: "my-component",
    // ...
  };
};
```

> Hinweis: Der Wert von `tag` muss mit dem Tag-Namen bei der Verwendung der Komponente übereinstimmen.

### data



`data` ist ein reaktives Datenobjekt, das zum Speichern der Zustandsdaten einer Komponente oder Seite dient. Wenn sich die Daten ändern, wird die Ansicht automatisch aktualisiert.

```javascript
export default async () => {
  return {
    data: {
      message: "Hello",
      count: 0,
      user: {
        name: "ZhangSan",
        age: 25
      },
      items: [1, 2, 3]
    }
  };
};
```

> Hinweis: `data` ist ein Objekt und keine Funktion, anders als im Vue-Framework.

### attrs



`attrs` wird verwendet, um Komponenteneigenschaften zu definieren und von außen übergebene Daten zu empfangen. Nur das Komponentenmodul muss `attrs` definieren.

```javascript
export default async () => {
  return {
    tag: "my-component",
    attrs: {
      title: null,      // Kein Standardwert
      disabled: "",     // Hat einen Standardwert
      size: "medium"    // Hat einen Standardwert
    }
  };
};
```

Verwenden Sie beim Einsatz der Komponente die Eigenschaften:

```html
<my-component title="Titel" disabled size="large"></my-component>
```

> Wichtige Regeln:
> - Übergebene Attributwerte müssen Zeichenketten sein, andernfalls werden sie automatisch in Zeichenketten umgewandelt
> - Namenskonvertierung: `fullName` → `full-name` (kebab-case-Format)
> - Die Schlüssel von `attrs` und `data` dürfen nicht doppelt vorkommen

### proto



`proto` wird verwendet, um Methoden und berechnete Eigenschaften zu definieren. Berechnete Eigenschaften werden mit den JavaScript-Schlüsselwörtern `get` und `set` definiert.

```javascript
export default async () => {
  return {
    data: {
      count: 0
    },
    proto: {
      // Methodendefinition
      increment() {
        this.count++;
      },
      
      // Berechnete Eigenschaft (Getter)
      get doubleCount() {
        return this.count * 2;
      },
      
      // Berechnete Eigenschaft
      set doubleCount(val) {
        this.count = val / 2;
      }
    }
  };
};
```

> Hinweis: ofa.js verwendet die Schlüsselwörter `get`/`set`, um berechnete Eigenschaften zu definieren, nicht die `computed`-Option von Vue.

### watch



`watch` wird verwendet, um Watcher zu definieren, die auf Datenänderungen lauschen und entsprechende Logik ausführen.

```javascript
export default async () => {
  return {
    data: {
      count: 0,
      name: ""
    },
    watch: {
      // Eine einzelne Eigenschaft überwachen
      count(newVal, { watchers }) {
        console.log('count changed:', newVal);
      },
      
      // Mehrere Eigenschaften überwachen
      "count,name"() {
        console.log('count oder name geändert');
      }
    }
  };
};
```

Die Listener-Callback-Funktion empfängt zwei Parameter:- `newValue`: der neue Wert nach der Änderung
- `{ watchers }`: alle Watcher-Objekte der aktuellen Komponente

## Lebenszyklus-Hooks

Lebenszyklus-Hooks ermöglichen es Ihnen, in den verschiedenen Phasen einer Komponente spezifische Logik auszuführen.

### ready



`ready`-Hook wird aufgerufen, wenn die Komponente bereit ist. Zu diesem Zeitpunkt ist das Template der Komponente vollständig gerendert, die DOM-Elemente sind erstellt, aber möglicherweise noch nicht in das Dokument eingefügt.

```javascript
ready() {
  console.log('DOM erstellt');
  this.initDomElements();
}
```

### attached



`attached`-Hook wird aufgerufen, wenn die Komponente in das Dokument eingefügt wird, und zeigt an, dass die Komponente auf der Seite eingehängt wurde.

```javascript
attached() {
  console.log('An DOM angehängt');
  this._timer = setInterval(() => {
    this.count++;
  }, 1000);
}
```

### detached



`detached`-Hook wird aufgerufen, wenn die Komponente aus dem Dokument entfernt wird. Dies zeigt an, dass die Komponente demnächst ausgehängt wird.

```javascript
detached() {
  console.log('Vom DOM entfernt');
  clearInterval(this._timer);
}
```

### loaded



Der `loaded`-Hook wird ausgelöst, nachdem die Komponente und alle ihre Unterkomponenten sowie asynchronen Ressourcen vollständig geladen sind.

```javascript
loaded() {
  console.log('Vollständig geladen');
}
```

### routerChange



`routerChange`-Hook wird bei Routenänderung aufgerufen und dient ausschließlich der Überwachung von Unterseitenwechseln durch die übergeordnete Seite.

```javascript
routerChange() {
  this.refreshActive();
}
```

## Lebenszyklus-Ausführungsreihenfolge

```
ready → attached → loaded
                 ↓
              detached（beim Entfernen）
```

## Spezielle Exporte: parent

`parent` wird für verschachtelte Routen verwendet und gibt den Pfad der übergeordneten Seite der aktuellen Seite an. Dies ist ein eigenständiger Export und nicht im zurückgegebenen Objekt enthalten.

```html
<template page>
  <style>:host { display: block; }</style>
  <div>Inhalt der Unterseite</div>
  <script>
    // Übergeordnete Seite angeben
    export const parent = "./layout.html";
    
    export default async () => {
      return {
        data: {}
      };
    };
  </script>
</template>
```

## Vollständiges Beispiel

### Komponentenmodul

```html
<template component>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>
    <p>{{title}}</p>
    <p>Zähler: {{count}}</p>
    <p>Doppelt: {{doubleCount}}</p>
    <button on:click="increment">Erhöhen</button>
  </div>
  <script>
    export default async () => {
      return {
        tag: "my-component",
        attrs: {
          title: "Standardtitel"
        },
        data: {
          count: 0
        },
        proto: {
          increment() {
            this.count++;
          },
          get doubleCount() {
            return this.count * 2;
          }
        },
        watch: {
          count(newVal) {
            console.log('count geändert zu:', newVal);
          }
        },
        ready() {
          console.log('Komponente bereit');
        },
        attached() {
          console.log('Komponente eingehängt');
        },
        detached() {
          console.log('Komponente ausgehängt');
        }
      };
    };
  </script>
</template>
```

### Seitenmodule

```html
<template page>
  <style>
    :host { display: block; padding: 10px; }
  </style>
  <div>{{message}}</div>
  <script>
    export const parent = "./layout.html";
    
    export default async ({ load, query }) => {
      return {
        data: {
          message: "Hello ofa.js"
        },
        
        proto: {
          handleClick() {
            console.log('clicked');
          }
        },
        
        watch: {
          message(val) {
            console.log('message changed:', val);
          }
        },
        
        ready() {
          console.log('Seite ist bereit');
        },
        
        attached() {
          console.log('Seite wurde eingehängt');
          console.log('Abfrageparameter:', query);
        },
        
        detached() {
          console.log('Seite wurde ausgehängt');
        }
      };
    };
  </script>
</template>
```

## Häufige Fehler

### 1. Doppelte Schlüssel in attrs und data

```javascript
// ❌ Falsch
return {
  attrs: { title: "" },
  data: { title: "Hello" }  // Doppelt mit attrs
};

// ✅ Richtig
return {
  attrs: { title: "" },
  data: { message: "Hello" }  // Unterschiedlichen Schlüssel verwenden
};
```

### 2. Verwenden Sie den Vue-Stil, um berechnete Eigenschaften zu definieren

```javascript
// ❌ Falsch
return {
  computed: {
    doubleCount() {
      return this.count * 2;
    }
  }
};

// ✅ Richtig
return {
  proto: {
    get doubleCount() {
      return this.count * 2;
    }
  }
};
```

### 3. data als Funktion definiert

```javascript
// ❌ Falsch
return {
  data() {
    return { count: 0 };
  }
};

// ✅ Richtig
return {
  data: {
    count: 0
  }
};
```

### 4. Falsche Position der Methodendefinition

```javascript
// ❌ Falsch
return {
  methods: {
    handleClick() {}
  }
};

// ✅ Richtig
return {
  proto: {
    handleClick() {}
  }
};
```