# Hinzufügen oder Löschen von Unterelementen

Element-Instanzen haben array-ähnliche Eigenschaften. Das Hinzufügen oder Löschen von Knoten kann einfach mit den üblichen Array-Methoden erfolgen. Bei Verwendung der Methoden `push`, `unshift`, `pop`, `shift` und `splice` führt das System intern automatisch die Initialisierungsoperation der [$-Methode](../instance/dollar.md) aus, sodass direkt konkrete Elementzeichenketten oder Objekte angegeben werden können.

Ebenso können Sie andere Array-Methoden verwenden, z. B. `forEach`, `map`, `some` usw.

**Bitte beachten Sie, dass bei Elementen mit Vorlagensyntax keine Kindelemente hinzugefügt oder entfernt werden sollen.**

## push



Fügen Sie ein untergeordnetes Element vom Ende hinzu.

<o-playground name="array-like - push" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Ich bin 1</li>
        <li>Ich bin 2</li>
        <li>Ich bin 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").push(`<li style="color:red;">neues li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## unshift



Fügen Sie ein untergeordnetes Element am Anfang des Arrays ein.

<o-playground name="array-like - unshift" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Ich bin 1</li>
        <li>Ich bin 2</li>
        <li>Ich bin 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").unshift(`<li style="color:blue;">neues li</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## pop



Entfernen Sie Unterelemente vom Ende.

<o-playground name="array-like - pop" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Ich bin 1</li>
        <li>Ich bin 2</li>
        <li>Ich bin 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").pop();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## shift



Ein Unterelement am Anfang des Arrays löschen.

<o-playground name="array-like - shift" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Ich bin 1</li>
        <li>Ich bin 2</li>
        <li>Ich bin 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").shift();
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

## splice



Sie können vorhandene Kindelemente löschen oder ersetzen und neue Kindelemente hinzufügen. Die Verwendung ähnelt der `splice`-Methode von Arrays.

<o-playground name="array-like - splice" style="--editor-height: 300px">
  <code path="demo.html">
    <template>
      <ul>
        <li>Ich bin 1</li>
        <li>Ich bin 2</li>
        <li>Ich bin 3</li>
      </ul>
      <script>
        setTimeout(()=>{
          \$("ul").splice(1, 2, `<li style="color:green;">neues li 1</li>`, `<li style="color:green;">neues li 2</li>`);
        }, 500);
      </script>
    </template>
  </code>
</o-playground>

