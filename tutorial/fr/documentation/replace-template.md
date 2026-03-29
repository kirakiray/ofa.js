# Composant replace-temp

Lorsque nous tentons de rendre une liste à l'intérieur d'éléments spéciaux comme select ou table, le navigateur peut automatiquement supprimer le composant `<x-fill>`, entraînant l'échec du rendu de la liste. On peut alors utiliser la méthode replace-temp pour résoudre ce problème.

La méthode d'utilisation est : définir `is="replace-temp"` sur la balise `<template>` et la placer à l'intérieur d’un élément que le navigateur corrigera automatiquement.

<o-playground name="replace-temp composant" style="--editor-height: 500px">
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

