# Introducción de scripts

ofa.js admite la incorporación directa mediante la etiqueta script. Solo añade el siguiente código en la sección `<head>` o `<body>` de tu archivo HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## Uso básico

Después de introducir el script, ofa.js creará una variable `$` en el ámbito global, y todas las funciones principales se proporcionarán a través de este objeto. Puedes acceder a varios métodos y propiedades de ofa.js a través de este objeto. Los tutoriales posteriores detallarán su uso específico.

## Modo de depuración

Durante el desarrollo, puede activar el modo de depuración añadiendo el parámetro `#debug` al final de la URL del script:

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.mjs#debug" type="module"></script>
```

El modo de depuración habilita la función de mapas de origen (source map), permitiéndole ver y depurar directamente el código fuente original de los archivos en las herramientas de desarrollo del navegador, lo que mejora significativamente la eficiencia del desarrollo.

## Módulo ESM

ofa.js también admite la importación mediante módulos ESM. Puede usar la sentencia `import` en su proyecto para importar ofa.js:

```javascript
import 'https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.mjs';
```

Al usar módulos ESM, puede usar directamente la variable `$` en el código, sin necesidad de acceder a través del ámbito global.