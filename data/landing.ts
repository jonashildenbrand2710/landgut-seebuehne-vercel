import type { imageLibrary } from "@/data/site";

type ImageKey = keyof typeof imageLibrary;

export type LandingStat = {
  value: string;
  label: string;
};

export type LandingPromise = {
  number: string;
  title: string;
  text: string;
};

export type LandingBundle = {
  title: string;
  kicker: string;
  text: string;
  badge?: string;
  points: string[];
  cta: string;
};

export type LandingStoryCard = {
  title: string;
  text: string;
};

export type LandingTeamLeader = {
  name: string;
  role: string;
  imageKey: ImageKey;
};

export type LandingTestimonial = {
  quote: string;
  name: string;
  context: string;
};

export type LandingGalleryItem = {
  imageKey: ImageKey;
  title: string;
  text: string;
};

export const landingProof = {
  stats: [
    { value: "4,9", label: "aus Paarbewertungen" },
    { value: "120+", label: "Paare als sichtbares Vertrauenssignal" },
    { value: "1", label: "Hochzeit pro Tag, keine Parallelveranstaltung" }
  ] satisfies LandingStat[],
  mentions: ["Bekannt aus", "Paarstimmen", "Hochzeitsmappe", "Besichtigung"]
};

export const landingLeadMagnet = {
  eyebrow: "Hochzeitsmappe",
  title: "Die perfekte Kulisse für eure Traumhochzeit.",
  text:
    "Sichert euch exklusive Infos und einen ersten Überblick, bevor Termine vergeben sind. Die Mappe bündelt Ort, Möglichkeiten und Fragen für den nächsten Schritt.",
  badges: ["PDF-Download", "Location am See", "Ablauf & Möglichkeiten", "Vorbereitung fürs Erstgespräch"],
  points: [
    "umfassender Überblick über die Location am See",
    "Antworten auf häufige Fragen rund um eure Hochzeit",
    "Orientierung, bevor ihr Telefontermin oder Besichtigung plant"
  ]
};

export const landingAvailability = {
  eyebrow: "Freie Hochzeitstermine",
  title: "Jetzt anfragen, bevor euer Wunschdatum vergeben ist.",
  text:
    "Wir sortieren mit euch Datum, Gästezahl, Paket-Richtung und die Frage, ob ein Erstgespräch der passende nächste Schritt ist.",
  cta: "Preise & Details anfragen"
};

export const landingPromises = [
  {
    number: "1",
    title: "Echte Exklusivität",
    text:
      "Unsere One-Wedding-Policy: eine Hochzeit pro Tag, 100% Aufmerksamkeit und keine fremden Gäste im Hintergrund."
  },
  {
    number: "2",
    title: "Digitale Betreuung",
    text:
      "Moderne Planung trifft traditionelle Hochzeitsexpertise, damit ihr vor und während der Vorbereitung klare Orientierung habt."
  },
  {
    number: "3",
    title: "Individualität",
    text:
      "Maßgeschneiderte Konzepte statt vorgefertigter Hochzeitspakete: euer Tag soll zu euch und eurem Rahmen passen."
  },
  {
    number: "4",
    title: "Naturkulisse mit Sicherheit",
    text:
      "Idyllischer See und 8.000 qm Park wirken leicht, während Wetter, Wege und Plan B von Anfang an mitgedacht werden."
  },
  {
    number: "5",
    title: "Nachhaltige Partner",
    text:
      "Regionale Partner und umweltbewusste Umsetzung geben dem Hochzeitstag Substanz, ohne die Feier schwer zu machen."
  },
  {
    number: "6",
    title: "Preise ohne Überraschungen",
    text:
      "Leistungen, Getränke, Service und Rahmen werden transparent eingeordnet, damit ihr nicht mit Einzelzahlen jongliert."
  }
] satisfies LandingPromise[];

export const landingBundles = [
  {
    title: "Tiny Wedding",
    kicker: "Klein, aber oho",
    text: "Für eure 15-35 liebsten Menschen: Qualität statt Quantität, viel Nähe und ein privater Rahmen am See.",
    points: [
      "privater Seezugang nur für eure kleine Gruppe",
      "auch kurzfristig und spontan planbar",
      "authentische Momente statt Massenabfertigung"
    ],
    cta: "Preise & Details anfragen"
  },
  {
    title: "Classic Wedding",
    kicker: "Stilvoll feiern",
    text: "Für Paare, die exklusiv feiern und einen stimmigen Tagesort mit Gartenbereich, Team und Gästekomfort suchen.",
    points: [
      "komplett für euch allein",
      "eigener Gartenbereich mit Seeblick",
      "professionelles Team für reibungslosen Ablauf",
      "Übernachtungsmöglichkeiten für Gäste zum Vorzugspreis"
    ],
    cta: "Preise & Details anfragen"
  },
  {
    title: "Signature Wedding",
    kicker: "Kompromisslos einzigartig",
    badge: "Besonders beliebt",
    text:
      "Für Paare, die Prime-Wochenendtermine, mehr Begleitung und ein besonders rundes Erlebnis suchen.",
    points: [
      "alles aus Classic Wedding plus zusätzliche Vorteile",
      "freie Trauung am See für euren großen Moment",
      "VIP-Betreuung während der Planungsphase",
      "Hochzeitssuite direkt vor Ort"
    ],
    cta: "Preise & Details anfragen"
  }
] satisfies LandingBundle[];

export const landingFamily = {
  eyebrow: "Familienunternehmen",
  title: "Über das Landgut Seebühne",
  text:
    "Das Landgut Seebühne ist ein magischer Ort für einzigartige Hochzeiten in idyllischer Umgebung mit See und weitläufigen Gärten. Was 1996 mit der Hochzeit der Gründerfamilie Hildenbrand begann, ist heute eine exklusive Location für Paare, die mehr als nur einen Veranstaltungsort suchen. Hier verbindet sich internationale Gastro-Expertise mit familiärer Herzlichkeit, um jeden Hochzeitstag zu einem unvergesslichen Erlebnis zu machen.",
  cards: [
    {
      title: "Eine Geschichte aus Liebe geboren",
      text:
        "Die Seebühne hat ihre eigene Liebesgeschichte: Von der Hochzeit der Gründer über die Feier der Juniorchefin bis zur ersten Freundesanfrage. Wer könnte Hochzeiten besser ausrichten als eine Familie, die hier ihre eigenen schönsten Momente erlebt hat?"
    },
    {
      title: "Familiäre Wärme trifft Professionalität",
      text:
        "Zwei Hildenbrand-Kinder bringen internationales Gastro-Know-how ins Team. So bleibt trotz bis zu 70 Hochzeiten jährlich jede Feier ein Herzensprojekt mit spürbarer Exklusivität und persönlicher Betreuung in jedem Detail."
    },
    {
      title: "Ein Zuhause für euren großen Tag",
      text:
        "Die Seebühne ist mehr als eine Location - sie ist ein Ort, an dem eure Hochzeitsträume Wirklichkeit werden. Hier verschmelzen Tradition und Innovation zu einem Erlebnis, das sich anfühlt wie nach Hause kommen."
    }
  ] satisfies LandingStoryCard[]
};

export const landingTeamLeaders = [
  {
    name: "Christine Hildenbrand",
    role: "CEO - Creative Director",
    imageKey: "teamChristine"
  },
  {
    name: "Jonas Hildenbrand",
    role: "Marketing & Akquise",
    imageKey: "teamJonas"
  },
  {
    name: "Johanna Protze",
    role: "Koordinatorin & Korrespondenz",
    imageKey: "teamJohanna"
  },
  {
    name: "Oliver Hildenbrand",
    role: "Geschäftsführung - Finanzen",
    imageKey: "teamOliver"
  }
] satisfies LandingTeamLeader[];

export const landingTestimonials = [
  {
    quote:
      "Wir haben unsere Hochzeit mit freier Trauung an der Seebühne gehabt und waren begeistert. Ein besonderer, magischer Ort mit einem Personal, das sich am Ende für uns wie Familie anfühlte und einem so herzlichen Service. Eine Location, die es so nirgendwo anders gibt.",
    name: "Justine R.",
    context: "Freie Trauung an der Seebühne"
  },
  {
    quote:
      "Hatte mein Hochzeitsfeier hier. Das Team war super freundlich, professionell, und alles was Paare braucht, um eine schöne Hochzeit zu haben. Location ist sehr schön und romantisch.",
    name: "Clara Marianna",
    context: "Hochzeitsfeier"
  },
  {
    quote:
      "Eine romantische Oase mit herrlichem Garten, einem Weiher und einer liebevoll gestalteten Feierlocation. Wer das gewisse Etwas sucht ist hier genau richtig. Begleite immer wieder gerne Brautpaare als Hochzeitsrednerin.",
    name: "Sabine Krause",
    context: "Hochzeitsrednerin"
  }
] satisfies LandingTestimonial[];

export const landingProblemSigns = [
  "mehrere Veranstaltungen oder fremde Gäste am selben Tag",
  "schöne Bilder, aber kein überzeugender Plan B",
  "unklare Zuständigkeiten während der Feier",
  "lange Wege zwischen Trauung, Empfang, Dinner und Party",
  "Leistungen, Zeiten oder Zusatzkosten bleiben bis spät unklar"
];

export const landingAdvantages = [
  "exklusive Nutzung statt Parallelbetrieb",
  "See, Garten und Landhaus als zusammenhängender Tagesort",
  "Erstgespräch vor Besichtigung, damit der Rahmen vorher passt",
  "Plan B und Wetteroptionen werden früh mitgedacht",
  "Orientierung für Paare, Gäste und Dienstleister",
  "persönliche Gastgeber statt anonyme Eventfläche",
  "Hochzeitsmappe als Einstieg für bessere Vorbereitung",
  "klare CTAs für Telefontermin, Mappe und Kontakt"
];

export const landingGallery = [
  {
    imageKey: "hero",
    title: "See und Garten",
    text: "Der Außenbereich trägt Trauung, Empfang, Fotos und ruhige Momente."
  },
  {
    imageKey: "ceremony",
    title: "Trauung im Grünen",
    text: "Ein emotionaler Mittelpunkt, der organisatorisch vorbereitet sein muss."
  },
  {
    imageKey: "location",
    title: "Dinner und Feier",
    text: "Innenräume und Außenbereiche greifen im Tagesablauf ineinander."
  },
  {
    imageKey: "gettingReady",
    title: "Getting Ready",
    text: "Der Tag beginnt ruhiger, wenn ihr schon vor Ort ankommen könnt."
  },
  {
    imageKey: "team",
    title: "Gastgeberfamilie",
    text: "Persönliche Begleitung macht aus einem Ort einen verlässlichen Rahmen."
  },
  {
    imageKey: "lake",
    title: "Mittelfranken",
    text: "Naturnah gelegen und trotzdem als ganzer Hochzeitstag gut planbar."
  }
] satisfies LandingGalleryItem[];

export const landingFaq = [
  {
    question: "Was ist der sinnvollste erste Schritt?",
    answer:
      "Startet mit einem unverbindlichen Erstgespräch. Dort klären wir Datum, Gästezahl, Tagesgefühl und offene Fragen, bevor eine Besichtigung sinnvoll geplant wird."
  },
  {
    question: "Warum steht die Hochzeitsmappe so früh auf der Seite?",
    answer:
      "Sie ist ein guter Einstieg, wenn ihr den Ort, den Ablauf und typische Fragen erst einmal sortieren möchtet."
  },
  {
    question: "Kann die Trauung direkt am See stattfinden?",
    answer:
      "Eine freie Trauung am See oder auf dem Gelände ist möglich. Wichtig ist, dass der Platz auch Wege, Technik, Wetter und Gästekomfort mitträgt."
  },
  {
    question: "Werden Preise öffentlich genannt?",
    answer:
      "Konkrete Preis-, Paket- und Vertragsdetails werden bewusst persönlich geklärt, weil Datum, Gästezahl und Leistungsrahmen entscheidend sind."
  }
];
