# Einführung

## Was ist ofa.js?

ofa.js ist ein benutzerfreundliches Web-Frontend-Framework, das speziell für den Aufbau von Webanwendungen entwickelt wurde und darauf abzielt, die Entwicklungseffizienz zu steigern und die Einstiegshürden zu senken.

> Wenn Sie mit HTML, CSS und JavaScript **bereits grundlegend vertraut** sind, ist ofa.js eine sehr gute Wahl.

## Warum ich ofa.js entwickle

Der ursprüngliche Entwurfsgedanke von ofa.js ist einfach: **Engineering**-Probleme der Webentwicklung zu lösen, ohne auf Kompilierungswerkzeuge angewiesen zu sein.

> Engineering bezieht sich auf die systematische Integration von Standards, Prozessen, Tools und Methoden im Softwareentwicklungsprozess, um die Entwicklungseffizienz, Codequalität und Wartbarkeit zu verbessern.

In den letzten zehn Jahren hat die Web-Frontend-Entwicklung einen Evolutionsprozess vom anfänglichen unkontrollierten Wachstum zur schrittweisen Industrialisierung durchlaufen. Dieser Prozess hat die Erfahrungen aus der traditionellen Anwendungsentwicklung übernommen und durch die Einführung von Node.js und Build-Prozessen die Industrialisierungsherausforderungen großer Projekte gelöst.

Wenn das Projekt jedoch größer wird, treten die Nachteile dieses Modells allmählich zutage, und es entsteht das Problem der **Monolithischen Anwendung**, das in der traditionellen Entwicklung auftritt, was dazu führt, dass das Projekt schwer zu warten ist und die Iteration von Interaktionsanforderungen schwierig wird.

> Monolithische Anwendungen (Monolithic Applications) beziehen sich auf riesige, eng gekoppelte Einzelanwendungen, bei denen alle Funktionsmodule in einem einzigen Code-Repository konzentriert sind. Jede Änderung kann das gesamte System beeinflussen, was unabhängige Entwicklung und Bereitstellung erschwert.

Zu diesem Zeitpunkt ist es notwendig, das Projekt zu zerlegen und eine Micro-Frontend-Architektur zu implementieren, ähnlich wie bei **Microservices**. Aufgrund von Kompilierungsprozessen wird die Umsetzung von Micro-Frontends jedoch schwierig und aufwändig. Die unabhängige Bereitstellung von Frontend-Modulen erfordert die Kompilierung jedes kleinen Moduls, was sehr schwierig ist und dazu führt, dass die Entwicklung der Web-Frontend-Technologie fast zum Stillstand kommt.

> Microservices (Microservices) ist ein Softwarearchitekturstil, der große, komplexe Anwendungen in mehrere feinkörnige, unabhängig bereitgestellte und ausgeführte kleine Dienste aufteilt.

Zu diesem Zeitpunkt begann ich zu überlegen: Traditionelle Programmiersprachen müssen mit unterschiedlicher Hardware und Betriebssystemen umgehen, daher müssen sie durch Kompilierung plattformübergreifend standardisiert werden. Aber die Web-Entwicklung ist anders, sie basiert auf Browsern, benötigt ursprünglich keine Kompilierung, kann unabhängig ausgeführt und bereitgestellt werden und ist von Natur aus ein Micro-Frontend-Modus. Daher wurde mir klar, dass es der Kompilierungsprozess ist, der die Dinge kompliziert macht.

Das heißt, solange die Engineering-Probleme gelöst und der notwendige Schritt des Kompilierens entfernt wird, eignet sich die Frontend-Entwicklung sehr gut für die Entwicklung großer Anwendungen. Das ist das natürliche Micro-Frontend-Muster. So wurde ofa.js geboren.

## Kernvorteile

### Sofort einsatzbereit, ohne Einstiegshürden

Keine Entwicklungsumgebung, Abhängigkeiten oder Konfiguration von Gerüsten erforderlich. Öffnen Sie einfach das offizielle Build-Programm im Browser, wählen Sie ein lokales Verzeichnis und beginnen Sie mit der Entwicklung. Alle Berechnungen, Daten- und Speicheroperationen werden lokal ausgeführt, ohne Abhängigkeit von Cloud-Diensten.

### KI-freundlich, leicht zu überprüfen

Keine Blackbox-Kompilierung, von KI erzeugter Code kann schnell bereitgestellt und selbst überprüft werden; Reduzierung der Zwischenschichten, kein Kompilierungsprozess, macht es einfacher, Probleme im Code zu lokalisieren und zu beheben.

### Native Unterstützung für Micro-Frontends

ofa.js ermöglicht es der Web-Frontend-Entwicklung, ähnlich wie bei Microservices, in mehrere unabhängige Module unterteilt zu werden, wobei jedes Modul unabhängig entwickelt und unabhängig bereitgestellt werden kann. Wenn die Grenzen des traditionellen Web-Frontends durchbrochen werden, wird die Frontend-Technologie schrittweise die Einschränkungen der Server-Technologie überwinden.

## Erste Schritte

- Wenn Sie über grundlegende Entwicklungskenntnisse verfügen, können Sie mit [Skripte einbinden](./script-reference.md) beginnen.
- Wenn Sie ein Anfänger sind, wird empfohlen, mit [Erstellen der ersten App](./create-first-app.md) zu beginnen.