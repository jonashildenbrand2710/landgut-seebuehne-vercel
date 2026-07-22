export type HochzeitsmappeConcept = {
  id: "dornrose" | "seeufer" | "editorial";
  number: string;
  title: string;
  shortTitle: string;
  verdict: string;
  description: string;
  art: string;
  palette: Array<{ name: string; value: string }>;
  coverEyebrow: string;
  coverTitle: string;
  coverSubtitle: string;
  chapterLabel: string;
  chapterTitle: string;
  chapterLead: string;
  chapterBody: string;
  quote: string;
  mapTitle: string;
  seatingTitle: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaBody: string;
};

export const hochzeitsmappeConcepts: HochzeitsmappeConcept[] = [
  {
    id: "dornrose",
    number: "A",
    title: "Dornrose am See",
    shortTitle: "Dornrose",
    verdict: "Unsere Empfehlung",
    description:
      "Die märchenhafteste Richtung: feine Rosenranken, Weiden und See-Aquarelle rahmen echte Fotografie. Romantisch, aber durch klare Typografie und viel Weißraum erwachsen gehalten.",
    art: "/images/hochzeitsmappe-concepts/dornrose-rahmen.webp",
    palette: [
      { name: "Perlweiß", value: "#fbfaf6" },
      { name: "Seeblau", value: "#a9c4ca" },
      { name: "Salbei", value: "#aebba8" },
      { name: "Altrosa", value: "#d8b8bc" }
    ],
    coverEyebrow: "Der Hochzeitsbegleiter vom Landgut Seebühne",
    coverTitle: "Ein Ort für euer eigenes Märchen",
    coverSubtitle: "Leicht geplant, klar erlebt, für immer erinnert",
    chapterLabel: "Erstes Kapitel · Ankommen",
    chapterTitle: "Wo die Zeit für einen Tag stillsteht",
    chapterLead:
      "Hinter alten Bäumen und sanften Weiden öffnet sich ein Ort, an dem aus Vorfreude Erinnerung wird.",
    chapterBody:
      "Der See begleitet euren Tag wie ein stiller roter Faden: beim ersten Blick, während der Trauung und bis zu den letzten Lichtern am Ufer. Diese Mappe führt euch Schritt für Schritt durch alle Möglichkeiten – poetisch im Gefühl, klar in jeder Entscheidung.",
    quote: "Nicht das Märchen ist vorgegeben. Nur der Ort, an dem eures beginnen kann.",
    mapTitle: "Euer Weg durch den Hochzeitstag",
    seatingTitle: "Ein Fest, das zu euren Menschen passt",
    ctaEyebrow: "Euer nächstes Kapitel",
    ctaTitle: "Seht den Ort, an dem eure Geschichte Form annimmt.",
    ctaBody:
      "Im persönlichen Kennenlerngespräch sortieren wir Datum, Gästezahl und eure wichtigsten Wünsche."
  },
  {
    id: "seeufer",
    number: "B",
    title: "Das verwunschene Ufer",
    shortTitle: "Seeufer",
    verdict: "Leicht & emotional",
    description:
      "Der See wird zum Hauptmotiv. Wasser, Spiegelungen, Schilf und Weiden schaffen eine luftige, junge Ästhetik. Die Märchenanalogie bleibt besonders subtil.",
    art: "/images/hochzeitsmappe-concepts/seeufer-rahmen.webp",
    palette: [
      { name: "Lichtweiß", value: "#fbfcfa" },
      { name: "Morgenblau", value: "#a8c8d5" },
      { name: "Eukalyptus", value: "#b9c6b7" },
      { name: "Blütenrosa", value: "#e5cdca" }
    ],
    coverEyebrow: "Euer Guide für eine Hochzeit am Wasser",
    coverTitle: "Wenn der See eure Geschichte spiegelt",
    coverSubtitle: "Ein stiller Begleiter für euren großen Tag",
    chapterLabel: "Kapitel eins · Am Ufer",
    chapterTitle: "Manche Orte muss man nicht suchen. Man spürt sie.",
    chapterLead:
      "Das Licht in den Weiden, die Ruhe auf dem Wasser und dieses Gefühl, angekommen zu sein.",
    chapterBody:
      "Vom Getting Ready bis zum Frühstück am nächsten Morgen bleibt alles an einem Ort. Der Guide zeigt euch die Wege dazwischen und macht aus vielen einzelnen Fragen ein ruhiges, gut planbares Ganzes.",
    quote: "Der See ist keine Kulisse. Er ist die leise Stimmung, die den ganzen Tag trägt.",
    mapTitle: "Ein Ort, viele Augenblicke",
    seatingTitle: "So findet euer Fest seinen Rhythmus",
    ctaEyebrow: "Den See selbst erleben",
    ctaTitle: "Aus einem schönen Bild darf ein echtes Gefühl werden.",
    ctaBody:
      "Lernt uns kennen und findet gemeinsam heraus, ob die Seebühne zu eurem Tag passt."
  },
  {
    id: "editorial",
    number: "C",
    title: "Das neue Kapitel",
    shortTitle: "Editorial",
    verdict: "Modern & luxuriös",
    description:
      "Die reduzierteste Richtung: große Editorial-Typografie, botanische Stiche und einzelne Aquarellflächen. Ideal, wenn Märchen nur als kluger Subtext spürbar sein soll.",
    art: "/images/hochzeitsmappe-concepts/editorial-rahmen.webp",
    palette: [
      { name: "Warmweiß", value: "#faf9f5" },
      { name: "Mauve", value: "#cfc4cf" },
      { name: "Steinsalbei", value: "#b8c0b3" },
      { name: "Nebelblau", value: "#b7c9d0" }
    ],
    coverEyebrow: "Landgut Seebühne · Hochzeitsguide 2026",
    coverTitle: "Euer Tag. Euer Ort. Euer neues Kapitel.",
    coverSubtitle: "Klar geplant. Leicht erlebt. Für immer erinnert.",
    chapterLabel: "01 · Die Vision",
    chapterTitle: "Kein Märchen nach Vorlage.",
    chapterLead:
      "Sondern eine Hochzeit, die sich vom ersten Moment an nach euch anfühlt.",
    chapterBody:
      "Diese Mappe verbindet Inspiration mit Orientierung. Ihr entdeckt die Räume, den See, mögliche Tagesabläufe und die Antworten, die euch vor einer Besichtigung wirklich weiterhelfen.",
    quote: "Die schönste Form von Luxus: ein Ort, der für einen Tag nur euch gehört.",
    mapTitle: "Die Seebühne auf einen Blick",
    seatingTitle: "Raum für Nähe, Genuss und eine lange Nacht",
    ctaEyebrow: "Der nächste Schritt",
    ctaTitle: "Bringt eure Idee mit. Wir geben ihr einen Ort.",
    ctaBody:
      "Ein Kennenlerngespräch schafft Klarheit – persönlich, unverbindlich und mit Blick auf euren Wunschtermin."
  }
];
