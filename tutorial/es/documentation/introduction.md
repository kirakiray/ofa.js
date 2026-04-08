# Introducción

## ¿Qué es ofa.js?

ofa.js es un framework web frontend fácil de usar, diseñado específicamente para construir aplicaciones web, con el objetivo de mejorar la eficiencia de desarrollo y reducir el umbral de entrada.

> Si ya estás **familiarizado** con HTML, CSS y JavaScript, entonces ofa.js es una excelente opción.

## ¿Por qué desarrollo ofa.js?

El objetivo de diseño de ofa.js es bastante simple: resolver los problemas de **ingeniería** en el desarrollo web sin depender de herramientas de compilación.

> La ingenierización se refiere a la integración sistemática de normas, procesos, herramientas y métodos en el proceso de desarrollo de software para mejorar la eficiencia del desarrollo, la calidad del código y la mantenibilidad.

En la última década, el desarrollo frontend de la web ha experimentado una evolución desde un crecimiento inicial desordenado hasta una gradual ingenierización. Este proceso se ha basado en la experiencia del desarrollo de aplicaciones tradicionales, resolviendo los problemas de ingeniería en proyectos de gran escala mediante la introducción de Node.js y flujos de compilación.

Sin embargo, a medida que el proyecto crecía, las desventajas de este modelo se hicieron evidentes gradualmente, surgiendo el problema de la **aplicación monolítica** que se enfrenta en el desarrollo tradicional, lo que dificulta el mantenimiento del proyecto y la iteración de los requisitos de interacción.

> Una aplicación monolítica (Monolithic Application) se refiere a una aplicación única enorme y fuertemente acoplada, donde todos los módulos funcionales están concentrados en un único repositorio de código. Cualquier cambio afecta a todo el sistema, lo que dificulta el desarrollo y despliegue independientes.

En este momento es necesario descomponer el proyecto y lograr una micro-frontendización, al igual que con los **microservicios**. Sin embargo, debido al procesamiento de compilación, los micro-frontends se vuelven difíciles y engorrosos; el despliegue independiente de los módulos frontend requiere compilar cada pequeño módulo, lo cual es muy difícil, provocando que el desarrollo de la tecnología frontend Web prácticamente se estanque.

> Los microservicios (Microservices) son un estilo de arquitectura de software que divide una aplicación grande y compleja en varios servicios pequeños, de granularidad fina, desplegados y ejecutados de forma independiente.

En ese momento, empecé a reflexionar: los lenguajes de programación tradicionales necesitan adaptarse a diferentes hardware y sistemas operativos, por lo que deben lograr la independencia de plataforma a través de la compilación. Pero el desarrollo web es diferente; se basa en el navegador, que originalmente no requiere compilación, puede ejecutarse e implementarse de forma independiente, y de manera inherente adopta un modelo de microfrontend. Entonces me di cuenta de que es el proceso de compilación el que en realidad complica las cosas.

Es decir, siempre y cuando se resuelvan los problemas de ingeniería y se elimine el paso necesario de compilación, el desarrollo frontend es muy adecuado para crear aplicaciones a gran escala, lo que constituye un modo de microfrontend innato. Así nació ofa.js.

## Ventajas principales

### Cero barrera de entrada, listo para usar

Sin necesidad de configurar un entorno de desarrollo, instalar dependencias o configurar scaffolds, abra el programa de compilación oficial a través del navegador, seleccione un directorio local y podrá comenzar a desarrollar. Todas las operaciones de cálculo, datos y almacenamiento se ejecutan localmente, sin necesidad de depender de servicios en la nube.

### Amigable con la IA, fácil de verificar

Sin caja negra de compilación, el código generado por IA se puede implementar y autoverificar rápidamente; reduce las capas intermedias, evita el proceso de compilación, haciendo que el código sea más fácil de localizar problemas y reparar.

### Soporte nativo para micro-frontends

ofa.js permite que el desarrollo web frontend se divida en múltiples módulos independientes, como los microservicios, donde cada módulo puede desarrollarse e implementarse de forma independiente. Una vez que se rompen los límites del desarrollo web frontend tradicional, la tecnología frontend superará gradualmente las limitaciones de la tecnología del servidor.

## Comenzar a usar

- Si tienes cierta base en desarrollo, puedes empezar por [Inclusión de scripts](./script-reference.md).
- Si eres principiante, se recomienda comenzar por [Crear tu primera aplicación](./create-first-app.md).