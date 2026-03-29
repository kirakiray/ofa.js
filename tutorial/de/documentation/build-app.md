# Produktion und Bereitstellung

Projekte, die mit ofa.js entwickelt wurden, können direkt auf einem statischen Server bereitgestellt und verwendet werden.

## Entwicklungsumgebung

Sie können das offizielle [ofa Studio](https://core.noneos.com/?redirect=studio) für die Entwicklung verwenden, das eine One-Click-Projekterstellung und Vorschau bietet.

Sie können auch einen eigenen statischen Server einrichten:

* Verwenden Sie statische Server-Software wie Nginx oder Apache
* Verwenden Sie das [http-server](https://www.npmjs.com/package/http-server)-Modul von Node.js
* Verwenden Sie direkt das statische Server-Plugin des Editors zur Vorschau

## Produktionsumgebung

### Projekt exportieren

Wenn du ein Projekt mit [ofa Studio](https://core.noneos.com/?redirect=studio) erstellt hast, verwende einfach die integrierte Exportfunktion des Tools.

Wenn es sich um ein manuell erstelltes Projekt handelt, können Sie den Projektordner direkt auf einem statischen Server bereitstellen, wobei das gleiche Muster wie in der Entwicklungsumgebung beibehalten wird.

### Komprimierung und Obfuskation

In der Produktionsumgebung werden normalerweise Komprimierungs- und Obfuskierungswerkzeuge verwendet, um die Dateigröße zu verringern und die Ladegeschwindigkeit zu erhöhen. Sie können [Terser CLI](https://terser.org/docs/cli-usage/) für die Komprimierung und Obfuskierung verwenden.

Falls Sie keine Kommandozeilentools verwenden möchten, können Sie [ofa build](https://builder.ofajs.com/) online nutzen, um Dateien zu komprimieren und zu verschleiern. Dieses Tool befindet sich derzeit in der Testversion und wird später in ofa Studio integriert.

