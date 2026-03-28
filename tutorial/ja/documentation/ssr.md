# SSRと同構レンダリング

> SSRが何であるかよくわからない場合は、今のところそれを使う必要がないということです。この章は飛ばして、将来必要になった時に改めて学び直せば大丈夫です。

## 同型レンダリング

CSRのスムーズな体験、より良い機械クローラーの認識（SEO）、およびより自由なバックエンド開発言語の選択を同時に保持するために、ofa.jsは独自のアイソモーフィックレンダリング（Symphony Client-Server Rendering）モードを提供しています。

> CSR / SSR / SSGの詳細な定義とちがいについては、本文末尾の章を直接お読みください。

同型レンダリングの核心理念は：- サーバーサイドで初期ページコンテンツをレンダリングし、SEOと初回表示速度を確保
- クライアントサイドでルーティング処理を引き継ぎ、CSRの滑らかなユーザー体験を維持
- あらゆるサーバー環境に対応し、真のアイソモーフィックレンダリングを実現

### 同じ構造を持つレンダリングの実現原理

ofa.jsの同型レンダリングモードは以下のメカニズムに基づいています：

1. サーバーサイドで共通ランタイム構造を持つ完全なHTMLページを生成
2. クライアントがCSRランタイムエンジンをロード
3. 現在の実行環境を自動識別し、レンダリング戦略を決定

### アイソモーフィックレンダリングのコード構造

**オリジナル CSR ページモジュール：**

```html
<template page>
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <p>私はページです</p>
  <script>
    export default async ({ load, query }) => {
      return {
        data: {},
        attached() {},
      };
    };
  </script>
</template>
```

**同型レンダリングをカプセル化した完全なページ：**

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ページタイトル</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- ページモジュールの内容が挿入される位置 ⬇️ -->
    <template page>
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <p>私はページです</p>
      <script>
        export default async ({ load, query }) => {
          return {
            data: {},
            attached() {},
          };
        };
      </script>
    </template>
  </o-app>
</body>

</html>
```

したがって、任意の 开发言語（Go、Java、PHP、Nodejs、Python など）、任意の後端テンプレートレンダリングエンジン（Go の `html/template`、PHP の Smarty/Twig/Blade など）を使用して、ofa.js のアイソモーフィックレンダリングコード構造をテンプレートに埋め込むことで、SSR を実現できます。

* [Nodejs SSR ケース](https://github.com/kirakiray/ofa.js/tree/main/test/ssr-case/node)
* [PHP SSR ケース](https://github.com/kirakiray/ofa.js/tree/main/test/ssr-case/php)
* [Go SSR ケース](https://github.com/kirakiray/ofa.js/tree/main/test/ssr-case/go)

### 同型レンダリングテンプレート構造

同型レンダリングモードを実現するには、サーバー側で以下の汎用テンプレート構造を使用するだけです：

```html
<!doctype html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ページタイトル</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>

<body>
  <o-app src="/app-config.js">
    <!-- 動的に対応するページモジュールのコンテンツを挿入 -->
  </o-app>
</body>

</html>
```

**注意：** サーバー側から返されるHTMLには、正しいHTTPヘッダーを設定する必要があります：`Content-Type: text/html; charset=UTF-8`

`scsr.mjs` は ofa.js が提供する同型レンダリング実行エンジンであり、現在のページの実行状態に基づいて自動的にレンダリング戦略を判断し、あらゆる環境で最適なユーザーエクスペリエンスを提供します。

同様に、SSGもこの構造を適用して静的サイト生成を実現できます。

## ofa.js とSSRおよびその他のフロントエンドフレームワークとの違い

ofa.js の Symphony Client-Server Rendering（以下 SCSR）は本質的には SSR モードです。

Vue、React、Angular などの既存フロントエンドフレームワークの SSR ソリューションと比べて、ofa.js の最大の利点は**Node.js を強制的にバインドする必要がない**ことです。これは、任意のバックエンドテンプレートレンダリングエンジン（PHP の Smarty、Python の Jinja2、Java の Thymeleaf など）が ofa.js を簡単に統合して SSR を実現できることを意味します。

## ウェブページレンダリング方式の概要

現代のウェブアプリケーションには主に4つのレンダリング方式があります：従来のサーバーサイドテンプレートエンジンレンダリング、CSR（Client Side Rendering、クライアントサイドレンダリング）、SSR（Server Side Rendering、サーバーサイドレンダリング）、そしてSSG（Static Site Generation、静的サイト生成）です。それぞれの方式には独自の利点と適用シーンがあります。

### 伝統的なサーバーサイドテンプレートエンジンレンダリング

多くのWeb製品において、サーバーサイドテンプレートエンジンは依然として最も主流なページレンダリング手法です。Go、PHPなどのバックエンド言語は、組み込みまたはサードパーティのテンプレートエンジン（Goの`html/template`、PHPのSmarty/Twig/Bladeなど）を活用し、動的データをHTMLテンプレートに注入し、一括で完全なHTMLページを生成してクライアントに返します。

**利点：**- SEOに優しく、初回表示が速い
- サーバーサイド制御で、セキュリティが比較的高い
- チームの技術スタックに対する要求が低く、バックエンド開発者だけで独立して開発を完了できる

**デメリット：**- ユーザーエクスペリエンスが悪く、インタラクションのたびにページが再読み込みされる
- サーバー側の負荷が大きい
- フロントエンドとバックエンドの結合度が高く、業務分担に不利

### CSR（クライアントサイドレンダリング）

CSRモードでは、ページの内容は完全にブラウザ側のJavaScriptによってレンダリングされ、ofa.jsの[シングルページアプリケーション](./routes.md)は典型的なCSRの実装です。この方法は、ページ遷移なしですべてのインタラクションを完了できる、スムーズなユーザー体験を提供します。ReactやVueをそれぞれのルーティングライブラリ（React RouterやVue Routerなど）と組み合わせて開発されたシングルページアプリケーション（SPA）は、すべて典型的なCSRの実装です。

**利点：**- ユーザーエクスペリエンスが滑らかで、ページの切り替えがリフレッシュなし
- クライアントの処理能力が高く、応答が迅速

**デメリット：**- SEOに不利で、検索エンジンがコンテンツをインデックス化しにくい

### SSR（サーバーサイドレンダリング）

CSRの滑らかな体験を保ちながら、サーバーがリアルタイムでページをレンダリングする：ユーザーがリクエストを発行すると、サーバーが即座に完全なHTMLを生成して返し、真のサーバーサイドレンダリングを実現する。

**利点：**- SEO に優れ、ファーストビューの読み込みが高速
- 動的コンテンツに対応

**デメリット：**- サーバーへの負荷が高い
- 通常、Node.js環境をランタイムとして必要とするか、最低でもNode.jsのミドルウェア層が必要
- それでも完全なインタラクションを実現するには、後続のクライアント側での活性化が必要

### SSG（静的サイト生成）

ビルド段階ですべてのページを事前に静的HTMLファイルとしてレンダリングし、デプロイ後はサーバーから直接ユーザーに返すことができます。

**利点：**- 初回読み込みが高速で、SEOに優しい
- サーバー負荷が低く、パフォーマンスが安定している
- セキュリティが高い

**デメリット：**- 動的なコンテンツの更新が困難
- ページ数が増えるにつれてビルド時間が長くなる