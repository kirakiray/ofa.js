# 非明示コンポーネント

ofa.js には、2種類の非表示コンポーネントが組み込まれています：

* 条件レンダリングコンポーネント：`x-if`、`x-else-if`、`x-else`
* フィルコンポーネント：`x-fill`

これらの2つのコンポーネントの機能はそれぞれ `o-if` および `o-fill` コンポーネントと同じですが、それ自体は実際にはDOMにレンダリングされず、内部の要素を対応する領域に直接レンダリングします。

例えば：

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- スタイルは赤色ではありません。なぜなら、o-if コンポーネント自体が DOM に存在するためです -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- スタイルは赤色です。なぜなら、x-if コンポーネントは DOM にレンダリングされないためです -->
        <div class="item">2</div>
    </x-if>
</div>
```

<o-playground name="非明示的コンポーネント" style="--editor-height: 500px">
  <code>
    <template page>
        <style>
        :host {
            display: block;
            border: 1px solid red;
            padding: 10px;
        }
        .container > .item {
            /* 子階層の .item 要素を赤にする */
            color:red;
        }
        /* o-if コンポーネント内部の .item 要素を選択する必要がある */
        /* .container > o-if > .item {
            color:green;
        } */
        </style>
        <div class="container">
            <o-if :value="true">
                <!-- スタイルは赤にならない、o-if コンポーネント自体が DOM に存在するため -->
                <div class="item">赤色で表示されない</div>
            </o-if>
            <x-if :value="true">
                <!-- スタイルは赤になる、x-if コンポーネントは DOM にレンダリングされないため -->
                <div class="item">赤色で表示される</div>
            </x-if>
        </div>
        <script>
        export default async () => {
            return {
            data: {},
            };
        };
        </script>
    </template>
  </code>
</o-playground>

## x-if 条件渲染コンポーネント

`x-if` と [o-if](./conditional-rendering.md) の機能は完全に同じで、条件式の真偽値に基づいてコンテンツをレンダリングするかどうかを決定するために使用されます。違いは、`x-if` 自体は DOM 要素として存在せず、その内部コンテンツが親コンテナに直接レンダリングされる点です。

```html
<div class="container">
    <x-if :value="isLoggedIn">
        <p>おかえりなさい、ユーザーさん！</p>
    </x-if>
</div>
```

`x-if` は `x-else-if` や `x-else` と組み合わせて使うこともできます：

```html
<div class="container">
    <x-if :value="role === 'admin'">
        <p>管理者パネル</p>
    </x-if>
    <x-else-if :value="role === 'user'">
        <p>ユーザーセンター</p>
    </x-else-if>
    <x-else>
        <p>ログインしてください</p>
    </x-else>
</div>
```

## x-fill 塗りつぶしコンポーネント

`x-fill` は [o-fill](./list-rendering.md) と全く同じ機能を持ち、配列データを複数の DOM 要素としてレンダリングするために使用されます。`x-if` と同様に、`x-fill` 自体は DOM にレンダリングされず、その内部テンプレートは直接親コンテナにレンダリングされます。

```html
<ul>
    <x-fill :value="items">
        <li>{{$data.name}}</li>
    </x-fill>
</ul>
```

名前付きテンプレートの使用例：

```html
<ul>
    <x-fill name="li" :value="items"></x-fill>
</ul>

<template name="li">
    <li class:active="$data.active">
        <a attr:href="$data.href">{{$data.name}}</a>
    </li>
</template>
```

## 性能説明

機能的な違いの他に、非明示的コンポーネントのレンダリング性能は明示的コンポーネント（`o-if`、`o-fill`）と比べて**ずっと悪くなります**。これは、非明示的コンポーネントは実際には DOM にレンダリングされず、内部要素の位置決めや更新を処理するための追加の疑似レンダリングロジックが必要になるためです。

また、非明示的なコンポーネントはいくつかの見つけにくいバグを引き起こす可能性があります：実際にはDOMに追加されないため、DOM構造に依存する操作（イベントのバインド、スタイル計算、またはサードパーティ製ライブラリのクエリなど）が失敗したり、異常な挙動を示したりする可能性があります。

したがって、**明示的コンポーネント**（`o-if`、`o-else-if`、`o-else`、`o-fill`）を優先的に使用し、特定のシナリオでのみ非明示的コンポーネントを使用することをお勧めします。

## 使用シーン

非表示コンポーネントのパフォーマンスは劣りますが、以下のシナリオでは使用される可能性があります：

1. **余分な DOM 階層の回避**：`o-if` または `o-fill` 要素を DOM 構造の一部にしたくない場合
2. **スタイルの継承**：内部要素が中間コンポーネント要素の影響を受けずに、親コンテナのスタイルを直接継承する必要がある場合
3. **CSS セレクタの制限**：親の直接子セレクタ（例：`.container > .item`）を使用してスタイルを正確に制御したいが、中間に余分なラッパー要素を望まない場合