# chat-bubble

Chat bubble component for displaying chat messages with customizable avatar and content.

## Usage

### 1. Import Component

```html
<l-m src="./chat-bubble.html"></l-m>
```

### 2. Basic Usage

```html
<chat-bubble>
  <img src="avatar.png" slot="avatar" alt="username" />
  This is the message content
  <article slot="article">
    <p>Additional article content</p>
  </article>
</chat-bubble>
```

## Slots

| Slot Name | Description |
|-----------|-------------|
| `avatar` | Avatar image, automatically applies circular styling |
| Default slot | Message content |
| `article` | Additional article content |

## Example

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>chat-bubble</title>
    <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs" type="module"></script>
  </head>
  <body>
    <l-m src="./chat-bubble.html"></l-m>
    <div style="text-align: center; padding: 100px">
      <chat-bubble>
        <img src="../../sources/webpack.svg" slot="avatar" alt="webpack" />
        Hello, I am webpack.
        <article slot="article">
          <p>I am descriptive text.</p>
        </article>
      </chat-bubble>
    </div>
  </body>
</html>
```

## Features

- Automatic circular avatar display
- Bubble style with shadow effect
- Support for custom content slots
