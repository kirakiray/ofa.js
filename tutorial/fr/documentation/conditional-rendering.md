# Rendu conditionnel

Dans ofa.js, le rendu conditionnel est une fonctionnalité importante qui permet de décider, selon l'état des données, s'il faut rendre un élément ou un composant. ofa.js propose un schéma de rendu conditionnel basé sur des composants, implémenté par les composants `o-if`, `o-else-if` et `o-else`.

## Composant o-if

Le composant `o-if` est utilisé pour décider de rendre son contenu en fonction de la valeur de vérité d'une expression. Lorsque la propriété liée `value` est évaluée à vrai, le contenu à l'intérieur du composant est rendu ; sinon, le contenu n'apparaît pas dans le DOM.

<o-playground name="Exemple de fonctionnement d'o-if" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="isHide = !isHide">Basculer l'affichage</button>
      <o-if :value="!isHide">
        <p>{{val}}</p>
      </o-if>
      <script>
        export default async () => {
          return {
            data: {
              isHide: false,
              val: "Hello ofa.js Demo Code",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Fonctionnement de o-if

`o-if` 只会在条件为真时才将内容渲染到 DOM 中，当条件为假时，`o-if` 内的 DOM 元素会被完全移除。这种实现方式适合在条件变化不太频繁的情况下使用，因为它涉及到 DOM 的创建和销毁。

## Composants o-else-if et o-else

Lorsque plusieurs branches conditionnelles sont nécessaires, vous pouvez utiliser les composants `o-else-if` et `o-else` en combinaison avec `o-if` pour réaliser un rendu conditionnel à branches multiples.

- `o-if` : le premier composant conditionnel obligatoire
- `o-else-if` : composant conditionnel intermédiaire optionnel, peut être présent plusieurs fois
- `o-else` : composant conditionnel par défaut optionnel, placé à la fin

<o-playground name="Exemple de rendu conditionnel multi-branches" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <button on:click="num++">Basculer l'affichage - {{num}}</button>
      <!-- Basculer l'affichage de différents contenus en fonction du résultat de num modulo 3 -->
      <o-if :value="num % 3 === 0">
        <p>❤️ 0 / 3</p>
      </o-if>
      <o-else-if :value="num % 3 === 1">
        <p>😊 1 / 3</p>
      </o-else-if>
      <o-else>
        <p>😭 2 / 3</p>
      </o-else>
      <script>
        export default async () => {
          return {
            data: {
              num: 0,
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Exemples de scénarios d'application pratique

### Contrôle des permissions utilisateur

<o-playground name="Exemple de contrôle des permissions utilisateur" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .admin-panel {
          background-color: #813b3bff;
          padding: 10px;
          margin: 10px 0;
        }
        .user-info {
          background-color: #3f6e86ff;
          padding: 10px;
          margin: 10px 0;
        }
      </style>
      <div>
        <button on:click="toggleUserRole">Basculer le rôle utilisateur</button>
        <p>Rôle actuel : {{role}}</p>
        <o-if :value="role === 'admin'">
          <div class="admin-panel">
            <h3>Panneau d'administration</h3>
            <button>Gérer les utilisateurs</button>
            <button>Paramètres système</button>
          </div>
        </o-if>
        <o-else-if :value="role === 'user'">
          <div class="user-info">
            <h3>Informations utilisateur</h3>
            <p>Bienvenue {{userName}} !</p>
          </div>
        </o-else-if>
        <o-else>
          <p>Veuillez vous connecter pour voir le contenu</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              role: 'guest',
              userName: 'Invité'
            },
            proto: {
              toggleUserRole() {
                if (this.role === 'guest') {
                  this.role = 'user';
                  this.userName = 'Zhang San';
                } else if (this.role === 'user') {
                  this.role = 'admin';
                } else {
                  this.role = 'guest';
                  this.userName = '';
                }
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

### Affichage de l'état de validation du formulaire

<o-playground name="Exemple d'affichage de l'état de validation de formulaire" style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        input {
          margin: 5px;
          padding: 5px;
        }
      </style>
      <div>
        <h3>Exemple de validation d'email</h3>
        <input type="email" :value="email" on:input="email = $event.target.value" placeholder="Entrez une adresse email">
        <o-if :value="email && isValidEmail(email)">
          <p style="color:green;">✓ Format d'email correct</p>
        </o-if>
        <o-else-if :value="email && !isValidEmail(email) && email.length > 0">
          <p style="color:red;">✗ Format d'email incorrect</p>
        </o-else-if>
        <o-else>
          <p style="color:orange;">Veuillez entrer une adresse email pour la valider</p>
        </o-else>
      </div>
      <script>
        export default async () => {
          return {
            data: {
              email: ''
            },
            proto: {
              isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
              }
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## Meilleures pratiques pour le rendu conditionnel

1. **Cas d’utilisation** : lorsqu’un élément est rarement basculé entre différents états, `o-if` est plus approprié car il supprime complètement les éléments inutiles, économisant ainsi la mémoire.

2. **Considérations de performance** : pour les éléments fréquemment basculés, il vaut mieux utiliser la liaison de classes (par exemple `class:hide`) plutôt que le rendu conditionnel, car ce dernier implique la création et la destruction du DOM.

3. **Clarté de la structure** : le rendu conditionnel est particulièrement adapté aux basculements entre contenus de structures différentes, comme les onglets ou les guides par étapes.