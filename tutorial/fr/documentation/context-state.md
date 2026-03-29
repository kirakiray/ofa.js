# État du contexte

L'état de contexte est le mécanisme dans ofa.js permettant le partage de données entre composants. Grâce au modèle fournisseur (Provider) et consommateur (Consumer), il est possible de transmettre des données entre composants parent-enfant ou à travers plusieurs niveaux, sans avoir à les faire passer par les props étage par étage.

## Concepts clés

- **o-provider** : fournisseur de données, définit les données à partager
- **o-consumer** : consommateur de données, récupère les données du fournisseur le plus proche
- **watch:xxx** : surveille les changements de données du consommateur et les lie aux propriétés du composant ou du module de page

## o-provider Fournisseur

Le composant `o-provider` sert à définir un fournisseur de données partagées. Il s’identifie par l’attribut `name` et définit les données à partager via des attributs (comme `custom-a="value"`).

```html
<o-provider name="userInfo" custom-name="张三" custom-age="25">
  ...
</o-provider>
```

### Attributs

- `name` : le nom d'identification unique du fournisseur, utilisé par les consommateurs pour rechercher le fournisseur correspondant

### Caractéristiques

1. **Transmission automatique des attributs** : tous les attributs non réservés du provider sont transmis comme données partagées
2. **Mise à jour réactive** : lorsque les données du provider changent, le consumer correspondant au même name se met à jour automatiquement
3. **Recherche hiérarchique** : le consumer commence la recherche des données correspondant au name depuis le provider le plus proche dans la hiérarchie

## o-consumer Consommateur

Le composant `o-consumer` est utilisé pour consommer (utiliser) les données d'un fournisseur. Il spécifie le nom du fournisseur à consommer via l'attribut `name`.

```html
<o-consumer name="userInfo"></o-consumer>
```

### Attributs

- `name`: Nom du fournisseur à consommer

### Caractéristiques

1. **Acquisition automatique des données** : le consommateur récupère automatiquement les données correspondantes au nom le plus récemment fournies par le fournisseur parent le plus proche  
2. **Fusion des propriétés** : si plusieurs fournisseurs portant le même nom possèdent une certaine propriété, la propriété du fournisseur le plus proche du consommateur est prioritaire  
3. **Écoute des propriétés** : il est possible d’écouter les changements d’une propriété spécifique via `watch:xxx`

## Écouter les changements de données

En utilisant `watch:xxx`, vous pouvez écouter les changements des données du fournisseur :

```html
<o-consumer name="userInfo" watch:custom-age="age"></o-consumer>

<script>
export default {
  data:{
    age: 0,
  },
};
</script>
```

## Exemple de base

<o-playground name="Exemple de base" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" user-id="9527">
        <o-page src="page1.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page1.html" active>
    <template page>
      <l-m src="./user-avatar.html"></l-m>
      <l-m src="./user-name.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #007acc;
          padding: 10px;
        }
      </style>
      <user-avatar></user-avatar>
      <div>ID utilisateur: {{userId}}</div>
      <user-name></user-name>
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default {
          data:{
            userId: 0,
          },
        };
      </script>
    </template>
  </code>
  <code path="user-avatar.html">
    <template component>
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(68, 107, 133, 1);
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
      </style>
      Avatar de {{userId}}
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-avatar",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
  <code path="user-name.html">
    <template component>
      <style>
        :host {
          display: block;
          color: rgba(204, 153, 0, 1);
        }
      </style>
      Utilisateur-{{userId}}
      <o-consumer name="userInfo" watch:user-id="userId"></o-consumer>
      <script>
        export default async ()=>{
            return {
                tag:"user-name",
                data:{
                    userId: null,
                }
            };
        }
      </script>
    </template>
  </code>
</o-playground>

## o-root-provider Fournisseur racine

`o-root-provider` est un fournisseur global au niveau racine, dont la portée s'étend à l'ensemble du document. Même en l'absence de fournisseur parent, le consommateur peut toujours accéder aux données du fournisseur racine.

```html
<!-- Définir le fournisseur racine global -->
<o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>

<!-- Peut être consommé n'importe où dans la page -->
<o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
```

### Caractéristiques

1. **Portée globale** : Les données du fournisseur racine sont disponibles sur toute la page
2. **Priorité** : Lorsqu'un provider et un root-provider de même nom existent simultanément, le provider le plus proche du consommateur est prioritaire
3. **Supprimable** : Après suppression du root-provider, le consommateur revient à la recherche d'autres providers

## Exemple de root-provider

<o-playground name="root-provider exemple" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="globalConfig" custom-theme="dark" custom-language="zh-CN"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./header.html"></l-m>
      <l-m src="./content.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .info {
          padding: 10px;
          border: 1px solid #007acc;
        }
      </style>
      <div class="info">
        <div>Thème : {{theme}}</div>
        <div>Langue : {{language}}</div>
      </div>
      <header-com></header-com>
      <content-com></content-com>
      <o-consumer name="globalConfig" watch:custom-theme="theme" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          data: {
            theme: "",
            language: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="header.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: #333;
          color: white;
        }
      </style>
      Header - Thème : {{theme}}
      <o-consumer name="globalConfig" watch:custom-theme="theme"></o-consumer>
      <script>
        export default {
          tag:"header-com",
          data: {
            theme: "",
          },
        };
      </script>
    </template>
  </code>
  <code path="content.html">
    <template component>
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: rgba(137, 133, 133, 1);
        }
      </style>
      Content - Langue : {{language}}
      <o-consumer name="globalConfig" watch:custom-language="language"></o-consumer>
      <script>
        export default {
          tag:"content-com",
          data: {
            language: "",
          },
        };
      </script>
    </template>
  </code>
</o-playground>

### Exemple de priorité

```html
<o-root-provider name="test" custom-value="root"></o-root-provider>

<o-provider name="test" custom-value="parent">
 ...
 <!-- 这里👇获取到的custom-value是 "parent" -->
 <o-consumer name="test"></o-consumer>
 ...
</o-provider>

<!-- 这里👇获取到的custom-value是 "root" -->
<o-consumer name="test"></o-consumer>

```

### Démonstration d'exemple de priorité

<o-playground name="Démo d'exemple de priorité" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-root-provider name="test" custom-value="root"></o-root-provider>
      <o-page src="page.html"></o-page>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./child.html"></l-m>
      <o-provider name="test" custom-value="parent">
        <div style="padding: 10px; border: 1px solid #007acc;">
          <p>Valeur dans le Provider parent : {{parentValue}}</p>
          <child-com></child-com>
        </div>
        <o-consumer name="test" watch:custom-value="parentValue"></o-consumer>
      </o-provider>
      <div style="padding: 10px; border: 1px solid #cc6600; margin-top: 10px;">
        <p>Valeur du Provider racine : {{rootValue}}</p>
      </div>
      <child-com></child-com>
      <o-consumer name="test" watch:custom-value="rootValue"></o-consumer>
      <script>
        export default () => ({
          data: {
            parentValue: "",
            rootValue: "",
          },
        });
      </script>
    </template>
  </code>
  <code path="child.html">
    <template component>
      <div style="padding: 10px;  border: 1px dashed gray;">
        Valeur dans le composant enfant : {{customValue}} (le plus proche est le provider {{customValue}})
      </div>
      <o-consumer name="test" watch:custom-value="customValue"></o-consumer>
      <script>
        export default () => ({
          tag:"child-com",
          data: {
            customValue: "",
          },
        });
      </script>
    </template>
  </code>
</o-playground>

## Méthode getProvider(name)

`getProvider(name)` est une méthode d'instance utilisée pour obtenir l'élément fournisseur correspondant au nom. Elle recherche le fournisseur parent le plus proche en remontant le DOM, et retourne le fournisseur racine si aucun n'est trouvé.

### Utiliser la méthode getProvider(name) dans un composant ou un module de page

```html
<script>
...
proto:{
  changeValue(){
    const provider = this.getProvider("name");
    provider.customValue = "nouvelle valeur";
  }
}
...
</script>
```

## Exemple de getProvider

<o-playground name="Exemple getProvider" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="userInfo" custom-name="张三" custom-age="25">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <button on:click="getProviderData">Obtenir les données du Provider</button>
      <div>Nom actuel : {{currentName}}</div>
      <div>Âge actuel : {{currentAge}}</div>
      <div style="margin-top: 10px;">
        <button on:click="updateProvider">Modifier les données du Provider</button>
      </div>
      <o-consumer name="userInfo" watch:custom-name="currentName" watch:custom-age="currentAge"></o-consumer>
      <script>
        export default {
          data: {
            currentName: "",
            currentAge: 0,
          },
          proto: {
            getProviderData() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                console.log("Provider trouvé :", provider);
                console.log("Nom :", provider.customName);
                console.log("Âge :", provider.customAge);
                alert(`Données du Provider : ${provider.customName}, ${provider.customAge} ans`);
              }
            },
            updateProvider() {
              const provider = this.getProvider("userInfo");
              if (provider) {
                provider.customName = "李四";
                provider.customAge = 30;
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

### Obtenir le fournisseur à partir de l'élément

```javascript
// Obtenir le provider parent de l'élément courant
const provider = $(".my-element").getProvider("userInfo");

if (provider) {
  console.log("Provider trouvé :", provider.customName);
}

// Obtenir directement le root-provider global
const globalProvider = $.getRootProvider("globalConfig");
```

### Cas d'utilisation

1. **Récupération manuelle des données** : Utilisé dans les scénarios nécessitant un accès direct aux données du fournisseur
2. **Traversée du Shadow DOM** : Recherche du fournisseur parent à l'intérieur du Shadow DOM
3. **Gestion des événements** : Obtention du fournisseur correspondant dans les rappels d'événements

## dispatch Distribution d'événements

Le provider peut distribuer des événements à tous les consumers qui le consomment :

```html
<o-provider name="test" id="myProvider" custom-value="Bonjour">
  <o-consumer name="test" on:custom-event="handleEvent">
    <div>{{customValue}}</div>
  </o-consumer>
</o-provider>

<script>
// Émettre l'événement
$("#myProvider").dispatch("custom-event", {
  data: { message: "Bonjour le Monde" }
});
</script>
```

## Exemple de dispatch d'événement

<o-playground name="Exemple de dispatch d'événements" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-provider name="chat" custom-messages='["Bienvenue dans le salon de discussion"]' id="chatProvider">
        <o-page src="page.html"></o-page>
      </o-provider>
    </template>
  </code>
  <code path="page.html" active>
    <template page>
      <l-m src="./chat-list.html"></l-m>
      <l-m src="./chat-input.html"></l-m>
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px;
        }
      </style>
      <h3>Salon de discussion</h3>
      <chat-list></chat-list>
      <chat-input></chat-input>
    </template>
  </code>
  <code path="chat-list.html">
    <template component>
      <style>
        :host {
          display: block;
          border: 1px solid #007acc;
          padding: 10px;
          max-height: 200px;
          overflow-y: auto;
        }
        .message {
          padding: 5px;
          margin: 5px 0;
          background: gray;
          border-radius: 4px;
        }
      </style>
      <div class="messages">
        <o-fill :value="messages">
          <div class="message">{{$data}}</div>
        </o-fill>
      </div>
      <o-consumer name="chat" on:new-message="addMessage"></o-consumer>
      <script>
        export default {
          tag:"chat-list",
          data: {
            messages: [],
          },
          proto: {
            addMessage(event) {
              this.messages.push(event.data.text);
            },
          },
        };
      </script>
    </template>
  </code>
  <code path="chat-input.html">
    <template component>
      <style>
        :host {
          display: flex;
          gap: 10px;
        }
        input {
          flex: 1;
          padding: 8px;
        }
        button {
          padding: 8px 16px;
          background: #007acc;
          color: white;
          border: none;
          cursor: pointer;
        }
      </style>
      <input type="text" sync:value="inputText" placeholder="Saisir un message...">
      <button on:click="sendMessage">Envoyer</button>
      <script>
        export default {
          tag:"chat-input",
          data: {
            inputText: "",
          },
          proto: {
            sendMessage() {
              const provider = this.getProvider("chat");
              if (provider && this.inputText.trim()) {
                provider.dispatch("new-message", {
                  data: { text: this.inputText }
                });
                this.inputText = "";
              }
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

## Bonnes pratiques

1. **Nommage raisonnable** : utilisez des noms explicites pour le provider et le consumer afin de faciliter le suivi et la maintenance  
2. **Évitez l’usage excessif** : l’état de contexte est adapté au partage de données entre composants ; pour les composants parent-enfant simples, privilégiez les props  
3. **Fournisseur racine pour la configuration globale** : les thèmes, langues et états globaux conviennent à un root-provider  
4. **Nettoyage automatique** : lorsqu’un provider est supprimé, le consumer efface automatiquement les données ; aucune action manuelle n’est requise