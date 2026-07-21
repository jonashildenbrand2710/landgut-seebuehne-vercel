export const dornroseChapters = [
  {
    number: "I",
    id: "vision",
    eyebrow: "Der erste Blick",
    title: "Euer Märchen beginnt am Wasser",
    text: "Eine Vision, die nicht verkleidet wirkt: echt, naturverbunden und mit genau jener leisen Magie, die lange nachklingt."
  },
  {
    number: "II",
    id: "ort",
    eyebrow: "Das Landgut",
    title: "Ein Ort mit vielen kleinen Welten",
    text: "See, Landhaus, Seeterrasse und Gästehäuser liegen nah beieinander und geben eurem Tag einen natürlichen Rhythmus."
  },
  {
    number: "III",
    id: "tag",
    eyebrow: "Euer Fest",
    title: "Vom Ja-Wort bis zum letzten Tanz",
    text: "Jeder Abschnitt bekommt Raum. Ihr und eure Gäste könnt ankommen, feiern und den Augenblick wirklich erleben."
  },
  {
    number: "IV",
    id: "kennenlernen",
    eyebrow: "Der nächste Schritt",
    title: "Aus einer Idee wird euer Tag",
    text: "Ein erstes Gespräch schafft Klarheit und zeigt, ob sich eure Wünsche an der Seebühne zuhause anfühlen."
  }
] as const;

export const dornroseFacts = [
  {
    value: "1",
    label: "Hochzeit. Ganz für euch.",
    text: "Das Landgut gehört an eurem Hochzeitstag ganz eurer Gesellschaft."
  },
  {
    value: "Märchen",
    label: "Persönlich begleitet",
    text: "Eine erfahrene Crew gibt euren Ideen Raum und kümmert sich sichtbar um euren Tag."
  },
  {
    value: "am",
    label: "Ort kurzer Wege",
    text: "Trauplatz, Landhaus, Terrasse und Gästezimmer liegen nah beieinander und verbinden alle Momente."
  },
  {
    value: "See.",
    label: "Als stiller Mittelpunkt",
    text: "Vom Ja-Wort bis zu den Paarfotos bleibt das Wasser Teil eurer Geschichte."
  }
] as const;

export const dornroseTimeline = [
  { time: "13:00", title: "Ankommen", text: "Die ersten Gäste treffen ein und entdecken das Gelände am See." },
  { time: "14:00", title: "Das Ja-Wort", text: "Freie Trauung am Wasser, gerahmt von Grün und euren Lieblingsmenschen." },
  { time: "14:45", title: "Auf euch", text: "Sektempfang, Fingerfood und Zeit für die ersten Umarmungen." },
  { time: "15:30", title: "Kaffee & Torte", text: "Ein süßer Zwischenakt auf der Seeterrasse oder im Landhaus." },
  { time: "17:00", title: "Augenblicke", text: "Paarfotos am Steg, während eure Gäste den Ort genießen." },
  { time: "19:00", title: "Gemeinsam tafeln", text: "Dinner, Geschichten und lange Gespräche im Landhaus." },
  { time: "22:00", title: "Die Nacht gehört euch", text: "Eröffnungstanz, Musik und ein Fest ohne künstlichen Schlussakkord." },
  { time: "00:00", title: "Mitternachtsmoment", text: "Noch einmal zusammenkommen, stärken und weiterfeiern." }
] as const;

export const dornroseMapLegend = [
  ["1", "Empfang & Ankommen"],
  ["2", "Landhaus"],
  ["3", "Brunnenhaus"],
  ["4–5", "Gästehäuser"],
  ["6", "Heuwiesen"],
  ["7", "Marktplatz"],
  ["8", "Seeterrasse"],
  ["9", "Getränkebar"],
  ["10–12", "Gartenhäuser & Rückzugsorte"]
] as const;

export const dornroseFaqs = [
  {
    question: "Feiert an diesem Tag noch eine zweite Gesellschaft?",
    answer: "Nein. Pro Tag findet auf dem Landgut nur eine Hochzeit statt. So bleibt der Ort privat und euer Ablauf kann sich frei entfalten."
  },
  {
    question: "Können wir die Seebühne vorab kennenlernen?",
    answer: "Ja. In einem ersten Gespräch klären wir eure wichtigsten Eckpunkte. Wenn der Rahmen passt, folgt die persönliche Besichtigung."
  },
  {
    question: "Müssen unsere Gäste auf dem Gelände übernachten?",
    answer: "Nein. Die Gästehäuser sind eine komfortable Möglichkeit, aber keine Pflicht. Welche Zimmer zu eurem Fest passen, besprecht ihr individuell mit dem Team."
  },
  {
    question: "Wann werden Ablauf und Ausstattung konkret?",
    answer: "Die großen Leitplanken entstehen früh. Details wie Tischplan, Speisen und Tagesablauf werden rechtzeitig vor der Hochzeit gemeinsam verfeinert."
  },
  {
    question: "Was ist bei Essen und Torte möglich?",
    answer: "Besondere Ernährungswünsche werden frühzeitig abgestimmt. Auch eure Vorstellungen für Torte, Dessert und Mitternachtsmoment finden im Planungsgespräch ihren Platz."
  },
  {
    question: "Dürfen Hunde dabei sein?",
    answer: "Vierbeinige Familienmitglieder sind grundsätzlich willkommen. Die konkreten Rahmenbedingungen klärt ihr passend zu eurem Tagesablauf."
  }
] as const;

export const dornroseImageRules = [
  "Teamfotos werden vollständig gezeigt – niemand fällt einem responsiven Ausschnitt zum Opfer.",
  "Paarmotive mit sichtbarer Mimik bleiben frei von Texttafeln und Bedienelementen.",
  "Aquarell rahmt Orientierung und Planung; echte Emotionen bleiben echte Fotografie."
] as const;
