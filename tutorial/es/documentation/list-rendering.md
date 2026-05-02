# Renderizado de listas

En ofa.js, el componente `o-fill` proporciona potentes capacidades de renderizado de listas, permitiendo renderizar eficientemente datos de un array en múltiples elementos similares. Admite dos formas principales de uso: renderizado directo y renderizado con plantillas.

## Introducción al componente o-fill

`o-fill` es el componente principal de ofa.js utilizado para la representación de listas. Recibe un atributo `value` de tipo array y genera un elemento DOM correspondiente para cada elemento del array. Durante el proceso de representación, ofa.js rastrea automáticamente los cambios en el array y actualiza el DOM de manera eficiente.

### Características principales:

- **Actualización eficiente**: rastrea los cambios en la matriz mediante valores clave y actualiza solo las partes que necesitan cambios.
- **Acceso por índice**: accede al índice del elemento actual a través de `$index`.
- **Acceso a datos**: accede a los datos del elemento actual a través de `$data`.
- **Acceso al anfitrión**: accede a la instancia del componente actual a través de `$host`, puede llamar a métodos del componente o acceder a datos del componente.
- **Reutilización de plantillas**: admite el uso de plantillas con nombre para renderizado de listas complejas.

## Renderizado directo

La renderización directa es la forma más simple de usar, escribiendo el contenido de la plantilla directamente dentro de la etiqueta `o-fill`. Cuando el array cambia, `o-fill` crea automáticamente los elementos correspondientes para cada elemento de datos.

<o-playground name="o-fill - renderizado directo" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        ul { list-style: none; padding: 0; }
        li { padding: 8px; margin: 5px 0; background: #7e7e7e; border-radius: 4px; }
      </style>
      <h3>Lista de frutas</h3>
      <button on:click="addItem">Añadir fruta</button>
      <button on:click="removeItem">Eliminar última</button>
      <ul>
        <o-fill :value="fruits">
          <li> {{$index + 1}}. {{$data.name}} - Precio: ¥{{$data.price}} <button on:click="$host.removeItem($index)">Eliminar</button></li>
        </o-fill>
      </ul>
      <script>
        export default async () => ({
          data: { 
            fruits: [
              { name: "🍎 Manzana", price: 5 },
              { name: "🍊 Naranja", price: 6 },
              { name: "🍌 Plátano", price: 3 }
            ],
            fruitIndex: 0,
          },
          proto: {
            addItem() {
              const fruitNames = ["🍇 Uva", "🍓 Fresa", "🥝 Kiwi", "🍑 Durazno", "🥭 Mango"];
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

En este ejemplo, podemos ver:- `$index` representa el índice del elemento actual (comienza desde 0)
- `$data` representa el objeto de datos del elemento actual
- `$host` representa la instancia del componente actual, se puede utilizar para invocar métodos del componente o acceder a los datos del componente
- Cuando el array cambia, la lista se actualiza automáticamente

## Representación de plantillas

Para estructuras de elementos de lista más complejas, se puede utilizar el método de plantilla nombrada. Defina la plantilla en la etiqueta `template` y luego haga referencia a ella mediante el atributo `name` en `o-fill`.

<o-playground name="o-fill - renderizado de plantilla" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        .product-card { border: 1px solid #747474; border-radius: 8px; padding: 12px; margin: 10px 0; }
        .product-name { font-weight: bold; font-size: 1.1em; }
        .product-price { color: #832c22; font-weight: bold; }
        .product-desc { color: #929292; font-size: 0.9em; margin-top: 5px; }
      </style>
      <h3>Lista de productos</h3>
      <button on:click="addProduct">Agregar producto</button>
      <div class="products-container">
        <o-fill :value="products" name="product-template"></o-fill>
      </div>
      <template name="product-template">
        <div class="product-card">
          <div class="product-name">{{$data.name}}</div>
          <div class="product-price">¥{{$data.price}}</div>
          <div class="product-desc">{{$data.description}}</div>
          <small>Número: {{$index + 1}}</small>
        </div>
      </template>
      <script>
        export default async () => ({
          data: {
            products: [
              { name: "MacBook Pro", price: 12999, description: "Portátil de alto rendimiento, adecuado para trabajo profesional" },
              { name: "iPhone 15", price: 5999, description: "Último modelo de teléfono inteligente, excelente para fotografía" },
              { name: "AirPods Pro", price: 1999, description: "Auriculares inalámbricos con cancelación de ruido, calidad de sonido excelente" }
            ],
            productIndex: 0,
          },
          proto: {
            addProduct() {
              const productNames = ["iPad Air", "Apple Watch", "Magic Mouse", "Pro Display"];
              const productDescs = ["Tableta ligera y portátil", "Reloj inteligente, monitoreo de salud", "Ratón con diseño ergonómico", "Monitor de nivel profesional"];
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

## Renderizado de listas anidadas

`o-fill` admite uso anidado y puede manejar estructuras de datos jerárquicas complejas, como menús en árbol, listas de categorías, etc.

<o-playground name="o-fill - Renderizado de listas anidadas" style="--editor-height: 800px">
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
      <h3>Navegación de categorías de productos</h3>
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
                  name: "Productos electrónicos",
                  subcategories: [
                    {
                      name: "Teléfonos",
                      items: ["iPhone", "Android", "Teléfonos básicos"]
                    },
                    {
                      name: "Computadoras",
                      items: ["Portátiles", "Escritorios", "Tabletas"]
                    }
                  ]
                },
                {
                  name: "Artículos para el hogar",
                  subcategories: [
                    {
                      name: "Utensilios de cocina",
                      items: ["Ollas", "Cubiertos", "Pequeños electrodomésticos"]
                    },
                    {
                      name: "Artículos de dormitorio",
                      items: ["Ropa de cama", "Armarios", "Decoración"]
                    }
                  ]
                },
                {
                  name: "Ropa y accesorios",
                  subcategories: [
                    {
                      name: "Ropa de hombre",
                      items: ["Camisetas", "Camisas", "Chaquetas"]
                    },
                    {
                      name: "Ropa de mujer",
                      items: ["Vestidos", "Pantalones", "Accesorios"]
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

## Optimización del rendimiento y gestión de claves-valor

Para listas que requieren actualizaciones frecuentes, puedes especificar un identificador único mediante el atributo `fill-key` para mejorar el rendimiento de renderizado.

```html
<!-- Usar claves personalizadas para mejorar el rendimiento -->
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>
```

En el ejemplo anterior, `fill-key="id"` le dice a ofa.js que use el atributo `id` de cada elemento de datos como identificador único, de modo que incluso si el orden de la matriz cambia, pueda identificar y actualizar correctamente los elementos correspondientes.

## Mejores prácticas de renderizado de listas

1. **Manejo de eventos**: Al utilizar eventos en elementos de lista, tenga en cuenta que `$host` apunta a la instancia del componente actual, y `$data` apunta a los datos del elemento actual.
2. **Seleccione el método de renderizado adecuado**: Para listas simples, use renderizado directo; para estructuras complejas, use renderizado de plantillas.
3. **Consideraciones de rendimiento**: Para listas grandes o que se actualizan con frecuencia, use `fill-key` para especificar el valor clave.
4. **Estructura de datos**: Asegúrese de que cada elemento en la matriz sea un objeto de datos válido.
5. **Evite anidamientos profundos**: Aunque se admiten anidamientos, evite niveles de anidamiento demasiado profundos.