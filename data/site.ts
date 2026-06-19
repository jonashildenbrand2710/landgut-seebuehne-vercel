export const siteConfig = {
  name: "Landgut Seebuehne",
  displayName: "Landgut Seebühne",
  domain: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.landgut-seebuehne.de").replace(/\/$/, ""),
  email: "mail@landgut-seebuehne.de",
  phone: "09163 - 1455",
  address: {
    legal: "Kirchstr. 22, 91487 Vestenbergsgreuth",
    publicRegion: "Vestenbergsgreuth / Mittelfranken / Franken"
  },
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://kennenlernen.landgut-seebuehne.de/termin",
  alternateBookingUrl:
    process.env.NEXT_PUBLIC_ALT_BOOKING_URL ?? "https://kennenlernen.landgut-seebuehne.de/terminb"
} as const;

export const imageLibrary = {
  hero: {
    src: "/images/onepage/raw/ceba4def-e52b-41c0-8966-5b7a43290051.png",
    alt: "Brautpaar mit Schirm auf einem Holzsteg am See des Landgut Seebühne"
  },
  coupleDock: {
    src: "/images/onepage/raw/792a3014-5d0b-418d-ab7a-63c0bdad5d81.jpg",
    alt: "Brautpaar auf einem Holzsteg am See des Landgut Seebühne mit viel Grün"
  },
  lake: {
    src: "/images/onepage/raw/5c49018f-0803-4d36-b612-6f4b4d01f860.jpg",
    alt: "Seeblick und Außenbereich des Landgut Seebühne"
  },
  mappeCover: {
    src: "/images/onepage/raw/1b946b01-a65f-46e8-aed9-8362e098cfbf.png",
    alt: "Cover der Hochzeitsmappe des Landgut Seebühne"
  },
  availability: {
    src: "/images/onepage/raw/ceba4def-e52b-41c0-8966-5b7a43290051.png",
    alt: "Brautpaar mit Schirm auf einem Steg am See des Landgut Seebühne"
  },
  ceremony: {
    src: "/images/onepage/raw/1c4571ed-5ba3-4882-bdfa-9ca0d8b120e7.png",
    alt: "Freie Trauung im Grünen am See"
  },
  location: {
    src: "/images/onepage/raw/14d3a6e6-2594-44f1-9801-9a1365978dbb.jpg",
    alt: "Festlich gedeckter Innenraum des Landgut Seebühne"
  },
  gettingReady: {
    src: "/images/onepage/raw/7bc4a04d-bdae-4726-9d21-05ba4ba3ebd8.png",
    alt: "Braut beim Getting Ready mit Blumenstrauß"
  },
  team: {
    src: "/images/onepage/raw/80f4aa53-e871-4345-b47e-d96e2e155a8d.jpg",
    alt: "Team und Gastgeber des Landgut Seebühne"
  },
  teamChristine: {
    src: "/images/onepage/raw/fa466928-78bd-4d62-b52d-4c27d6604819.jpg",
    alt: "Christine Hildenbrand vom Landgut Seebühne"
  },
  teamJonas: {
    src: "/images/onepage/raw/eb3a85f8-a649-44a8-8fc7-1a62b431aae4.jpg",
    alt: "Jonas Hildenbrand vom Landgut Seebühne"
  },
  teamJohanna: {
    src: "/images/onepage/raw/bee4e9d2-217b-416f-bde5-e12080544202.jpg",
    alt: "Johanna Protze vom Landgut Seebühne"
  },
  teamOliver: {
    src: "/images/onepage/raw/80f4aa53-e871-4345-b47e-d96e2e155a8d.jpg",
    alt: "Oliver Hildenbrand vom Landgut Seebühne"
  }
} as const;

export type PageSection = {
  eyebrow?: string;
  title: string;
  text: string;
  points?: string[];
};

export type SitePage = {
  slug: string;
  navTitle?: string;
  title: string;
  description: string;
  heroTitle: string;
  heroEyebrow: string;
  heroText: string;
  imageKey: keyof typeof imageLibrary;
  primaryCta?: string;
  secondaryCta?: string;
  sections: PageSection[];
  faqs?: { question: string; answer: string }[];
  noindex?: boolean;
};

export const indexPage = {
  slug: "",
  title: "Natürlich heiraten am See in Mittelfranken",
  description:
    "Landgut Seebühne ist eine exklusive Hochzeitslocation in Mittelfranken - natürlich heiraten zwischen Wiesen, Wald und See, mit persönlicher Begleitung und klaren nächsten Schritten.",
  heroEyebrow: "Exklusive Location in Mittelfranken",
  heroTitle: "Natürlich heiraten inmitten von Wiesen, Wald und See.",
  heroText:
    "Genießt euren Hochzeitstag an einem privaten Ort, der Kulisse, Ablauf und Begleitung zusammenbringt: vom ersten Ankommen über die Trauung bis zur Feier am Abend.",
  imageKey: "hero",
  primaryCta: "Preise & Verfügbarkeit anfragen",
  secondaryCta: "Hochzeitsmappe ansehen",
  sections: [
    {
      eyebrow: "Der Ort",
      title: "Nicht nur Kulisse, sondern ein ganzer Tagesort",
      text:
        "Viele Paare verlieben sich zuerst in den Blick aufs Wasser. Gebucht wird am Ende aber der Rahmen dahinter: ein Gelände, das sich privat anfühlt, klare Wege bietet und den Wechsel von Trauung, Empfang, Fotos, Dinner und Party stimmig mitgeht.",
      points: [
        "Freie Trauung am See oder auf dem Gelände möglich",
        "Außenbereiche, Landhaus und Rückzugsorte für einen ganzen Hochzeitstag",
        "Persönliche Ansprechpartner statt anonymer Eventfläche"
      ]
    },
    {
      eyebrow: "Sicherheit",
      title: "Natur ohne das Gefühl, alles selbst tragen zu müssen",
      text:
        "Eine naturnahe Hochzeit braucht mehr als schöne Bilder. Wetter, Wege, Gästekomfort, Technik und Dienstleister müssen zusammenpassen. Aus unserer Erfahrung entsteht Entspannung genau dort, wo diese Fragen früh sortiert werden.",
      points: [
        "Plan B und Wetteroptionen werden früh mitgedacht",
        "Klare Betreuung vor und während der Hochzeit",
        "Orientierung für Paare, Gäste und Dienstleister"
      ]
    },
    {
      eyebrow: "Der erste Schritt",
      title: "Erst sprechen, dann sinnvoll besichtigen",
      text:
        "Der beste Start ist ein persönliches Erstgespräch. Dort klären wir Datum, Gästezahl, Vorstellungen und offene Fragen. Wenn der Rahmen passt, kann eine Besichtigung der nächste sinnvolle Schritt sein."
    }
  ],
  faqs: [
    {
      question: "Kann man am Landgut Seebühne direkt am See heiraten?",
      answer:
        "Eine freie Trauung am See oder auf dem Gelände ist möglich. Wichtig ist, dass der Trauplatz nicht nur schön aussieht, sondern auch Wege, Technik, Wetter und Gäste gut mitdenkt."
    },
    {
      question: "Ist eine Besichtigung direkt buchbar?",
      answer:
        "Wir empfehlen zuerst ein Erstgespräch. Dort klären wir, ob Datum, Gästezahl und Rahmen grundsätzlich passen und ob eine Besichtigung der sinnvolle nächste Schritt ist."
    },
    {
      question: "Warum nennt die Website keine Preise?",
      answer:
        "Der konkrete Rahmen hängt von Datum, Gästezahl und Vorstellungen ab. Deshalb klären wir Leistungen und Möglichkeiten persönlich im Erstgespräch, statt öffentliche Pauschalaussagen zu machen."
    }
  ]
} satisfies SitePage;

export const sitePages: SitePage[] = [
  {
    slug: "trauung",
    navTitle: "Trauung",
    title: "Freie Trauung am See",
    description:
      "Freie Trauung am See in Mittelfranken: Was am Landgut Seebühne emotional wirkt und organisatorisch gut geplant wird.",
    heroEyebrow: "Trauung am Wasser",
    heroTitle: "Eine freie Trauung am See braucht Atmosphäre und einen guten Plan.",
    heroText:
      "Der See ist ein besonderer Mittelpunkt für euer Ja-Wort. Damit der Moment leicht wirkt, denken wir Wege, Akustik, Licht, Wetter und den Übergang zum Empfang mit.",
    imageKey: "ceremony",
    primaryCta: "Erstgespräch anfragen",
    secondaryCta: "Ratgeber zur Trauung lesen",
    sections: [
      {
        title: "Der Trauplatz muss mehr können als schön aussehen",
        text:
          "Bei einer Trauung im Freien zählen Blickachse, Sitzplätze, Schatten, Ton, Einzug, Auszug und der Platz für Redner, Musik und Fotografie. Wenn diese Details stimmen, bleibt Raum für den eigentlichen Moment.",
        points: ["Trauung am See oder auf dem Gelände", "Technik und Akustik im Blick", "Stimmiger Übergang zum Empfang"]
      },
      {
        title: "Plan B ist kein Stimmungskiller",
        text:
          "Outdoor-Hochzeiten werden entspannter, wenn Wetter nicht verdrängt wird. Ein guter Plan B fühlt sich nicht wie eine Notlösung an, sondern wie eine zweite stimmige Variante eures Tages."
      }
    ],
    faqs: [
      {
        question: "Was passiert, wenn es regnet?",
        answer:
          "Das klären wir früh in der Planung. Wichtig ist, dass der Plan B zur Gästezahl, zum Ablauf und zur Atmosphäre eurer Trauung passt."
      },
      {
        question: "Kann die Trauung direkt in die Feier übergehen?",
        answer:
          "Ja, genau das ist einer der Vorteile eines Tagesortes: Trauung, Gratulation, Empfang und Fotos können ohne harten Bruch ineinander übergehen."
      }
    ]
  },
  {
    slug: "location",
    navTitle: "Location",
    title: "Hochzeitslocation am See",
    description:
      "See, Garten, Landhaus und Außenbereiche: Das Landgut Seebühne als Hochzeitslocation für einen ganzen Tag in Mittelfranken.",
    heroEyebrow: "Location",
    heroTitle: "Ein Ort, an dem euer Hochzeitstag nicht ständig neu starten muss.",
    heroText:
      "Ankommen, Trauung, Empfang, Fotos, Dinner und Party liegen nicht als lose Stationen nebeneinander, sondern bilden einen Tagesablauf mit Orientierung.",
    imageKey: "location",
    primaryCta: "Telefontermin vereinbaren",
    secondaryCta: "Hochzeitsmappe ansehen",
    sections: [
      {
        title: "See, Garten und Landhaus als zusammenhängender Rahmen",
        text:
          "Eine gute Hochzeitslocation gibt nicht nur einem Programmpunkt eine Bühne. Sie trägt die Übergänge: vom ersten Ankommen bis zum letzten Tanz.",
        points: ["Naturnahe Außenbereiche", "Landhaus für Dinner und Feier", "Bereiche für Fotos, Empfang und Rückzug"]
      },
      {
        title: "Privates Hochzeitsgefühl statt anonymer Fläche",
        text:
          "Viele Paare suchen keinen Standardsaal, sondern einen Ort, der sich für diesen Tag wirklich nach ihrem eigenen Hochzeitsort anfühlt."
      }
    ]
  },
  {
    slug: "getting-ready",
    navTitle: "Getting Ready",
    title: "Getting Ready vor Ort",
    description:
      "Getting Ready am Landgut Seebühne: entspannt in den Hochzeitstag starten und ohne unnötige Wege im Tag ankommen.",
    heroEyebrow: "Getting Ready",
    heroTitle: "Der Hochzeitstag beginnt ruhiger, wenn ihr schon am richtigen Ort seid.",
    heroText:
      "Getting Ready vor Ort kann Wege, Übergaben und Zeitdruck reduzieren. Ihr kommt früher im Gefühl des Tages an und startet nicht aus dem Auto heraus.",
    imageKey: "gettingReady",
    primaryCta: "Erstgespräch anfragen",
    secondaryCta: "Mehr zur Location",
    sections: [
      {
        title: "Ein Start mit weniger Reibung",
        text:
          "Haare, Make-up, Ankleiden, erste Fotos und persönliche Momente brauchen Licht, Ruhe und genug Puffer. Wenn diese Phase vor Ort möglich ist, wird der gesamte Ablauf oft entspannter.",
        points: ["Weniger Anfahrtsstress", "Früher am Ort des Tages", "Gute Basis für Fotos und First Look"]
      },
      {
        title: "Getting Ready ist kein Deko-Extra",
        text:
          "Es verändert den Tagesbeginn. Deshalb sollte früh geklärt werden, wer dabei ist, wann ihr ankommt und wie der Übergang zur Trauung funktioniert."
      }
    ]
  },
  {
    slug: "uber-uns",
    navTitle: "Über uns",
    title: "Über das Landgut Seebühne",
    description:
      "Das Landgut Seebühne ist eine familiengeführte Hochzeitslocation in Mittelfranken: persönlich, erfahren und mit Blick für klare Abläufe.",
    heroEyebrow: "Über uns",
    heroTitle: "Persönlich geführt, aber nicht dem Zufall überlassen.",
    heroText:
      "Die Seebühne steht für Gastgebergefühl, Erfahrung und die ruhige Sicherheit, dass ein Hochzeitstag viele schöne und viele praktische Details braucht.",
    imageKey: "team",
    primaryCta: "Erstgespräch anfragen",
    secondaryCta: "Location ansehen",
    sections: [
      {
        title: "Herzlichkeit mit Struktur",
        text:
          "Familiengeführt bedeutet für uns nicht improvisiert. Es bedeutet nahbar, verantwortlich und persönlich begleitet - mit dem Blick dafür, was Paare vor und am Hochzeitstag wirklich entlastet."
      },
      {
        title: "Ein Ort mit Geschichte",
        text:
          "Aus einem privaten Ort mit besonderer Bedeutung ist über die Jahre eine Hochzeitslocation entstanden, die Natur, Wasser und Gastgebererfahrung verbindet."
      }
    ]
  },
  {
    slug: "hochzeitsmappe",
    navTitle: "Hochzeitsmappe",
    title: "Hochzeitsmappe anfordern",
    description:
      "Die Hochzeitsmappe gibt Paaren einen ersten Überblick über Möglichkeiten, Ablauf und Atmosphäre am Landgut Seebühne.",
    heroEyebrow: "Hochzeitsmappe",
    heroTitle: "Ein erster Überblick, bevor ihr alles einzeln zusammensuchen müsst.",
    heroText:
      "Die Mappe hilft euch, den Ort, den Ablauf und die wichtigsten Fragen besser einzuordnen. Der konkrete Rahmen wird anschließend persönlich im Erstgespräch geklärt.",
    imageKey: "lake",
    primaryCta: "Hochzeitsmappe anfragen",
    secondaryCta: "Telefontermin vereinbaren",
    sections: [
      {
        title: "Für Paare, die sich erst orientieren möchten",
        text:
          "Viele Fragen entstehen erst, wenn man eine Location wirklich mit dem eigenen Datum, der Gästezahl und dem gewünschten Tagesgefühl verbindet. Die Hochzeitsmappe ist dafür ein guter Startpunkt.",
        points: ["Eindruck vom Ort", "Ablauf und Möglichkeiten", "Fragen für das Erstgespräch"]
      }
    ]
  },
  {
    slug: "besichtigung",
    navTitle: "Besichtigung",
    title: "Besichtigung nach dem Erstgespräch",
    description:
      "Eine Besichtigung des Landgut Seebühne ist sinnvoll, wenn im Erstgespräch Datum, Gästezahl und Rahmen grundsätzlich passen.",
    heroEyebrow: "Besichtigung",
    heroTitle: "Erst klären wir den Rahmen, dann wird der Ort vor Ort greifbar.",
    heroText:
      "Eine Besichtigung ist am wertvollsten, wenn ihr schon wisst, welche Fragen für eure Hochzeit wichtig sind. Deshalb startet der Weg bei uns mit einem Erstgespräch.",
    imageKey: "location",
    primaryCta: "Erstgespräch anfragen",
    secondaryCta: "Hochzeitsmappe ansehen",
    sections: [
      {
        title: "Warum nicht direkt besichtigen?",
        text:
          "Damit die Besichtigung nicht nur ein schöner Rundgang wird, klären wir vorher die wichtigsten Eckpunkte: Datum, Gästezahl, Tagesrahmen und eure offenen Fragen."
      },
      {
        title: "Was ihr im Erstgespräch gewinnt",
        text:
          "Ihr bekommt eine erste Einordnung, ob der Ort zu euren Vorstellungen passt und welche nächsten Schritte sinnvoll sind."
      }
    ]
  },
  {
    slug: "termin-buchen",
    navTitle: "Termin",
    title: "Telefontermin buchen",
    description:
      "Bucht ein unverbindliches Erstgespräch, um Datum, Gästezahl, Rahmen und offene Fragen zum Landgut Seebühne zu klären.",
    heroEyebrow: "Erstgespräch",
    heroTitle: "Der einfachste Start ist ein persönlicher Telefontermin.",
    heroText:
      "Im Gespräch sortieren wir eure wichtigsten Fragen und schauen gemeinsam, ob das Landgut Seebühne grundsätzlich zu eurem Datum, eurer Gästezahl und euren Vorstellungen passt.",
    imageKey: "hero",
    primaryCta: "Kalender öffnen",
    secondaryCta: "Per E-Mail schreiben",
    sections: [
      {
        title: "Was wir im Gespräch klären",
        text:
          "Ihr müsst noch nicht alles wissen. Wichtig ist, dass wir die Eckpunkte sortieren und euch Orientierung geben, was als Nächstes sinnvoll ist.",
        points: ["Wunschtermin oder Zeitraum", "ungefähre Gästezahl", "Art der Hochzeit", "offene Fragen und nächste Schritte"]
      }
    ]
  },
  {
    slug: "kontaktformular",
    title: "Kontakt",
    description:
      "Kontakt zum Landgut Seebühne: Startet mit einem Erstgespräch oder schreibt uns eure wichtigsten Fragen per E-Mail.",
    heroEyebrow: "Kontakt",
    heroTitle: "Schreibt uns oder startet direkt mit einem Erstgespräch.",
    heroText:
      "Wenn ihr schon konkrete Eckpunkte habt, ist ein Telefontermin meist der schnellste Weg. Für erste Fragen könnt ihr uns auch direkt per E-Mail erreichen.",
    imageKey: "lake",
    primaryCta: "Telefontermin vereinbaren",
    secondaryCta: "E-Mail schreiben",
    sections: [
      {
        title: "Damit wir gut einordnen können, worum es geht",
        text:
          "Hilfreich sind Wunschtermin oder Zeitraum, ungefähre Gästezahl, Art der Hochzeit und die Fragen, die euch gerade am meisten beschäftigen."
      }
    ]
  },
  {
    slug: "formular",
    title: "Kennenlernen",
    description:
      "Kennenlernen mit dem Landgut Seebühne: eure Eckpunkte sammeln und ein unverbindliches Erstgespräch starten.",
    heroEyebrow: "Kennenlernen",
    heroTitle: "Lasst uns herausfinden, ob der Rahmen zu eurer Hochzeit passt.",
    heroText:
      "Der erste Austausch gibt euch Orientierung und hilft uns, Datum, Gästezahl und Vorstellungen realistisch einzuordnen.",
    imageKey: "ceremony",
    primaryCta: "Telefontermin vereinbaren",
    secondaryCta: "Kontakt aufnehmen",
    sections: [
      {
        title: "Was euch erwartet",
        text:
          "Ein direkter Austausch, konkrete Antworten auf eure ersten Fragen und eine gemeinsame Einschätzung, ob eine Besichtigung der nächste sinnvolle Schritt ist.",
        points: ["unverbindlich", "persönlich", "auf eure Eckpunkte bezogen"]
      }
    ]
  },
  {
    slug: "impressum",
    title: "Impressum",
    description: "Impressum des Landgut Seebühne.",
    heroEyebrow: "Impressum",
    heroTitle: "Impressum",
    heroText: "Angaben gemäß der aktuell öffentlich geführten Impressumsdaten.",
    imageKey: "lake",
    sections: [
      {
        title: "Ferien- und Freizeit am See GbR",
        text:
          "Oliver und Christine Hildenbrand\nKirchstr. 22\n91487 Vestenbergsgreuth\n\nE-Mail: mail@landgut-seebuehne.de\nWebsite: www.landgut-seebuehne.de\nTel. 09163 - 1455\nFax 09163 - 1476\n\nInhaltlich Verantwortliche: Oliver und Christine Hildenbrand"
      }
    ]
  },
  {
    slug: "danke",
    title: "Danke",
    description: "Danke für eure Anfrage beim Landgut Seebühne.",
    heroEyebrow: "Danke",
    heroTitle: "Danke für eure Nachricht.",
    heroText:
      "Eure Angaben sind angekommen. Schaut bitte auch in den Spam- oder Werbeordner, falls ihr nicht direkt eine Nachricht findet.",
    imageKey: "hero",
    sections: [
      {
        title: "Was als Nächstes passiert",
        text:
          "Wir melden uns mit den nächsten Schritten. Wenn ihr vorher eine dringende Frage habt, erreicht ihr uns direkt per E-Mail."
      }
    ],
    noindex: true
  },
  {
    slug: "preise",
    title: "Rahmen persönlich klären",
    description:
      "Preis- und Verfügbarkeitsfragen zum Landgut Seebühne werden persönlich im Erstgespräch geklärt.",
    heroEyebrow: "Rahmen und Verfügbarkeit",
    heroTitle: "Den konkreten Rahmen klären wir am besten persönlich.",
    heroText:
      "Welche Leistungen und Möglichkeiten zu eurer Hochzeit passen, hängt von Datum, Gästezahl und Tagesrahmen ab. Deshalb führen wir Preis- und Verfügbarkeitsfragen bewusst ins Erstgespräch.",
    imageKey: "location",
    primaryCta: "Erstgespräch anfragen",
    sections: [
      {
        title: "Warum hier keine öffentlichen Preisdetails stehen",
        text:
          "Ein seriöser Vergleich funktioniert nicht über einzelne Zahlen, sondern über den gesamten Rahmen: Nutzung, Betreuung, Ablauf, Gästezahl, Leistungen und eure Prioritäten."
      }
    ],
    noindex: true
  },
  {
    slug: "preise-basis",
    title: "Rahmen persönlich klären",
    description:
      "Preis- und Paketfragen werden beim Landgut Seebühne nicht öffentlich pauschalisiert, sondern im Erstgespräch eingeordnet.",
    heroEyebrow: "Rahmen und Verfügbarkeit",
    heroTitle: "Lasst uns den passenden Rahmen im Gespräch sortieren.",
    heroText:
      "Damit ihr keine unvollständigen Einzelzahlen vergleichen müsst, klären wir Leistungen, Datum und Gästezahl persönlich.",
    imageKey: "location",
    primaryCta: "Telefontermin vereinbaren",
    sections: [
      {
        title: "Nächster Schritt",
        text:
          "Startet mit einem unverbindlichen Telefontermin. Dort lässt sich deutlich besser einordnen, was für eure Hochzeit sinnvoll ist."
      }
    ],
    noindex: true
  },
  {
    slug: "quizz",
    title: "Erstgespräch",
    description: "Weiterleitungspunkt für ältere Quiz- oder Funnel-Seiten des Landgut Seebühne.",
    heroEyebrow: "Erstgespräch",
    heroTitle: "Der aktuelle Weg startet mit einem Erstgespräch.",
    heroText:
      "Diese ältere Funnel-Seite wird im Rebuild nicht als öffentliche SEO-Seite geführt. Für Paare ist der Telefontermin der sinnvollste nächste Schritt.",
    imageKey: "hero",
    primaryCta: "Telefontermin vereinbaren",
    sections: [
      {
        title: "Aktueller Einstieg",
        text:
          "Wir klären im Gespräch, ob Datum, Gästezahl und Vorstellungen grundsätzlich zum Landgut Seebühne passen."
      }
    ],
    noindex: true
  },
  {
    slug: "chatbot",
    title: "Kontakt",
    description: "Interne oder ältere Chatbot-Seite des Landgut Seebühne.",
    heroEyebrow: "Kontakt",
    heroTitle: "Lasst uns direkt sprechen.",
    heroText:
      "Diese ältere Chatbot-Seite wird nicht als öffentliche SEO-Seite geführt. Für konkrete Hochzeitsfragen nutzt bitte das Erstgespräch.",
    imageKey: "lake",
    primaryCta: "Telefontermin vereinbaren",
    sections: [
      {
        title: "Schneller zur passenden Antwort",
        text:
          "Im persönlichen Gespräch lassen sich Datum, Gästezahl, Rahmen und nächste Schritte zuverlässiger klären."
      }
    ],
    noindex: true
  },
  {
    slug: "zimmerbuchung",
    title: "Zimmerbuchung",
    description: "Kontaktseite für Zimmer- und Rechnungsfragen am Landgut Seebühne.",
    heroEyebrow: "Zimmerbuchung",
    heroTitle: "Für Zimmer- und Rechnungsfragen meldet euch direkt bei uns.",
    heroText:
      "Diese Seite bleibt im Rebuild kontrolliert erreichbar, wird aber nicht als öffentliche SEO-Seite für Hochzeiten geführt.",
    imageKey: "location",
    primaryCta: "E-Mail schreiben",
    sections: [
      {
        title: "Kontakt",
        text:
          "Bei Fragen zur Buchung oder Rechnung erreicht ihr uns per E-Mail. Bestehende operative Abläufe sollten vor dem Livegang final geprüft werden."
      }
    ],
    noindex: true
  },
  {
    slug: "bewerbung",
    title: "Bewerbung",
    description: "Bewerbung beim Landgut Seebühne.",
    heroEyebrow: "Team",
    heroTitle: "Arbeiten an einem besonderen Ort.",
    heroText:
      "Diese Seite bleibt zunächst als schlanke Kontaktseite bestehen. Der vollständige Bewerbungsfunnel sollte vor Livegang aus Onepage übernommen oder neu angebunden werden.",
    imageKey: "team",
    primaryCta: "Per E-Mail bewerben",
    sections: [
      {
        title: "Bewerbung und Rückfragen",
        text:
          "Wenn du Teil des Teams werden möchtest, schick uns gerne eine kurze Nachricht mit deinen Kontaktdaten und dem Bereich, der dich interessiert."
      }
    ],
    noindex: true
  }
];

export const allPages: SitePage[] = [indexPage, ...sitePages];

export function getPageBySlug(slug: string) {
  return sitePages.find((page) => page.slug === slug);
}

export const mainNavigation = [
  { label: "Location", href: "/location" },
  { label: "Trauung", href: "/trauung" },
  { label: "Getting Ready", href: "/getting-ready" },
  { label: "Über uns", href: "/uber-uns" },
  { label: "Ratgeber", href: "/hochzeitsratgeber" },
  { label: "Termin", href: "/termin-buchen" }
];
