# Renderizado de listas

En ofa.js, el componente `o-fill` proporciona una potente función de renderizado de listas, capaz de renderizar eficientemente datos de array en múltiples elementos similares. Admite dos formas principales de uso: renderizado directo y renderizado de plantilla.

## Introducción del componente o-fill

`o-fill` es el componente principal en ofa.js para el renderizado de listas; recibe una propiedad `value` de tipo array y genera un elemento DOM correspondiente para cada ítem del array. Durante el renderizado, ofa.js rastrea automáticamente los cambios en el array y actualiza el DOM de manera eficiente.

### Características principales：

- **高效更新**：通过键值跟踪数组变化，仅更新需要变更的部分
- **索引访问**：通过 `$index` 访问当前项的索引
- **数据访问**：通过 `$data` 访问当前项的数据
- **宿主访问**：通过 `$host` 访问当前组件实例，可调用组件方法或访问组件数据
- **模板复用**：支持使用命名模板进行复杂列表渲染

## Renderizado directo

La renderización directa es la forma más sencilla de uso: se escribe el contenido de la plantilla directamente dentro de la etiqueta `o-fill`. Cuando el array cambia, `o-fill` crea automáticamente los elementos correspondientes para cada dato.

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

En este ejemplo, podemos ver:- `$index` representa el índice del elemento actual (comenzando desde 0)
- `$data` representa el objeto de datos del elemento actual
- `$host` representa la instancia del componente actual, se puede utilizar para invocar métodos del componente o acceder a los datos del componente
- Cuando el array cambia, la lista se actualiza automáticamente

## Renderizado de plantillas

Para estructuras de elementos de lista más complejas, puede utilizar plantillas con nombre. Defina la plantilla dentro de la etiqueta `template` y luego refiérase a ella en `o-fill` mediante el atributo `name`.

<o-playground name="o-fill - Renderizado de plantilla" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        .product-card { border: 1px solid #747474; border-radius: 8px; padding: 12px; margin: 10px 0; }
        .product-name { font-weight: bold; font-size: 1.1em; }
        .product-price { color: #832c22; font-weight: bold; }
        .product-desc { color: #929292; font-size: 0.9em; margin-top: 5px; }
      </style>
      <h3>Lista de Productos</h3>
      <button on:click="addProduct">Agregar Producto</button>
      <div class="products-container">
        <o-fill :value="products" name="product-template"></o-fill>
      </div>
      <template name="product-template">
        <div class="product-card">
          <div class="product-name">{{$data.name}}</div>
          <div class="product-price">¥{{$data.price}}</div>
          <div class="product-desc">{{$data.description}}</div>
          <small>Número de serie: {{$index + 1}}</small>
        </div>
      </template>
      <script>
        export default async () => ({
          data: {
            products: [
              { name: "MacBook Pro", price: 12999, description: "Computadora portátil de alto rendimiento, adecuada para trabajo profesional" },
              { name: "iPhone 15", price: 5999, description: "Último modelo de teléfono inteligente, excelente calidad de fotos" },
              { name: "AirPods Pro", price: 1999, description: "Auriculares inalámbricos con cancelación de ruido, excelente calidad de sonido" }
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

`o-fill` admite el uso anidado y puede manejar estructuras de datos jerárquicas complejas, como menús de árbol, listas de categorías, etc.

<o-playground name="o-fill - renderizado de listas anidadas" style="--editor-height: 800px">
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
      <h3>Navegación por categorías de productos</h3>
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
                  name: "Electrónica",
                  subcategories: [
                    {
                      name: "Teléfonos",
                      items: ["iPhone", "Teléfonos Android", "Teléfonos básicos"]
                    },
                    {
                      name: "Ordenadores",
                      items: ["Portátiles", "Sobremesa", "Tabletas"]
                    }
                  ]
                },
                {
                  name: "Artículos para el hogar",
                  subcategories: [
                    {
                      name: "Utensilios de cocina",
                      items: ["Cacerolas", "Vajilla", "Electrodomésticos pequeños"]
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
                      items: ["Camisetas", "Camisas", "Abrigos"]
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

En el ejemplo anterior, `fill-key="id"` le dice a ofa.js que use el atributo `id` de cada elemento de datos como identificador único, de modo que incluso si el orden del array cambia, puede identificar y actualizar correctamente los elementos correspondientes.

## Mejores prácticas para renderizado de listas

1. **Manejo de eventos**: Al usar eventos en elementos de lista, tenga en cuenta que `$host` apunta a la instancia del componente actual, y `$data` apunta a los datos del elemento actual
2. **Elegir el método de renderizado adecuado**: Use renderizado directo para listas simples, y renderizado de plantilla para estructuras complejas
3. **Consideraciones de rendimiento**: Para listas grandes o listas que se actualizan frecuentemente, use `fill-key` para especificar el valor de la clave
4. **Estructura de datos**: Asegúrese de que cada elemento en el array sea un objeto de datos válido
5. **Evitar anidación profunda**: Aunque se soporta el anidamiento, se debe evitar niveles de anidación excesivamente profundos