# liaison de propriété

ofa.js prend en charge la liaison de données aux propriétés des objets d'instances d'éléments après leur instanciation, telles que les propriétés value ou checked des éléments input.

## Liaison unidirectionnelle des attributs

La liaison unidirectionnelle d'attributs utilise la syntaxe `:toKey="fromKey"` pour synchroniser "unidirectionnellement" les données du composant vers les attributs des éléments DOM. Lorsque les données du composant changent, les attributs de l'élément sont mis à jour instantanément ; cependant, les modifications propres à l'élément (comme la saisie de l'utilisateur) ne sont pas réécrites en sens inverse dans le composant, maintenant ainsi un flux de données unique et contrôlable.

<o-playground name="Liaison unidirectionnelle des propriétés" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>Valeur actuelle : {{val}}</p>
      <input type="text" :value="val" placeholder="Ceci est un champ de saisie à liaison unidirectionnelle">
      <p>Remarque : modifier directement le contenu du champ ne change pas la valeur affichée ci-dessus</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Liaison de propriété bidirectionnelle

La liaison d'attributs bidirectionnelle utilise la syntaxe `sync:xxx`, permettant la synchronisation bidirectionnelle entre les données du composant et les éléments DOM. Lorsque les données du composant changent, l'attribut de l'élément DOM se met à jour ; lorsque l'attribut de l'élément DOM change (par exemple via une saisie utilisateur), les données du composant sont également synchronisées.

<o-playground name="Liaison bidirectionnelle des propriétés" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
        }
        input {
          margin: 5px 0;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <p>Valeur actuelle : {{val}}</p>
      <input type="text" sync:value="val" placeholder="Ceci est une zone de saisie à liaison bidirectionnelle">
      <p>Astuce : Modifier le contenu dans la zone de saisie mettra à jour la valeur affichée ci-dessus en temps réel.</p>
      <script>
        export default async () => {
          return {
            data: { val: "Hello ofa.js Demo Code" }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Caractéristiques de la liaison bidirectionnelle

- Flux de données : composant ↔ élément DOM (bidirectionnel)
- Changement des données du composant → mise à jour de l’élément DOM
- Changement de l’élément DOM → mise à jour des données du composant
- Adapté aux scénarios nécessitant une saisie utilisateur et une synchronisation des données

### Scénarios courants de liaison bidirectionnelle

<o-playground name="Exemple de liaison bidirectionnelle de formulaire" style="--editor-height: 700px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          padding: 15px;
          font-family: Arial, sans-serif;
        }
        .form-group {
          margin: 10px 0;
        }
        input, textarea, select {
          padding: 8px;
          margin: 5px 0;
          box-sizing: border-box;
        }
        .preview {
          margin-top: 15px;
          padding: 10px;
          background-color: #7b7b7bff;
          border-radius: 4px;
        }
      </style>
      <h3>Exemple de liaison bidirectionnelle de formulaire</h3>
      <div class="form-group">
        <label>Champ de texte :</label>
        <input type="text" sync:value="textInput" placeholder="Entrez du texte">
      </div>
      <div class="form-group">
        <label>Champ numérique :</label>
        <input type="number" sync:value="numberInput" placeholder="Entrez un nombre">
      </div>
      <div class="form-group">
        <label>Zone de texte multiligne :</label>
        <textarea sync:value="textareaInput" rows="3" placeholder="Entrez du texte multiligne"></textarea>
      </div>
      <div class="form-group">
        <label>Liste déroulante :</label>
        <select sync:value="selectedOption">
          <option value="">Veuillez choisir...</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <div class="form-group">
        <label>Case à cocher :</label>
        <label style="display:flex;">
          <input type="checkbox" sync:checked="isChecked" /> J'accepte les conditions
        </label>
      </div>
      <div class="preview">
        <h4>Aperçu en temps réel :</h4>
        <p>Texte : {{textInput}}</p>
        <p>Nombre : {{numberInput}}</p>
        <p>Texte multiligne : {{textareaInput}}</p>
        <p>Sélection : {{selectedOption}}</p>
        <p>État de la case : {{isChecked ? 'Cochée' : 'Non cochée'}}</p>
      </div>
      <script>
        export default async () => {
          return {
            data: { textInput: '', numberInput: 0, textareaInput: '', selectedOption: '', isChecked: false }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Remarques

1. **Considérations de performance** : la liaison bidirectionnelle crée des écouteurs de données ; une utilisation massive peut impacter les performances  
2. **Cohérence des données** : la liaison bidirectionnelle garantit la cohérence entre données et vue, mais il faut éviter les mises à jour en boucle infinie  
3. **Valeurs initiales** : assurez-vous que les données liées possèdent des valeurs initiales appropriées pour éviter l’affichage d’undefined  
4. **Conflits d’événements** : évitez d’utiliser simultanément la liaison bidirectionnelle et la gestion manuelle d’événements sur un même élément afin de prévenir les conflits