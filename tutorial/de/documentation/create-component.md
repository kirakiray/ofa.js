# Komponente erstellen

In ofa.js sind Komponenten der Kernmechanismus zur Implementierung von Wiederverwendung und Modularisierung von Seiten. Im Wesentlichen ist eine Komponente ein benutzerdefiniertes Web Component, das durch die Definition von Vorlagen, Stilen und Logik wiederverwendbare UI-Elemente erstellen kann.

## Grundlegende Struktur der Komponente

Im Gegensatz zu Seitenmodulen verwendet das `<template>`-Element von Komponentenmodulen stattdessen das `component`-Attribut und deklariert das `tag`-Attribut, um den Komponententagnamen anzugeben.

An der Stelle, an der die Komponente benötigt wird, wird das Komponentenmodul asynchron über das `l-m`-Tag geladen, und das System registriert es automatisch. Anschließend kann die Komponente direkt wie ein normales HTML-Tag verwendet werden.

<o-playground name="Grundlegendes Beispiel für Komponenten" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./demo-comp.html"></l-m>
      <demo-comp></demo-comp>
    </template>
  </code>
  <code path="demo-comp.html" active>
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async () => {
          return {
            tag: "demo-comp",
            data: {
              title: "OFAJS Komponentenbeispiel",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Kernkonzepte der Komponenten

### tag - Komponenten-Tagname

`tag` ist der Tag-Name der Komponente und **muss mit dem im Gebrauch verwendeten Tag-Namen übereinstimmen**. Wenn Sie beispielsweise den `tag` Ihrer Komponente als `"demo-comp"` definieren, dann müssen Sie in der HTML-Nutzung `<demo-comp></demo-comp>` schreiben.

### Komponentenmodulreferenz

Durch das `l-m`-Tag werden Komponentenmodule eingebunden, die automatisch registriert werden. Dies ähnelt dem Einbinden von Skripten über das `script`-Tag, aber `l-m` ist speziell für das Laden und Registrieren von Komponentenmodulen vorgesehen.

Beachten Sie: Das `l-m`-Referenztag ist eine **asynchrone Referenz**, die sich für das bedarfsgerechte Laden von Komponenten beim Laden der Seite eignet.

## Synchronisierte Referenzkomponente

In manchen Szenarien müssen Sie möglicherweise Komponenten synchron laden (z. B. um sicherzustellen, dass eine Komponente registriert ist, bevor sie verwendet wird). In diesem Fall können Sie die `load`-Methode in Kombination mit dem `await`-Schlüsselwort verwenden, um eine synchrone Referenz zu implementieren.

In Komponenten- und Seitenmodulen wird automatisch eine `load`-Funktion eingefügt, mit der Entwickler die benötigten Ressourcen synchron laden können.

<o-playground name="Synchrones Referenzkomponentenbeispiel" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="page1.html"></o-page>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <div>
        <demo-comp></demo-comp>
      </div>
      <script>
        // eslint-disable-next-line
        export default async ({ load }) => {
          await load("./demo-comp.html");
          return {
            data: {},
            proto: {},
          };
        };
      </script>
    </template>
  </code>
  <code path="demo-comp.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid green;
          padding: 10px;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async ({ load }) => {
          return {
            tag: "demo-comp",
            data: {
              title: "OFAJS Komponentenbeispiel",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Asynchrone Referenzen vs. Synchrone Referenzen

| Verweisart | Schlüsselwort | Merkmal |
|---------|-------|------|
| Asynchroner Verweis | `l-m` Tag | Nicht blockierendes Laden, geeignet für bedarfsweises Laden von Komponenten |
| Synchroner Verweis | `load` Methode mit `await` Schlüsselwort | Blockierendes Laden, stellt sicher, dass die Komponente vor der Verwendung registriert ist |Das `l-m`-Tag-Referenz und die `load`-Methode können beide Komponentenmodule laden. In der Regel wird empfohlen, die `l-m`-Tags asynchron zu verwenden, um Komponenten zu referenzieren, um nicht-blockierendes Laden und bedarfsgesteuertes Laden zu erreichen.