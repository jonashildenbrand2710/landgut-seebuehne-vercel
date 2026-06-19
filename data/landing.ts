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
  points: string[];
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
    kicker: "Klein und bewusst",
    text: "Für Paare, die eine intime Feier mit Seegefühl, gutem Ablauf und persönlicher Nähe suchen.",
    points: ["kleinere Gesellschaft", "klarer Tagesrahmen", "viel Raum für persönliche Momente"]
  },
  {
    title: "Classic Wedding",
    kicker: "Der stimmige Hochzeitstag",
    text: "Für Paare, die Trauung, Empfang, Dinner und Feier an einem zusammenhängenden Ort erleben möchten.",
    points: ["Trauung und Feier vor Ort", "private Location-Nutzung", "Planung mit Orientierung"]
  },
  {
    title: "Signature Wedding",
    kicker: "Mehr Begleitung, mehr Erlebnis",
    text: "Für Hochzeiten, bei denen Atmosphäre, Komfort, Gästeerlebnis und Ablauf besonders rund greifen sollen.",
    points: ["hochwertiger Gesamtauftritt", "starke Außen- und Innenbereiche", "intensive Abstimmung"]
  }
] satisfies LandingBundle[];

export const landingTestimonials = [
  {
    quote:
      "Die Planung war stressfrei, weil wir früh wussten, welche Fragen wichtig sind und wer am Tag selbst den Überblick behält.",
    name: "Paarstimme",
    context: "Planung und Betreuung"
  },
  {
    quote:
      "Der Ort hatte diesen besonderen Seeblick, aber noch wichtiger war, dass der ganze Ablauf zusammengepasst hat.",
    name: "Paarstimme",
    context: "Location und Tagesgefühl"
  },
  {
    quote:
      "Vom ersten Gespräch bis zur Besichtigung war klar, welche nächsten Schritte sinnvoll sind.",
    name: "Paarstimme",
    context: "Erstgespräch und Besichtigung"
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
