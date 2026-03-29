# Production et déploiement

Les projets développés avec ofa.js peuvent être déployés directement sur un serveur statique pour être utilisés.

## Environnement de développement

Vous pouvez utiliser le [ofa Studio](https://core.noneos.com/?redirect=studio) officiel pour le développement, il offre une création et un aperçu de projet en un clic.

Vous pouvez également créer votre propre serveur statique :

* Utiliser un serveur statique comme Nginx ou Apache
* Utiliser le module [http-server](https://www.npmjs.com/package/http-server) de Node.js
* Utiliser directement le plugin de serveur statique de l'éditeur pour prévisualiser

## Environnement de production

### Exporter le projet

Si vous utilisez un projet construit avec [ofa Studio](https://core.noneos.com/?redirect=studio), utilisez directement la fonction d'exportation intégrée de l'outil.

Si le projet est construit manuellement, vous pouvez simplement déployer le dossier du projet sur un serveur statique, en conservant le même mode que l’environnement de développement.

### Compression et Obfuscation

Les environnements de production nécessitent généralement l'utilisation d'outils de minification et d'obfuscation pour réduire la taille des fichiers et améliorer la vitesse de chargement. Vous pouvez utiliser [Terser CLI](https://terser.org/docs/cli-usage/) pour la minification et l'obfuscation.

Si vous ne souhaitez pas utiliser l’outil en ligne de commande, vous pouvez utiliser [ofa build](https://builder.ofajs.com/) pour compresser et obfusquer vos fichiers en ligne. Cet outil est actuellement en version bêta et sera intégré ultérieurement dans ofa Studio.

