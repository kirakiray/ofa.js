# スクリプトの導入

ofa.jsは、scriptタグを通じて直接導入して使用することができます。HTMLファイルの`<head>`または`<body>`部分に以下のコードを追加するだけです：

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs" type="module"></script>
```

## 基本使用

スクリプトを導入すると、ofa.jsはグローバルスコープに`$`変数を作成し、すべてのコア機能はこのオブジェクトを通じて提供されます。このオブジェクトを通じてofa.jsの様々なメソッドやプロパティにアクセスできます。今後のチュートリアルでは、その具体的な使用方法について詳しく説明します。

## デバッグモード

開発中、スクリプト URL の後に `#debug` パラメータを追加することで、デバッグモードを有効にできます：

```html
<script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs#debug" type="module"></script>
```

デバッグモードはソースマップ機能を有効にし、ブラウザの開発者ツールでファイルの元のソースコードを直接表示およびデバッグできるようにし、開発効率を大幅に向上させます。

## ESMモジュール

ofa.jsはESMモジュールでのインポートもサポートしています。プロジェクト内で`import`文を使ってofa.jsをインポートできます：

```javascript
import 'https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.min.mjs';
```

ESM モジュールを使用する場合、コード内で `$` 変数を直接使用でき、グローバルスコープを介してアクセスする必要はありません。