# replace-temp コンポーネント

select や table などの特殊な要素内でリストレンダリングを試みると、ブラウザが `<x-fill>` コンポーネントを自動的に削除し、リストレンダリングが失敗することがあります。この問題を解決するには、replace-temp を使用できます。

使用方法は：`<template>`タグに`is="replace-temp"`を設定し、それをブラウザが自動的に修正する要素の内部に配置します。

<o-playground name="replace-temp コンポーネント" style="--editor-height: 500px">
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

