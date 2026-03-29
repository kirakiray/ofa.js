# unwrap



El método `unwrap` se utiliza para eliminar el elemento de envoltura externo del elemento objetivo.

<o-playground name="unwrap - eliminar envoltura" style="--editor-height: 440px">
  <code path="demo.html">
    <template>
      <style> div{border: #aaa solid 1px; margin:8px; padding:8px;} </style>
      <div style="color:red;border-color:red;">
        <div id="target">I am target</div>
      </div>
      <script>
        setTimeout(()=>{
          \$('#target').unwrap();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## Precauciones

El elemento objetivo **debe tener un nodo padre**, de lo contrario no se puede ejecutar la operación de unwrap.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
</div>
`);

$el.unwrap(); // Error, no elemento padre, no se puede desenvuelve
$el.$('#target').unwrap(); // Correcto, eliminar el elemento envolvente
```

Cuando el elemento objetivo tiene otros elementos hermanos, tampoco se puede ejecutar unwrap.

```javascript
const $el = $(`
<div>
    <div id="target"></div>
    <div>I am siblings</div>
</div>
`);

$el.$('#target').unwrap(); // Error, porque tiene otros nodos adyacentes
```

**Tenga en cuenta que no se debe operar dentro de componentes de plantilla como o-fill o o-if.**