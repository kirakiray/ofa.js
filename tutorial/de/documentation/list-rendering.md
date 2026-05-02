# Listen-Rendering

In ofa.js bietet die `o-fill`-Komponente leistungsstarke Listen-Render-Funktionen und kann Array-Daten effizient in mehrere ähnliche Elemente rendern. Sie unterstützt zwei Hauptverwendungsarten: Direktes Rendern und Template-Rendering.

## Einführung in die o-fill Komponente

`o-fill` ist eine Kernkomponente in ofa.js zur Listen-Rendering. Sie erhält ein Array-Attribut `value` und erzeugt für jeden Eintrag im Array ein entsprechendes DOM-Element. Während des Renderings verfolgt ofa.js automatisch Änderungen am Array und aktualisiert das DOM effizient.

### Hauptmerkmale:

- **Effiziente Aktualisierung**: Verfolgen Sie Array-Änderungen über Schlüssel-Werte-Paare und aktualisieren Sie nur die Teile, die geändert werden müssen.
- **Indexzugriff**: Greifen Sie über `$index` auf den Index des aktuellen Elements zu.
- **Datenzugriff**: Greifen Sie über `$data` auf die Daten des aktuellen Elements zu.
- **Hostzugriff**: Greifen Sie über `$host` auf die aktuelle Komponenteninstanz zu, um Komponentenmethoden aufzurufen oder auf Komponentendaten zuzugreifen.
- **Wiederverwendung von Vorlagen**: Unterstützt die Verwendung benannter Vorlagen für komplexe Listendarstellungen.

## Direktes Rendern

Die direkte Renderung ist die einfachste Anwendung: Der Template-Inhalt wird direkt innerhalb des `o-fill`-Tags geschrieben. Wenn sich das Array ändert, erstellt `o-fill` automatisch für jeden Datensatz das entsprechende Element.

<o-playground name="o-fill - Direktes Rendern" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        ul { list-style: none; padding: 0; }
        li { padding: 8px; margin: 5px 0; background: #7e7e7e; border-radius: 4px; }
      </style>
      <h3>Obstliste</h3>
      <button on:click="addItem">Obst hinzufügen</button>
      <button on:click="removeItem">Letztes entfernen</button>
      <ul>
        <o-fill :value="fruits">
          <li> {{$index + 1}}. {{$data.name}} - Preis: ¥{{$data.price}} <button on:click="$host.removeItem($index)">Löschen</button></li>
        </o-fill>
      </ul>
      <script>
        export default async () => ({
          data: { 
            fruits: [
              { name: "🍎 Apfel", price: 5 },
              { name: "🍊 Orange", price: 6 },
              { name: "🍌 Banane", price: 3 }
            ],
            fruitIndex: 0,
          },
          proto: {
            addItem() {
              const fruitNames = ["🍇 Traube", "🍓 Erdbeere", "🥝 Kiwi", "🍑 Pfirsich", "🥭 Mango"];
              const name = fruitNames[this.fruitIndex % fruitNames.length];
              this.fruits.push({ 
                name: name, 
                price: Math.floor(Math.random() * 10) + 1 
              });
              this.fruitIndex++;
            },
            removeItem(index) {
              if (index >= 0 && index < this.fruits.length) {
                this.fruits.splice(index, 1);
                return;
              }
              this.fruits.length && this.fruits.pop();
            }
          }
        });
      </script>
    </template>
  </code>
</o-playground>

In diesem Beispiel können wir sehen:- `$index` steht für den Index des aktuellen Elements (beginnend bei 0)
- `$data` steht für das Datenobjekt des aktuellen Elements
- `$host` steht für die aktuelle Komponenteninstanz, die zum Aufrufen von Komponentenmethoden oder zum Zugreifen auf Komponentendaten verwendet werden kann
- Wenn sich das Array ändert, wird die Liste automatisch aktualisiert

## Vorlagen-Rendering

Für komplexere Listenelementstrukturen kann der Ansatz benannter Vorlagen verwendet werden. Definieren Sie die Vorlage im `template`-Tag und referenzieren Sie sie dann in `o-fill` über das `name`-Attribut.

<o-playground name="o-fill - Vorlagen-Rendering" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        .product-card { border: 1px solid #747474; border-radius: 8px; padding: 12px; margin: 10px 0; }
        .product-name { font-weight: bold; font-size: 1.1em; }
        .product-price { color: #832c22; font-weight: bold; }
        .product-desc { color: #929292; font-size: 0.9em; margin-top: 5px; }
      </style>
      <h3>Produktliste</h3>
      <button on:click="addProduct">Produkt hinzufügen</button>
      <div class="products-container">
        <o-fill :value="products" name="product-template"></o-fill>
      </div>
      <template name="product-template">
        <div class="product-card">
          <div class="product-name">{{$data.name}}</div>
          <div class="product-price">¥{{$data.price}}</div>
          <div class="product-desc">{{$data.description}}</div>
          <small>Nr.: {{$index + 1}}</small>
        </div>
      </template>
      <script>
        export default async () => ({
          data: {
            products: [
              { name: "MacBook Pro", price: 12999, description: "Hochleistungs-Laptop, geeignet für professionelle Arbeiten" },
              { name: "iPhone 15", price: 5999, description: "Neuestes Smartphone mit hervorragender Fotoqualität" },
              { name: "AirPods Pro", price: 1999, description: "Kabellose Rauschunterdrückungskopfhörer mit exzellentem Klang" }
            ],
            productIndex: 0,
          },
          proto: {
            addProduct() {
              const productNames = ["iPad Air", "Apple Watch", "Magic Mouse", "Pro Display"];
              const productDescs = ["Leichtes und tragbares Tablet", "Intelligente Uhr, Gesundheitsüberwachung", "Ergonomisch gestaltete Maus", "Professioneller Monitor"];
              const name = productNames[this.productIndex % productNames.length];
              const desc = productDescs[this.productIndex % productDescs.length];
              this.products.push({
                name: name,
                price: Math.floor(Math.random() * 5000) + 1000,
                description: desc
              });
              this.productIndex++;
            }
          }
        });
      </script>
    </template>
  </code>
</o-playground>

## Verschachtelte Listen rendern

`o-fill` unterstützt verschachtelte Verwendung und kann komplexe hierarchische Datenstrukturen wie Baummenüs, Kategorielisten usw. verarbeiten.

<o-playground name="o-fill - Verschachtelte Listendarstellung" style="--editor-height: 800px">
  <code>
    <!-- Verschachtelte Listendarstellung -->
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .category {
          border-left: 3px solid #3498db;
          padding-left: 15px;
          margin: 10px 0;
        }
        .subcategory {
          border-left: 2px solid #9b59b6;
          padding-left: 15px;
          margin: 8px 0;
        }
        .item {
          padding: 5px 0;
          margin: 5px 0;
          color: #2c3e50;
        }
        h4 {
          margin: 10px 0 5px 0;
          color: #34495e;
        }
      </style>
      <h3>Navigationsbereich für Produktkategorien</h3>
      <div class="navigation">
        <o-fill :value="categories" name="category-template"></o-fill>
      </div>
      <template name="category-template">
        <div class="category">
          <h4> {{$data.name}} </h4>
          <o-fill :value="$data.subcategories" name="subcategory-template"></o-fill>
        </div>
      </template>
      <template name="subcategory-template">
        <div class="subcategory">
          <strong>{{$data.name}}</strong>
          <o-fill :value="$data.items">
            <div class="item"> • {{$data}} </div>
          </o-fill>
        </div>
      </template>
      <script>
        export default async () => {
          return {
            data: {
              categories: [
                {
                  name: "Elektronikprodukte",
                  subcategories: [
                    {
                      name: "Handys",
                      items: ["iPhone", "Android-Handys", "Feature-Phones"]
                    },
                    {
                      name: "Computer",
                      items: ["Laptops", "Desktop-Computer", "Tablets"]
                    }
                  ]
                },
                {
                  name: "Haushaltswaren",
                  subcategories: [
                    {
                      name: "Küchenutensilien",
                      items: ["Kochtöpfe", "Geschirr", "Kleingeräte"]
                    },
                    {
                      name: "Schlafzimmerartikel",
                      items: ["Bettwäsche", "Kleiderschränke", "Dekorationen"]
                    }
                  ]
                },
                {
                  name: "Bekleidung & Accessoires",
                  subcategories: [
                    {
                      name: "Herrenbekleidung",
                      items: ["T-Shirts", "Hemden", "Jacken"]
                    },
                    {
                      name: "Damenbekleidung",
                      items: ["Kleider", "Hosen", "Accessoires"]
                    }
                  ]
                }
              ]
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Leistungsoptimierung und Schlüssel-Wert-Verwaltung

Für Listen, die häufig aktualisiert werden müssen, kann das eindeutige Identifikationsmerkmal über das Attribut `fill-key` angegeben werden, um die Rendering-Leistung zu verbessern.

```html
<!-- Verwendung eines benutzerdefinierten Schlüssels zur Leistungssteigerung -->
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>
```

Im obigen Beispiel teilt `fill-key="id"` ofa.js mit, die `id`-Eigenschaft jedes Datensatzes als eindeutigen Identifikator zu verwenden, sodass auch bei einer Änderung der Reihenfolge des Arrays die entsprechenden Elemente korrekt erkannt und aktualisiert werden können.

## Best Practices für das Rendern von Listen

1. **Ereignisbehandlung**: Bei der Verwendung von Ereignissen in Listenelementen beachten Sie, dass `$host` auf die aktuelle Komponenteninstanz und `$data` auf die aktuellen Datenpunkte verweist.
2. **Auswahl der geeigneten Darstellungsmethode**: Verwenden Sie für einfache Listen die direkte Darstellung, für komplexe Strukturen die Vorlagendarstellung.
3. **Leistungsaspekte**: Verwenden Sie für große oder häufig aktualisierte Listen `fill-key`, um Schlüsselwerte anzugeben.
4. **Datenstruktur**: Stellen Sie sicher, dass jedes Element im Array ein gültiges Datenobjekt ist.
5. **Vermeidung tiefer Verschachtelungen**: Obwohl Verschachtelungen unterstützt werden, sollten zu tiefe Verschachtelungsebenen vermieden werden.