# Nicht-explizite Komponenten

ofa.js enthält standardmäßig zwei implizite Komponenten:

* Bedingte Render-Komponenten: `x-if`, `x-else-if`, `x-else`
* Füll-Komponente: `x-fill`

Die Funktionen dieser beiden Komponenten entsprechen jeweils den `o-if`- und `o-fill`-Komponenten, jedoch werden sie selbst nicht wirklich in das DOM gerendert, sondern ihre internen Elemente werden direkt in den entsprechenden Bereich gerendert.

Beispiel:

```html
<style>
    .container > .item{
        color:red;
    }
</style>
<div class="container">
    <o-if :value="true">
        <!-- Der Stil ist nicht rot, weil die o-if-Komponente selbst im DOM existiert -->
        <div class="item">1</div>
    </o-if>
    <x-if :value="true">
        <!-- Der Stil ist rot, weil die x-if-Komponente nicht ins DOM gerendert wird -->
        <div class="item">2</div>
    </x-if>
</div>
```

<o-playground name="Nicht-explizite Komponente" style="--editor-height: 500px">
  <code>
    <template page>
        <style>
        :host {
            display: block;
            border: 1px solid red;
            padding: 10px;
        }
        .container > .item {
            /* Wählt direkte .item-Elemente der ersten Ebene aus und färbt sie rot */
            color:red;
        }
        /* Muss .item-Elemente innerhalb der o-if-Komponente auswählen */
        /* .container > o-if > .item {
            color:green;
        } */
        </style>
        <div class="container">
            <o-if :value="true">
                <!-- Der Stil ist nicht rot, weil die o-if-Komponente selbst im DOM existiert -->
                <div class="item">Wird nicht rot dargestellt</div>
            </o-if>
            <x-if :value="true">
                <!-- Der Stil ist rot, weil die x-if-Komponente nicht ins DOM gerendert wird -->
                <div class="item">Wird rot dargestellt</div>
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

## x-if Bedingtes-Rendering-Komponente

`x-if` funktioniert genauso wie [o-if](./conditional-rendering.md) und wird verwendet, um basierend auf dem Wahrheitswert eines Bedingungsausdrucks zu entscheiden, ob Inhalte gerendert werden sollen. Der Unterschied besteht darin, dass sich `x-if` selbst nicht als DOM-Element verhält und seine internen Inhalte direkt in den übergeordneten Container gerendert werden.

```html
<div class="container">
    <x-if :value="isLoggedIn">
        <p>Willkommen zurück, Benutzer!</p>
    </x-if>
</div>
```

`x-if` kann auch zusammen mit `x-else-if` und `x-else` verwendet werden:

```html
<div class="container">
    <x-if :value="role === 'admin'">
        <p>Administrator-Panel</p>
    </x-if>
    <x-else-if :value="role === 'user'">
        <p>Benutzerzentrum</p>
    </x-else-if>
    <x-else>
        <p>Bitte einloggen</p>
    </x-else>
</div>
```

## x-fill Füllkomponente

`x-fill` hat genau die gleiche Funktion wie [o-fill](./list-rendering.md) und wird verwendet, um Array-Daten als mehrere DOM-Elemente zu rendern. Ähnlich wie `x-if` rendert sich `x-fill` nicht selbst in das DOM, sondern dessen internes Template wird direkt im übergeordneten Container gerendert.

```html
<ul>
    <x-fill :value="items">
        <li>{{$data.name}}</li>
    </x-fill>
</ul>
```

Beispiel für die Verwendung von benannten Templates:

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

## Leistungsbeschreibung

Neben den funktionalen Unterschieden ist die Rendering-Leistung von nicht expliziten Komponenten im Vergleich zu expliziten Komponenten (`o-if`, `o-fill`) **viel schlechter**. Dies liegt daran, dass nicht explizite Komponenten nicht tatsächlich in das DOM gerendert werden und zusätzliche Logik zur Simulation des Renderings benötigen, um die Positionierung und Aktualisierung interner Elemente zu verarbeiten.

Darüber hinaus können implizite Komponenten einige schwer erkennbare Bugs verursachen: Da sie nicht wirklich in das DOM eintreten, können Operationen, die von der DOM-Struktur abhängen (wie Event-Bindungen, Stilberechnungen oder Abfragen durch Drittanbieter-Bibliotheken), fehlschlagen oder sich unerwartet verhalten.

Daher wird empfohlen, **explizite Komponenten** (`o-if`, `o-else-if`, `o-else`, `o-fill`) **vorrangig zu verwenden** und nicht-explizite Komponenten nur in bestimmten Szenarien einzusetzen.

## Anwendungsfälle

Obwohl nicht explizite Komponenten eine schlechtere Leistung aufweisen, können sie in den folgenden Szenarien nützlich sein:

1. **Vermeiden zusätzlicher DOM-Ebenen**: Wenn Sie nicht möchten, dass `o-if` oder `o-fill` Elemente Teil der DOM-Struktur werden

2. **Stilvererbung**: Wenn Sie möchten, dass innere Elemente direkt die Stile des übergeordneten Containers erben, ohne von dazwischenliegenden Komponentenelementen beeinflusst zu werden

3. **CSS-Selektor-Einschränkungen**: Wenn Sie übergeordnete Kind-Selektoren (wie `.container > .item`) verwenden müssen, um Stile präzise zu kontrollieren, aber keine zusätzlichen Wrapper-Elemente dazwischen wünschen