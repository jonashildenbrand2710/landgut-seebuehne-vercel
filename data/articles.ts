export type Article = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  pillar: string;
  intro: string;
  sections: { title: string; body: string; bullets?: string[] }[];
  faq: { question: string; answer: string }[];
};

export const articles: Article[] = [
  {
    slug: "hochzeitslocation-besichtigen-fragen",
    title: "Hochzeitslocation besichtigen: Fragen, die Paare wirklich stellen sollten",
    metaTitle: "Hochzeitslocation besichtigen: wichtige Fragen",
    description:
      "Welche Fragen sollten Paare einer Hochzeitslocation stellen? Diese Punkte helfen euch, Ablauf, Plan B, Betreuung und Atmosphäre besser einzuschätzen.",
    pillar: "Location-Entscheidung",
    intro:
      "Eine Hochzeitslocation sieht auf Bildern oft schnell vielversprechend aus. Ob sie wirklich zu euch passt, zeigt sich aber an einer anderen Frage: Wie funktioniert euer Hochzeitstag an diesem Ort?",
    sections: [
      {
        title: "Denkt nicht nur an den Raum, sondern an den ganzen Tag",
        body:
          "Eine gute Location trägt nicht nur Dinner und Party. Sie gibt Orientierung beim Ankommen, bei der Trauung, beim Empfang, bei Fotos und bei allen Übergängen dazwischen.",
        bullets: [
          "Findet an eurem Datum nur eure Feier statt?",
          "Wo liegen Trauung, Empfang, Dinner und Party?",
          "Sind die Wege für Gäste logisch und angenehm?"
        ]
      },
      {
        title: "Fragt früh nach Wetter, Betreuung und Plan B",
        body:
          "Gerade bei naturnahen Hochzeiten ist ein guter Plan B Teil der eigentlichen Planung. Das nimmt dem Outdoor-Wunsch nicht die Romantik, sondern gibt ihm Halt.",
        bullets: [
          "Wo findet die Trauung bei Regen statt?",
          "Wer trifft die Wetterentscheidung?",
          "Wer ist am Hochzeitstag verantwortlich vor Ort?"
        ]
      },
      {
        title: "Vergleicht Leistungen, nicht einzelne Zahlen",
        body:
          "Budgetfragen sind wichtig. Sinnvoll werden sie aber erst, wenn ihr versteht, welche Nutzung, Betreuung, Zeiten, Ausstattung und Leistungen wirklich im Rahmen enthalten sind."
      }
    ],
    faq: [
      {
        question: "Sollten wir vor der Besichtigung schon Fragen vorbereiten?",
        answer:
          "Ja. Nicht, um die Location abzuprüfen, sondern um herauszufinden, ob der Ort euren Ablauf, eure Gäste und euer Sicherheitsgefühl tragen kann."
      },
      {
        question: "Welche Frage ist besonders wichtig?",
        answer:
          "Fragt euch, ob ihr euch dort nicht nur schöne Momente, sondern einen ganzen gut geführten Hochzeitstag vorstellen könnt."
      }
    ]
  },
  {
    slug: "freie-trauung-am-see",
    title: "Freie Trauung am See: Was romantisch klingt und praktisch geplant werden muss",
    metaTitle: "Freie Trauung am See: worauf achten?",
    description:
      "Eine freie Trauung am See braucht mehr als eine schöne Kulisse. Worauf ihr bei Wetter, Wegen, Akustik, Gästen, Ablauf und Plan B achten solltet.",
    pillar: "Hochzeit in der Natur",
    intro:
      "Eine freie Trauung am See kann ein sehr besonderer Moment sein. Damit sie leicht wirkt, muss im Hintergrund einiges gut geplant sein: Wege, Akustik, Licht, Wetter und der Übergang zum Empfang.",
    sections: [
      {
        title: "Der Trauplatz ist mehr als ein schöner Blick",
        body:
          "Ein guter Trauplatz braucht eine klare Blickachse, genug Raum für Paar, Redner, Musik und Fotografie, passende Wege und eine Lösung für Technik und Ton.",
        bullets: ["Blick und Ruhe", "Sitzplätze und Schatten", "Strom, Mikrofon und Musik"]
      },
      {
        title: "Draußen klingt und fühlt sich alles anders an",
        body:
          "Wind, Sonne, Schatten und offene Flächen verändern eine Zeremonie. Deshalb lohnt es sich, Uhrzeit, Gästekomfort und Akustik nicht erst kurz vor der Hochzeit zu klären."
      },
      {
        title: "Ein guter Plan B schützt die Vorfreude",
        body:
          "Der Plan B ist nicht das Gegenteil von Romantik. Er sorgt dafür, dass ihr euch auf die Trauung am See freuen könnt, ohne das Wetter ständig als Unsicherheit im Kopf zu haben."
      }
    ],
    faq: [
      {
        question: "Braucht jede freie Trauung im Freien ein Mikrofon?",
        answer:
          "Nicht jede kleine Runde braucht viel Technik. Bei größeren Gesellschaften und persönlichen Eheversprechen ist gute Akustik aber sehr wichtig."
      },
      {
        question: "Wann sollte der Plan B feststehen?",
        answer:
          "Er sollte früh mitgedacht werden. Am Hochzeitstag sollte nur noch entschieden werden müssen, welche vorbereitete Variante genutzt wird."
      }
    ]
  }
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
