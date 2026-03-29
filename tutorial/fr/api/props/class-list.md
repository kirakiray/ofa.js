# classList



La propriété `classList` est identique à celle du natif. Vous pouvez utiliser [classList](https://developer.mozilla.org/fr/docs/Web/API/Element/classList) pour ajouter, supprimer et basculer des noms de classe.

Voici un exemple montrant comment utiliser `classList` :

<o-playground name="classList - Exemple d'utilisation" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <style>
        .t-red{
          color: red;
          font-size: 14px;
        }
        .t-blue{
          color: blue;
          font-weight:bold;
          font-size:20px;
        }
      </style>
      <div id="target" class="t-red">texte d'origine</div>
      <script>
        setTimeout(()=> {
          $("#target").classList.remove('t-red');
          setTimeout(()=>{
            $("#target").classList.add('t-blue');
          },1000);
        }, 1000);
      </script>
    </template>
  </code>
</o-playground>

La propriété `classList` vous permet d'ajouter, supprimer et basculer facilement des noms de classe, afin de modifier dynamiquement les styles de l'élément.