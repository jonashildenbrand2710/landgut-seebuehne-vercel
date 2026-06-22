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
  context?: string;
};

export type LandingWarning = {
  title: string;
  subtitle: string;
  question: string;
  bullets: string[];
  resultLabel: string;
  result: string;
};

export type LandingSolution = {
  title: string;
  text: string;
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
  title: "Die perfekte Kulisse für eure Traumhochzeit",
  text: "Sichert euch jetzt exklusive Infos und Termine, bevor sie vergeben sind.",
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
    text: "Unsere One-Wedding-Policy: Eine Hochzeit pro Tag, 100% Aufmerksamkeit"
  },
  {
    number: "2",
    title: "Digitale Betreuung",
    text: "Moderne Planung trifft traditionelle Hochzeitsexpertise - Unser Wedding Consulting Service"
  },
  {
    number: "3",
    title: "Individualität",
    text: "Maßgeschneiderte Konzepte statt vorgefertigter Hochzeitspakete"
  },
  {
    number: "4",
    title: "Naturkulisse mit Sicherheit",
    text: "Idyllischer See und 8.000 qm Park - mit Plan B bei jedem Wetter"
  },
  {
    number: "5",
    title: "Nachhaltigkeit",
    text: "Regionale Partner und umweltbewusste Umsetzung ohne Kompromisse"
  },
  {
    number: "6",
    title: "Preise ohne Überraschungen",
    text: "Klare Pauschalen für Getränke und Service – transparent und fair"
  }
] satisfies LandingPromise[];

export const landingBundles = [
  {
    title: "Tiny Wedding",
    kicker: "Klein, aber oho – für eure 15-35 liebsten Menschen",
    text: "Qualität statt Quantität (Sonntags-Donnerstags buchbar)",
    points: [
      "Privater Seezugang - nur für eure kleine Gruppe",
      "Spontan umsetzbar - auch kurzfristig planbar",
      "Authentische Momente - echte Nähe statt Massenabfertigung",
      "… und vieles mehr für euren perfekten Tag"
    ],
    cta: "Preise & Details anfragen"
  },
  {
    title: "Classic Wedding",
    kicker: "Stilvoll feiern mit intelligentem Preiskonzept",
    text: "Komplett für euch allein (Sonntags-Donnerstags buchbar)",
    points: [
      "Eigener Gartenbereich - mit Seeblick",
      "Professionelles Team für reibungslosen Ablauf",
      "Übernachtungsmöglichkeiten - für Gäste zum Vorzugspreis",
      "… und vieles mehr für euren perfekten Tag"
    ],
    cta: "Preise & Details anfragen"
  },
  {
    title: "Signature Wedding",
    kicker: "Kompromisslos einzigartig",
    badge: "Besonders beliebt!",
    text: "Prime Wochenend-Termine",
    points: [
      "Alles In 'Classic Wedding' – plus:",
      "Freie Trauung am See - für euren großen Moment",
      "VIP-Betreuung während der gesamten Planungsphase",
      "Gratis Hochzeitssuite komfortable Übernachtung direkt vor Ort",
      "… und vieles mehr für euren perfekten Tag"
    ],
    cta: "Preise & Details anfragen"
  }
] satisfies LandingBundle[];

export const landingFamily = {
  eyebrow: "FAMILIEN-unternehmen",
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
        "Die Seebühne ist mehr als eine Location – sie ist ein Ort, an dem eure Hochzeitsträume Wirklichkeit werden. Hier verschmelzen Tradition und Innovation zu einem Erlebnis, das sich anfühlt wie nach Hause kommen."
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

export const landingTestimonials: LandingTestimonial[] = [
  {
    quote:
      "Wir haben unsere Hochzeit mit freier Trauung an der Seebühne gehabt und waren begeistert. Ein besonderer, magischer Ort mit einem Personal, das sich am Ende für uns wie Familie anfühlte und einem so herzlichen Service. Eine Location, die es so nirgendwo anders gibt. Wir haben uns rundum wohlgefühlt und würden jedem Brautpaar die Seebühne wärmstens empfehlen. Vor allem, wenn man eine Gartenhochzeit mit Seeblick haben möchte. :) Danke liebes Seebühnen-Team für all eure Mühen, ihr seid wirklich etwas Besonderes!",
    name: "Justine R."
  },
  {
    quote:
      "Hatte mein Hochzeitsfeier hier. Das Team war super! freundlich, professionell, und alles was Paare braucht, um eine schöne Hochzeit zu haben. Location ist sehr schön und romantisch. Alle Gäste hatten auch sehr tolle Zeit bei der Zeremonie und Party. Ganz lieben Dank an Christina und ihr Team!",
    name: "Clara Marianna"
  },
  {
    quote:
      "Eine romantische Oase mit herrlichem Garten, einem Weiher und einer liebevoll gestalteten Feierlocation. Wer das gewisse Etwas sucht ist hier genau richtig. Begleite immer wieder gerne Brautpaare als Hochzeitsrednerin und genieße die außergewöhnliche Atmosphäre. Man spürt erfrischende Leichtigkeit, Herzlichkeit und Professionalität zugleich. Tolles Team!",
    name: "Sabine Krause"
  }
];

export const landingProblemSigns = {
  eyebrow: "Warnsignale",
  title: "8 bittere Wahrheiten über Hochzeitslocations, die niemand ausspricht",
  text:
    "Was euch bei typischen Locations wirklich erwartet – und warum es euch betrifft",
  cta: "Jetzt Preise & Details anfragen",
  items: [
    {
      title: "Die Fließband-Hochzeit",
      subtitle: "Mehrere Hochzeiten parallel - besonders in Hotels & Eventlocations",
      question: "\"Teilen wir unseren besonderen Tag mit fremden Gästen?\"",
      bullets: [
        "Geteilte Foyers, Parkplätze und Toilettenanlagen",
        "Akustische Überschneidungen zwischen Veranstaltungsräumen",
        "Hochzeitsgäste verirren sich in die falsche Feier"
      ],
      resultLabel: "Das Gefühl:",
      result: "Statt exklusiver Mittelpunkt zu sein, seid ihr nur einer von vielen Terminen im Kalender."
    },
    {
      title: "\"Exklusiv\" nur auf dem Papier",
      subtitle: "\"Exklusiv\" bedeutet bei Schlössern & Gutshöfen oft nur \"separater Raum\"",
      question: "\"Warum laufen fremde Menschen durch unsere Hochzeitsfotos?\"",
      bullets: [
        "Öffentliche Bereiche bleiben für andere zugänglich",
        "Touristen und andere Gäste als ständige Zuschauer",
        "Begrenzte Nutzungsrechte trotz hoher Kosten"
      ],
      resultLabel: "Die Realität:",
      result: "Trotz Premium-Preisen gehört euch der Ort nie wirklich ganz allein."
    },
    {
      title: "Die Fotofalle",
      subtitle: "Besonders bei beliebten Instagram-Locations",
      question: "\"Wir haben nur 15 Minuten für Fotos am See/Weinberg/Schlossturm?\"",
      bullets: [
        "Zeitlich begrenzte Slots für die besten Fotospots",
        "Lange Warteschlangen mit anderen Hochzeitspaaren",
        "Bildmotive, die bei hunderten anderen Paaren identisch aussehen"
      ],
      resultLabel: "Die Ernüchterung:",
      result: "Eure teuren Hochzeitsfotos sehen genauso aus wie die aller anderen Paare vor euch."
    },
    {
      title: "Die Design-Einschränkungen",
      subtitle: "Historische Locations & traditionelle Landgasthöfe",
      question: "\"Warum dürfen wir hier nichts verändern?\"",
      bullets: [
        "Strikte Vorgaben bei Dekoration und Raumgestaltung",
        "Verbot von Kerzen, Hängedekoration oder Blütenblättern",
        "Vorhandene Möbel und Farben bestimmen euren gesamten Look"
      ],
      resultLabel: "Die Frustration:",
      result: "Eure persönliche Vision muss hinter den Hausregeln zurückstehen."
    },
    {
      title: "Die Wetter-Katastrophe",
      subtitle: "Landgasthöfe & Locations ohne durchdachten Plan B",
      question: "\"Was passiert bei Regen mit unserer Gartenhochzeit?\"",
      bullets: [
        "Improvisierte Indoor-Alternativen in unpassenden Räumen",
        "Kurzfristige Umplanung mit hohem Stressfaktor",
        "Aufpreis für Zelte und Überdachungen, die den Look ruinieren"
      ],
      resultLabel: "Die Angst:",
      result: "Ihr verbringt Wochen damit, Wettervorhersagen zu checken, statt euch auf die Vorfreude zu konzentrieren."
    },
    {
      title: "Die versteckten Extrakosten",
      subtitle: "Besonders bei Premium-Locations & Schlössern",
      question: "\"Warum ist plötzlich alles extra zu bezahlen?\"",
      bullets: [
        "Grundpreis deckt nur das absolute Minimum ab",
        "Jede Kleinigkeit (Licht, Ton, Bestuhlung) wird separat berechnet",
        "Zwang zu überteuerten Haus-Caterern ohne Alternativen"
      ],
      resultLabel: "Das Ergebnis:",
      result: "Die anfangs kalkulierten Kosten verdoppeln sich durch unerwartete Zusatzgebühren."
    },
    {
      title: "Die wechselnden Ansprechpartner",
      subtitle: "Hotels & große Veranstaltungszentren mit Personalmangel",
      question: "\"Mit wem sprechen wir eigentlich gerade?\"",
      bullets: [
        "Bei jedem Termin ein anderer Mitarbeiter",
        "Euer Wissen geht bei der Personalübergabe verloren",
        "Am Hochzeitstag betreut euch jemand, den ihr noch nie gesehen habt"
      ],
      resultLabel: "Die Enttäuschung:",
      result: "Ihr beginnt jeden Termin bei Null und müsst eure Wünsche immer wieder erklären."
    },
    {
      title: "Die Service-Monotonie",
      subtitle: "All-inclusive-Pakete in Eventhotels",
      question: "\"Warum schmeckt das Essen wie bei jeder anderen Hochzeit?\"",
      bullets: [
        "Standardisierte Menüs ohne Individualität",
        "Eingeschränkte Auswahl an Getränken",
        "Routinierter Service ohne persönliche Note"
      ],
      resultLabel: "Der Frust:",
      result: "Ihr zahlt Premium-Preise für eine Massenabfertigung mit Hotelrestaurant-Charakter."
    }
  ] satisfies LandingWarning[]
};

export const landingAdvantages = [
  {
    title: "Echte Exklusivität statt Fließband",
    text: "Bei uns bedeutet exklusiv wirklich exklusiv"
  },
  {
    title: "Garantiert 100% privat",
    text: "Kompromisslose Exklusivität bei Park-Ambiente"
  },
  {
    title: "Ein fester Ansprechpartner",
    text: "Kontinuität von der Planung bis zur Feier"
  },
  {
    title: "Perfekte Fotos - überall",
    text: "Unbegrenzte Fotomöglichkeiten ohne Zeitdruck"
  },
  {
    title: "Kreative Freiheit",
    text: "Gestaltet euren Tag nach euren Vorstellungen"
  },
  {
    title: "Wettersichere Planung",
    text: "Perfekt vorbereitet für jedes Wetter"
  },
  {
    title: "Transparente Preisgestaltung",
    text: "Keine versteckten Kosten oder Überraschungen"
  },
  {
    title: "Individueller Premium-Service",
    text: "Persönlich statt standardisiert"
  }
] satisfies LandingSolution[];

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
