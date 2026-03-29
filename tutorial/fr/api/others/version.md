# version



Grâce à la propriété `ofa.version`, vous pouvez obtenir le numéro de version de ofa.js actuellement importé.

> **Exigence : version d’ofa.js ≥ 4.3.40**

<o-playground name="version - obtenir la version">
  <code path="demo.html">
    <template>
      <div id="logger"></div>
      <script>
        \$("#logger").text = ofa.version;
      </script>
    </template>
  </code>
</o-playground>

Ainsi, vous pouvez afficher sur la page la version actuelle d'ofa.js.