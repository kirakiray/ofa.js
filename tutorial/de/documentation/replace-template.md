# replace-temp Komponente

Wenn wir versuchen, ein Listen-Rendering in speziellen Elementen wie select oder table durchzuführen, könnte der Browser die `<x-fill>`-Komponente automatisch entfernen, was zu einem Fehler beim Listen-Rendering führt. In diesem Fall kann man die replace-temp-Methode verwenden, um dieses Problem zu lösen.

Die Verwendungsweise ist: Setzen Sie `is="replace-temp"` auf dem `<template>`-Tag und platzieren Sie es innerhalb eines Elements, das der Browser automatisch korrigiert.

<o-playground name="replace-temp Komponente" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <div>
        <select>
            <template is="replace-temp">
                <x-fill :value="items">
                    <option>{{$data}}</option>
                </x-fill>
            </template>
        </select>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              items: ["A", "B", "C"],
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

