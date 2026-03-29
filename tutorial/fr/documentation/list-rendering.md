# Rendu de liste

Dans ofa.js, le composant `o-fill` offre une puissante fonction de rendu de listes, capable de restituer efficacement des données de tableau en plusieurs éléments similaires. Il prend en charge deux modes d'utilisation principaux : le rendu direct et le rendu par modèle.

## Présentation du composant o-fill

`o-fill` est le composant central d'ofa.js pour le rendu des listes ; il reçoit un attribut `value` de type tableau et génère un élément DOM correspondant pour chaque élément du tableau. Lors du rendu, ofa.js suit automatiquement les changements du tableau et met à jour le DOM de manière efficace.

### Fonctionnalités principales :

- **Mise à jour efficace** : suivi des changements de tableau par clé, mise à jour uniquement des parties nécessitant des modifications
- **Accès à l'index** : accès à l'index de l'élément actuel via `$index`
- **Accès aux données** : accès aux données de l'élément actuel via `$data`
- **Accès à l'hôte** : accès à l'instance du composant actuel via `$host`, permettant d'appeler des méthodes de composant ou d'accéder aux données de composant
- **Réutilisation de modèle** : support de modèles nommés pour le rendu de listes complexes

## Rendu direct

Le rendu direct est la méthode la plus simple : le contenu du modèle est écrit directement à l’intérieur de la balise `o-fill`. Lorsque le tableau change, `o-fill` crée automatiquement un élément correspondant pour chaque donnée.

<o-playground name="o-fill - Rendu direct" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        ul { list-style: none; padding: 0; }
        li { padding: 8px; margin: 5px 0; background: #7e7e7e; border-radius: 4px; }
      </style>
      <h3>Liste de fruits</h3>
      <button on:click="addItem">Ajouter un fruit</button>
      <button on:click="removeItem">Supprimer le dernier</button>
      <ul>
        <o-fill :value="fruits">
          <li> {{$index + 1}}. {{$data.name}} - Prix : ¥{{$data.price}} <button on:click="$host.removeItem($index)">Supprimer</button></li>
        </o-fill>
      </ul>
      <script>
        export default async () => ({
          data: { 
            fruits: [
              { name: "🍎 Pomme", price: 5 },
              { name: "🍊 Orange", price: 6 },
              { name: "🍌 Banane", price: 3 }
            ],
            fruitIndex: 0,
          },
          proto: {
            addItem() {
              const fruitNames = ["🍇 Raisin", "🍓 Fraise", "🥝 Kiwi", "🍑 Pêche", "🥭 Mangue"];
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

Dans cet exemple, nous pouvons voir :- `$index` représente l’index de l’élément actuel (à partir de 0)
- `$data` représente l’objet de données de l’élément actuel
- `$host` représente l’instance du composant actuel, permettant d’appeler des méthodes du composant ou d’accéder aux données du composant
- Lorsque le tableau change, la liste se met à jour automatiquement

## Rendu de template

Pour des structures d’éléments de liste plus complexes, on peut utiliser des modèles nommés. Définissez le modèle dans la balise `template`, puis référencez-le dans `o-fill` via l’attribut `name`.

<o-playground name="o-fill - Rendu de modèle" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        .product-card { border: 1px solid #747474; border-radius: 8px; padding: 12px; margin: 10px 0; }
        .product-name { font-weight: bold; font-size: 1.1em; }
        .product-price { color: #832c22; font-weight: bold; }
        .product-desc { color: #929292; font-size: 0.9em; margin-top: 5px; }
      </style>
      <h3>Liste de produits</h3>
      <button on:click="addProduct">Ajouter un produit</button>
      <div class="products-container">
        <o-fill :value="products" name="product-template"></o-fill>
      </div>
      <template name="product-template">
        <div class="product-card">
          <div class="product-name">{{$data.name}}</div>
          <div class="product-price">¥{{$data.price}}</div>
          <div class="product-desc">{{$data.description}}</div>
          <small>Numéro : {{$index + 1}}</small>
        </div>
      </template>
      <script>
        export default async () => ({
          data: {
            products: [
              { name: "MacBook Pro", price: 12999, description: "Ordinateur portable haute performance, adapté au travail professionnel" },
              { name: "iPhone 15", price: 5999, description: "Dernier smartphone, excellente qualité photo" },
              { name: "AirPods Pro", price: 1999, description: "Écouteurs sans fil à réduction de bruit, qualité sonore excellente" }
            ],
            productIndex: 0,
          },
          proto: {
            addProduct() {
              const productNames = ["iPad Air", "Apple Watch", "Magic Mouse", "Pro Display"];
              const productDescs = ["Tablette fine et portable", "Montre connectée, surveillance de la santé", "Souris au design ergonomique", "Moniteur professionnel"];
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

## Rendu de listes imbriquées

`o-fill` supporte l’imbrication et peut gérer des structures de données hiérarchiques complexes, telles que des menus arborescents, des listes de catégories, etc.

<o-playground name="o-fill - Rendu de listes imbriquées" style="--editor-height: 800px">
  <code>
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
      <h3>Navigation des catégories de produits</h3>
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
                  name: "Électronique",
                  subcategories: [
                    {
                      name: "Téléphones",
                      items: ["iPhone", "Téléphones Android", "Téléphones classiques"]
                    },
                    {
                      name: "Ordinateurs",
                      items: ["Portables", "Bureaux", "Tablettes"]
                    }
                  ]
                },
                {
                  name: "Articles ménagers",
                  subcategories: [
                    {
                      name: "Ustensiles de cuisine",
                      items: ["Batterie de cuisine", "Couverts", "Petits appareils"]
                    },
                    {
                      name: "Articles de chambre",
                      items: ["Linge de lit", "Armoires", "Décorations"]
                    }
                  ]
                },
                {
                  name: "Vêtements et accessoires",
                  subcategories: [
                    {
                      name: "Hommes",
                      items: ["T-shirts", "Chemises", "Manteaux"]
                    },
                    {
                      name: "Femmes",
                      items: ["Robes", "Pantalons", "Accessoires"]
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

## Optimisation des performances et gestion des paires clé-valeur

Pour les listes nécessitant des mises à jour fréquentes, vous pouvez spécifier un identifiant unique via l'attribut `fill-key` afin d'améliorer les performances de rendu.

```html
<!-- Utiliser des clés personnalisées pour améliorer les performances -->
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>
```

Dans l’exemple ci-dessus, `fill-key="id"` indique à ofa.js d’utiliser la propriété `id` de chaque élément de données comme identifiant unique, afin que, même si l’ordre du tableau change, les éléments correspondants puissent être correctement identifiés et mis à jour.

## Meilleures pratiques de rendu de liste

1. **Gestion des événements** : lors de l’utilisation d’événements dans les éléments de la liste, notez que `$host` pointe vers l’instance du composant actuel et que `$data` pointe vers les données de l’élément actuel  
2. **Choisir la méthode de rendu appropriée** : pour une liste simple, utilisez le rendu direct ; pour une structure complexe, utilisez le rendu par modèle  
3. **Considérations de performance** : pour les grandes listes ou les listes mises à jour fréquemment, utilisez `fill-key` pour spécifier la clé  
4. **Structure des données** : assurez-vous que chaque élément du tableau est un objet de données valide  
5. **Éviter l’imbrication profonde** : bien que l’imbrication soit supportée, évitez les niveaux d’imbrication trop profonds