# Producción y Despliegue

Los proyectos desarrollados con ofa.js se pueden desplegar directamente en un servidor estático y estarán listos para usar.

## Entorno de desarrollo

Puedes usar el [ofa Studio](https://core.noneos.com/?redirect=studio) oficial para desarrollar, el cual ofrece la creación de proyectos y vista previa con un solo clic.

También puedes construir tu propio servidor estático:

* Usar software de servidor estático como Nginx o Apache
* Usar el módulo [http-server](https://www.npmjs.com/package/http-server) de Node.js
* Usar directamente el plugin de servidor estático del editor para previsualizar

## Entorno de Producción

### Exportar proyecto

Si estás usando [ofa Studio](https://core.noneos.com/?redirect=studio) para construir proyectos, simplemente utiliza la función de exportación integrada en la herramienta.

Si es un proyecto construido manualmente, puedes implementar directamente la carpeta del proyecto en un servidor estático, manteniendo el mismo modo que en el entorno de desarrollo.

### Compresión y ofuscación

En un entorno de producción, normalmente se necesitan herramientas de compresión y ofuscación para reducir el tamaño de los archivos y mejorar la velocidad de carga. Puedes usar [Terser CLI](https://terser.org/docs/cli-usage/) para comprimir y ofuscar.

Si no deseas usar herramientas de línea de comandos, puedes usar [ofa build](https://builder.ofajs.com/) para comprimir y ofuscar archivos en línea. Esta herramienta está actualmente en versión beta y se integrará en ofa Studio en el futuro.

