# Verwendung von AI-Prompts mit ofa.js im Projekt

Da ofa.js noch kein weit verbreitetes und bekanntes Framework ist, verfügen die gängigen KI-Modelle noch nicht über die Fähigkeit, ofa.js direkt zu nutzen. Zu diesem Zweck haben wir spezielle Prompt-Anweisungen sorgfältig vorbereitet, um der KI beim Lernen und Nachschlagen der Verwendung von ofa.js zu helfen.

Wir bieten zwei Versionen der Prompt-Formulierungen an:

## Vereinfachte Eingabeaufforderung

Dies ist eine konzentrierte und optimierte Version, die darauf abzielt, den Verbrauch von vorangestellten Token-Eingaben zu minimieren und für die meisten Szenarien geeignet ist.

```
https://raw.githubusercontent.com/ofajs/ofa.js/main/llms/tiny/start.md
```

Mit diesem Prompt kann die KI effizient Komponenten oder Seitenmodule von ofa.js entwickeln.

## Vollständiges Prompt

Wenn das von Ihnen verwendete KI-Modell relativ weniger intelligent ist, können Sie versuchen, die ungekürzte Vollversion des Prompt-Worts zu verwenden. Obwohl bei der Initialisierung mehr Token verbraucht werden, kann dies möglicherweise bessere Ergebnisse erzielen:

```
https://raw.githubusercontent.com/ofajs/ofa.js/main/llms/origin/start.md
```

Durch die Bereitstellung dieser Prompts hoffen wir, Entwicklern zu helfen, KI-Tools bequemer für die Entwicklung von ofa.js-Projekten zu nutzen und die Entwicklungseffizienz zu verbessern.

