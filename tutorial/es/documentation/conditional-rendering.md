# Renderizado Condicional

En ofa.js, el renderizado condicional es una función importante que permite decidir si se renderiza un elemento o componente según el estado de los datos. ofa.js proporciona una solución de renderizado condicional basada en componentes, implementada a través de los componentes `o-if`, `o-else-if` y `o-else`.

## Componente o-if

El componente `o-if` se utiliza para decidir si se renderiza su contenido según el valor verdadero o falso de una expresión. Cuando el atributo `value` enlazado es verdadero, el contenido dentro del componente se renderiza; de lo contrario, el contenido no aparece en el DOM.

<o-playground name="Ejemplo de funcionamiento de o-if" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="isHide = !isHide">Alternar visualización</button>
      <o-if :value="!isHide">
        <p>{{val}}</p>
      </o-if>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Hola, código de demostración de ofa.js",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Cómo funciona o-if

`o-if` renderizará el contenido en el DOM solo cuando la condición sea verdadera. Cuando la condición sea falsa, los elementos DOM dentro de `o-if` serán completamente eliminados. Esta implementación es adecuada para situaciones donde las condiciones no cambian con mucha frecuencia, ya que implica la creación y destrucción del DOM.

## Componentes o-else-if y o-else

Cuando se necesitan múltiples ramas condicionales, se pueden usar los componentes `o-else-if` y `o-else` junto con `o-if` para lograr una renderización condicional de múltiples ramas.

- `o-if`：componente de condición obligatorio, debe ser el primero
- `o-else-if`：componente de condición intermedio opcional, puede haber varios
- `o-else`：componente de condición por defecto opcional, se coloca al final

<o-playground name="Ejemplo de renderizado condicional de múltiples ramas" style="--editor-height: 500px">
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
      <!-- Según el resultado del módulo de num entre 3, muestra diferentes contenidos -->
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

## Ejemplos de escenarios de aplicación práctica

### Control de permisos de usuario

<o-playground name="Ejemplo de Control de Permisos de Usuario" style="--editor-height: 500px">
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
        <button on:click="toggleUserRole">Cambiar Rol de Usuario</button>
        <p>Rol actual: {{role}}</p>
        <o-if :value="role === 'admin'">
          <div class="admin-panel">
            <h3>Panel de Administrador</h3>
            <button>Gestionar Usuarios</button>
            <button>Configuración del Sistema</button>
          </div>
        </o-if>
        <o-else-if :value="role === 'user'">
          <div class="user-info">
            <h3>Información del Usuario</h3>
            <p>¡Bienvenido {{userName}}!</p>
          </div>
        </o-else-if>
        <o-else>
          <p>Por favor, inicia sesión para ver el contenido</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              role: 'guest',
              userName: 'Invitado'
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

### Visualización del estado de validación del formulario

<o-playground name="Ejemplo de visualización del estado de validación de formularios" style="--editor-height: 500px">
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
        <h3>Ejemplo de validación de correo electrónico</h3>
        <input type="email" :value="email" on:input="email = $event.target.value" placeholder="Introduce la dirección de correo">
        <o-if :value="email && isValidEmail(email)">
          <p style="color:green;">✓ Formato de correo correcto</p>
        </o-if>
        <o-else-if :value="email && !isValidEmail(email) && email.length > 0">
          <p style="color:red;">✗ Formato de correo incorrecto</p>
        </o-else-if>
        <o-else>
          <p style="color:orange;">Introduce una dirección de correo para validar</p>
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

## Mejores prácticas para el renderizado condicional

1. **Escenarios de uso**: Cuando un elemento rara vez cambia entre diferentes condiciones, es más adecuado utilizar `o-if`, ya que permite eliminar completamente los elementos innecesarios, ahorrando memoria.

2. **Consideraciones de rendimiento**: Para elementos que cambian con frecuencia, es preferible utilizar el enlace de clases (por ejemplo, `class:hide`) en lugar del renderizado condicional, ya que este último implica la creación y destrucción del DOM.

3. **Estructura clara**: El renderizado condicional es especialmente adecuado para alternar contenidos con estructuras diferentes, como pestañas, guías paso a paso, etc.