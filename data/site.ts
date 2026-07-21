function publicBookingUrl(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();

  if (!trimmed || trimmed.includes("kennenlernen.landgut-seebuehne.de")) {
    return fallback;
  }

  return trimmed;
}

export const siteConfig = {
  name: "Landgut Seebuehne",
  displayName: "Landgut Seebühne",
  domain: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.landgut-seebuehne.de").replace(/\/$/, ""),
  email: "mail@landgut-seebuehne.de",
  phone: "09163 - 1455",
  phoneInternational: "+4991631455",
  address: {
    legal: "Hauptstraße 32, 91487 Vestenbergsgreuth",
    streetAddress: "Hauptstraße 32",
    postalCode: "91487",
    addressLocality: "Vestenbergsgreuth",
    addressCountry: "DE",
    publicRegion: "Vestenbergsgreuth / Mittelfranken / Franken"
  },
  bookingUrl: publicBookingUrl(process.env.NEXT_PUBLIC_BOOKING_URL, "/termin-buchen"),
  alternateBookingUrl: publicBookingUrl(process.env.NEXT_PUBLIC_ALT_BOOKING_URL, "/besichtigungstermin-buchen"),
  brand: {
    logo: {
      src: "/images/brand/landgut-seebuehne-logo.svg",
      alt: "Landgut Seebühne",
      width: 526,
      height: 128
    },
    logoLight: {
      src: "/images/brand/landgut-seebuehne-logo-light.svg",
      alt: "Landgut Seebühne",
      width: 526,
      height: 128
    }
  }
} as const;

export const imageLibrary = {
  hero: {
    src: "/images/site/hero-brautpaar-steg-am-see.jpg",
    alt: "Brautpaar mit Schirm auf einem Holzsteg am See des Landgut Seebühne"
  },
  coupleFence: {
    src: "/images/site/brautpaar-am-seeufer.jpg",
    alt: "Brautpaar am Seeufer des Landgut Seebühne"
  },
  coupleDock: {
    src: "/images/site/brautpaar-holzsteg-see-gruen.jpg",
    alt: "Brautpaar auf einem Holzsteg am See des Landgut Seebühne mit viel Grün"
  },
  lake: {
    src: "/images/site/seeblick-aussenbereich.jpg",
    alt: "Seeblick und Außenbereich des Landgut Seebühne"
  },
  mappeCover: {
    src: "/images/site/hochzeitsmappe-cover.jpg",
    alt: "Cover der Hochzeitsmappe des Landgut Seebühne"
  },
  availability: {
    src: "/images/site/hero-brautpaar-steg-am-see.jpg",
    alt: "Brautpaar mit Schirm auf einem Steg am See des Landgut Seebühne"
  },
  ceremony: {
    src: "/images/site/freie-trauung-am-see.jpg",
    alt: "Freie Trauung im Grünen am See"
  },
  location: {
    src: "/images/site/festsaal-landgut-seebuehne.jpg",
    alt: "Festlich gedeckter Innenraum des Landgut Seebühne"
  },
  gettingReady: {
    src: "/images/site/getting-ready-braut.jpg",
    alt: "Braut beim Getting Ready mit Blumenstrauß"
  },
  team: {
    src: "/images/site/team-landgut-seebuehne.jpg",
    alt: "Team und Gastgeber des Landgut Seebühne"
  },
  teamChristine: {
    src: "/images/site/christine-hildenbrand.jpg",
    alt: "Christine Hildenbrand vom Landgut Seebühne"
  },
  teamJonas: {
    src: "/images/site/jonas-hildenbrand.jpg",
    alt: "Jonas Hildenbrand vom Landgut Seebühne"
  },
  teamJohanna: {
    src: "/images/site/johanna-protze.jpg",
    alt: "Johanna Protze vom Landgut Seebühne"
  },
  teamOliver: {
    src: "/images/site/team-landgut-seebuehne.jpg",
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
  title: "Hochzeitslocation am See in Mittelfranken",
  description:
    "Landgut Seebühne: exklusive Hochzeitslocation am See in Mittelfranken. Natürlich heiraten zwischen Wiesen, Wald und See - persönlich begleitet.",
  heroEyebrow: "Exklusive Location in Mittelfranken",
  heroTitle: "Natürlich heiraten inmitten von Wiesen, Wald und See",
  heroText: "Genießt sorgenfrei - eure Traumhochzeit ist in besten Händen.",
  imageKey: "hero",
  primaryCta: "Besichtigungstermin buchen",
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
      title: "Direkt besichtigen und den Ort erleben",
      text:
        "Der beste Start ist eine persönliche Besichtigung vor Ort. Wählt dafür direkt einen freien Termin in unserem Kalender. Beim Rundgang erlebt ihr das Landgut und wir klären eure wichtigsten Fragen zu Datum, Gästezahl und Tagesablauf."
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
        "Ja. Ihr könnt direkt einen freien Besichtigungstermin in unserem Kalender auswählen. Mit wenigen Angaben zu eurer Hochzeit können wir euren Besuch passend vorbereiten."
    },
    {
      question: "Warum nennt die Website keine Preise?",
      answer:
        "Der konkrete Rahmen hängt von Datum, Gästezahl und Vorstellungen ab. Deshalb klären wir Leistungen und Möglichkeiten persönlich bei der Besichtigung, statt öffentliche Pauschalaussagen zu machen."
    }
  ]
} satisfies SitePage;

export const sitePages: SitePage[] = [
  {
    slug: "trauung",
    navTitle: "Trauung",
    title: "Freie Trauung am See in Mittelfranken",
    description:
      "Freie Trauung am See in Mittelfranken: Was am Landgut Seebühne emotional wirkt und organisatorisch gut geplant wird.",
    heroEyebrow: "Trauung am Wasser",
    heroTitle: "Freie Trauung am See in Mittelfranken - mit Atmosphäre und gutem Plan.",
    heroText:
      "Der See ist ein besonderer Mittelpunkt für euer Ja-Wort. Damit der Moment leicht wirkt, denken wir Wege, Akustik, Licht, Wetter und den Übergang zum Empfang mit.",
    imageKey: "ceremony",
    primaryCta: "Besichtigungstermin buchen",
    secondaryCta: "Hochzeitsmappe ansehen",
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
    title: "Hochzeitslocation in Franken: See, Garten und Landhaus",
    description:
      "See, Garten, Landhaus und Außenbereiche: Das Landgut Seebühne als Hochzeitslocation für einen ganzen Tag in Mittelfranken.",
    heroEyebrow: "Location",
    heroTitle: "Hochzeitslocation am See in Mittelfranken für einen ganzen Hochzeitstag.",
    heroText:
      "Ankommen, Trauung, Empfang, Fotos, Dinner und Party liegen nicht als lose Stationen nebeneinander, sondern bilden einen Tagesablauf mit Orientierung.",
    imageKey: "location",
    primaryCta: "Besichtigungstermin buchen",
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
    heroTitle: "Getting Ready am Landgut Seebühne: ruhiger in den Hochzeitstag starten.",
    heroText:
      "Getting Ready vor Ort kann Wege, Übergaben und Zeitdruck reduzieren. Ihr kommt früher im Gefühl des Tages an und startet nicht aus dem Auto heraus.",
    imageKey: "gettingReady",
    primaryCta: "Besichtigungstermin buchen",
    secondaryCta: "Hochzeitsmappe ansehen",
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
    heroTitle: "Landgut Seebühne ist familiengeführt und persönlich begleitet.",
    heroText:
      "Die Seebühne steht für Gastgebergefühl, Erfahrung und die ruhige Sicherheit, dass ein Hochzeitstag viele schöne und viele praktische Details braucht.",
    imageKey: "team",
    primaryCta: "Besichtigungstermin buchen",
    secondaryCta: "Hochzeitsmappe ansehen",
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
    title: "Hochzeitsmappe",
    description:
      "Persönliche Online-Hochzeitsmappe der Seebühne: Location, Ablauf, Ideen und wichtige Fragen für euren Planungsstart.",
    heroEyebrow: "Hochzeitsmappe",
    heroTitle: "Die Hochzeitsmappe",
    heroText:
      "Euer persönlicher Online-Hochzeitsbegleiter, damit ihr Ort, Ablauf und wichtige Fragen besser einordnen könnt.",
    imageKey: "mappeCover",
    primaryCta: "Hochzeitsmappe sichern",
    secondaryCta: "Besichtigungstermin buchen",
    sections: [
      {
        title: "Für Paare, die sich erst orientieren möchten",
        text:
          "Viele Fragen entstehen erst, wenn man eine Location wirklich mit dem eigenen Datum, der Gästezahl und dem gewünschten Tagesgefühl verbindet. Die Hochzeitsmappe ist dafür ein guter Startpunkt.",
        points: ["Eindruck vom Ort", "Ablauf und Möglichkeiten", "Fragen für eure Besichtigung"]
      }
    ]
  },
  {
    slug: "besichtigung",
    navTitle: "Besichtigung",
    title: "Besichtigungstermin direkt buchen",
    description:
      "Besichtigt das Landgut Seebühne persönlich und bucht euren passenden Termin direkt im Kalender.",
    heroEyebrow: "Besichtigung",
    heroTitle: "Besichtigt das Landgut Seebühne und erlebt euren möglichen Hochzeitsort vor Ort.",
    heroText:
      "Wählt direkt einen freien Termin in unserem Kalender. Beim Rundgang zeigen wir euch See, Garten und Landhaus und nehmen uns Zeit für eure wichtigsten Fragen.",
    imageKey: "location",
    primaryCta: "Besichtigungstermin buchen",
    secondaryCta: "Hochzeitsmappe ansehen",
    sections: [
      {
        title: "Direkt einen passenden Termin wählen",
        text:
          "Über unseren Kalender wählt ihr selbst einen freien Besichtigungstermin. Mit wenigen Angaben zu Datum, Gästezahl und euren Vorstellungen können wir euren Besuch gezielt vorbereiten."
      },
      {
        title: "Was ihr bei der Besichtigung gewinnt",
        text:
          "Ihr erlebt die Atmosphäre vor Ort, seht die Wege zwischen See, Garten und Landhaus und bekommt konkrete Antworten für eure Hochzeitsplanung."
      }
    ]
  },
  {
    slug: "termin-buchen",
    navTitle: "Termin",
    title: "Besichtigungstermin buchen",
    description:
      "Bucht direkt einen freien Besichtigungstermin am Landgut Seebühne und erlebt die Location persönlich.",
    heroEyebrow: "Besichtigung",
    heroTitle: "Besichtigungstermin am Landgut Seebühne direkt im Kalender buchen.",
    heroText:
      "Wählt euren passenden Termin. Mit wenigen Angaben zu eurer Hochzeit können wir die Besichtigung vorbereiten und uns vor Ort Zeit für eure Fragen nehmen.",
    imageKey: "hero",
    primaryCta: "Besichtigungstermin wählen",
    secondaryCta: "Hochzeitsmappe ansehen",
    sections: [
      {
        title: "Was wir für die Besichtigung wissen sollten",
        text:
          "Ihr müsst noch nicht alles wissen. Gästezahl, Wunschjahr und ein Zeitraum zwischen April und Oktober helfen uns, euren Rundgang passend vorzubereiten.",
        points: ["ungefähre Gästezahl", "Wunschjahr", "Zeitraum von April bis Oktober", "optional ein konkreter Wunschtermin"]
      }
    ]
  },
  {
    slug: "kontaktformular",
    title: "Kontakt",
    description:
      "Kontakt zum Landgut Seebühne: Bucht direkt eine Besichtigung und erlebt die Hochzeitslocation persönlich vor Ort.",
    heroEyebrow: "Kontakt",
    heroTitle: "Kontakt zum Landgut Seebühne: Besichtigung direkt buchen.",
    heroText:
      "Der schnellste Weg zum persönlichen Eindruck führt direkt vor Ort: Wählt einen freien Besichtigungstermin im Kalender und bringt eure Fragen einfach mit.",
    imageKey: "lake",
    primaryCta: "Besichtigungstermin buchen",
    sections: [
      {
        title: "Damit wir gut einordnen können, worum es geht",
        text:
          "Hilfreich sind eure ungefähre Gästezahl, das Wunschjahr, ein Zeitraum zwischen April und Oktober und – falls schon vorhanden – ein konkreter Wunschtermin."
      }
    ]
  },
  {
    slug: "formular",
    title: "Besichtigung buchen",
    description:
      "Besichtigung am Landgut Seebühne: freie Zeit wählen, wenige Eckpunkte angeben und Termin direkt im Kalender buchen.",
    heroEyebrow: "Besichtigung",
    heroTitle: "Lernt das Landgut Seebühne bei einer persönlichen Besichtigung kennen.",
    heroText:
      "Wählt direkt einen freien Termin im Kalender. Vor Ort erlebt ihr die Location und könnt eure Fragen persönlich mit uns klären.",
    imageKey: "ceremony",
    primaryCta: "Besichtigungstermin buchen",
    secondaryCta: "Hochzeitsmappe ansehen",
    sections: [
      {
        title: "Was euch erwartet",
        text:
          "Ein persönlicher Rundgang durch See, Garten und Landhaus, konkrete Antworten auf eure Fragen und ein realistischer Eindruck davon, wie sich euer Hochzeitstag bei uns anfühlen könnte.",
        points: ["direkt buchbar", "persönlich vor Ort", "auf eure Eckpunkte bezogen"]
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
          "Oliver und Christine Hildenbrand\nHauptstraße 32\n91487 Vestenbergsgreuth\n\nE-Mail: mail@landgut-seebuehne.de\nWebsite: www.landgut-seebuehne.de\nTel. 09163 - 1455\nFax 09163 - 1476\n\nInhaltlich Verantwortliche: Oliver und Christine Hildenbrand"
      }
    ]
  },
  {
    slug: "datenschutz",
    title: "Datenschutz",
    description: "Datenschutzhinweise des Landgut Seebühne.",
    heroEyebrow: "Datenschutz",
    heroTitle: "Datenschutz",
    heroText:
      "Hinweise dazu, welche Daten beim Besuch dieser Website und bei Anfragen verarbeitet werden.",
    imageKey: "lake",
    sections: [
      {
        title: "Verantwortliche Stelle",
        text:
          "Ferien- und Freizeit am See GbR\nOliver und Christine Hildenbrand\nHauptstraße 32\n91487 Vestenbergsgreuth\n\nE-Mail: mail@landgut-seebuehne.de\nWebsite: www.landgut-seebuehne.de"
      },
      {
        title: "Besuch der Website",
        text:
          "Beim Aufruf dieser Website werden technisch notwendige Daten verarbeitet, damit die Seiten ausgeliefert, stabil betrieben und gegen Missbrauch geschützt werden können. Dazu können IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene URL, Browserinformationen und technische Protokolldaten gehören."
      },
      {
        title: "Hosting und technische Bereitstellung",
        text:
          "Die Website wird bei Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789, USA) gehostet. Beim Hosting werden technische Zugriffs- und Serverdaten verarbeitet, die für Auslieferung, Sicherheit und Fehleranalyse erforderlich sind (Art. 6 Abs. 1 lit. f DSGVO). Vercel kann Daten in den USA verarbeiten; die Übermittlung ist über die EU-Standardvertragsklauseln und die Zertifizierung nach dem EU-US Data Privacy Framework abgesichert."
      },
      {
        title: "Kontakt, Terminbuchung und Bewerbung",
        text:
          "Wenn ihr uns per E-Mail kontaktiert, einen Termin anfragt oder euch bewerbt, verarbeiten wir die von euch angegebenen Kontaktdaten und Nachrichteninhalte, um eure Anfrage zu beantworten und den passenden nächsten Schritt zu organisieren (Art. 6 Abs. 1 lit. b DSGVO). Für den Versand von Anfrage- und Bewerbungs-E-Mails nutzen wir den deutschen Anbieter IONOS SE (Elgendorfer Str. 57, 56410 Montabaur); Terminbuchungen werden mit unserem Kalender- und CRM-System abgeglichen."
      },
      {
        title: "Hochzeitsmappe, CRM und E-Mail-Versand",
        text:
          "Wenn ihr die Hochzeitsmappe anfordert, speichern wir eure Angaben (Name, E-Mail, Telefonnummer) in unserer CRM-Datenbank auf Basis von Supabase, um euren persönlichen Online-Zugang bereitzustellen und eure Anfrage zu begleiten (Art. 6 Abs. 1 lit. b DSGVO).\nFür den Versand des Zugangslinks und darauf bezogene E-Mails nutzen wir ActiveCampaign LLC (1 North Dearborn Street, Chicago, IL 60602, USA). Dabei können Daten in die USA übermittelt werden; die Übermittlung ist über EU-Standardvertragsklauseln abgesichert. Ihr könnt dem Erhalt weiterer E-Mails jederzeit über den Abmeldelink oder per Nachricht an mail@landgut-seebuehne.de widersprechen."
      },
      {
        title: "Meta Pixel und Conversions API (nur mit Einwilligung)",
        text:
          "Nur wenn ihr im Cookie-Banner auf \"Einverstanden\" klickt, laden wir den Meta Pixel der Meta Platforms Ireland Ltd. (Merrion Road, Dublin 4, Irland). Der Pixel setzt Cookies (_fbp, _fbc) und hilft uns, die Wirkung unserer Anzeigen zu messen (Rechtsgrundlage: eure Einwilligung, Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG).\nBei Anfragen über unsere Formulare können zusätzlich über die Meta Conversions API technisch notwendige Ereignisdaten sowie gehashte (verschlüsselt umgewandelte) Kontaktdaten an Meta übertragen werden, um Conversions zuzuordnen. Dabei können Daten in die USA übermittelt werden; Meta ist nach dem EU-US Data Privacy Framework zertifiziert.\nIhr könnt eure Einwilligung jederzeit über den Link \"Cookie-Einstellungen\" im Footer ändern oder widerrufen. Ohne Einwilligung bleibt das Tracking vollständig deaktiviert."
      },
      {
        title: "Speicherdauer",
        text:
          "Wir speichern personenbezogene Daten nur so lange, wie es für die Bearbeitung eurer Anfrage, die Planung eurer Hochzeit oder aufgrund gesetzlicher Aufbewahrungspflichten erforderlich ist. Danach werden die Daten gelöscht."
      },
      {
        title: "Eure Rechte",
        text:
          "Ihr könnt Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch geltend machen sowie erteilte Einwilligungen jederzeit mit Wirkung für die Zukunft widerrufen. Wendet euch dafür bitte an mail@landgut-seebuehne.de.\nIhr habt außerdem das Recht, euch bei einer Datenschutz-Aufsichtsbehörde zu beschweren, zum Beispiel beim Bayerischen Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach."
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
      "Preis- und Verfügbarkeitsfragen zum Landgut Seebühne werden persönlich bei der Besichtigung geklärt.",
    heroEyebrow: "Rahmen und Verfügbarkeit",
    heroTitle: "Den konkreten Rahmen klären wir am besten persönlich.",
    heroText:
      "Welche Leistungen und Möglichkeiten zu eurer Hochzeit passen, hängt von Datum, Gästezahl und Tagesrahmen ab. Deshalb ordnen wir Preis- und Verfügbarkeitsfragen persönlich bei eurer Besichtigung ein.",
    imageKey: "location",
    primaryCta: "Besichtigungstermin buchen",
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
      "Preis- und Paketfragen werden beim Landgut Seebühne nicht öffentlich pauschalisiert, sondern persönlich bei der Besichtigung eingeordnet.",
    heroEyebrow: "Rahmen und Verfügbarkeit",
    heroTitle: "Lasst uns den passenden Rahmen bei eurer Besichtigung sortieren.",
    heroText:
      "Damit ihr keine unvollständigen Einzelzahlen vergleichen müsst, klären wir Leistungen, Datum und Gästezahl persönlich.",
    imageKey: "location",
    primaryCta: "Besichtigungstermin buchen",
    sections: [
      {
        title: "Nächster Schritt",
        text:
          "Bucht direkt eine unverbindliche Besichtigung. Vor Ort lässt sich deutlich besser einordnen, was für eure Hochzeit sinnvoll ist."
      }
    ],
    noindex: true
  },
  {
    slug: "quizz",
    title: "Besichtigung",
    description: "Weiterleitungspunkt für ältere Quiz- oder Funnel-Seiten des Landgut Seebühne.",
    heroEyebrow: "Besichtigung",
    heroTitle: "Der aktuelle Weg startet mit einer persönlichen Besichtigung.",
    heroText:
      "Diese ältere Funnel-Seite wird im Rebuild nicht als öffentliche SEO-Seite geführt. Für Paare ist die direkt buchbare Besichtigung der sinnvollste nächste Schritt.",
    imageKey: "hero",
    primaryCta: "Besichtigungstermin buchen",
    sections: [
      {
        title: "Aktueller Einstieg",
        text:
          "Erlebt den Ort persönlich und klärt bei der Besichtigung, wie Datum, Gästezahl und Vorstellungen zum Landgut Seebühne passen."
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
      "Diese ältere Chatbot-Seite wird nicht als öffentliche SEO-Seite geführt. Für konkrete Hochzeitsfragen bucht bitte direkt eine Besichtigung.",
    imageKey: "lake",
    primaryCta: "Besichtigungstermin buchen",
    sections: [
      {
        title: "Schneller zur passenden Antwort",
        text:
          "Bei der persönlichen Besichtigung lassen sich Datum, Gästezahl, Rahmen und nächste Schritte zuverlässig klären."
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
    primaryCta: "Terminseite öffnen",
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
    primaryCta: "Terminseite öffnen",
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

export const publicSitePageSlugs = [
  "",
  "location",
  "trauung",
  "getting-ready",
  "uber-uns",
  "hochzeitsmappe",
  "besichtigung",
  "termin-buchen",
  "kontaktformular",
  "formular",
  "impressum",
  "datenschutz"
] as const;

export function isPublicSitePageSlug(slug: string) {
  return publicSitePageSlugs.includes(slug as (typeof publicSitePageSlugs)[number]);
}

export function getPageBySlug(slug: string) {
  return sitePages.find((page) => page.slug === slug);
}

export const mainNavigation = [
  { label: "Startseite", href: "/" },
  { label: "Hochzeits-Journal", href: "/hochzeitsratgeber" },
  { label: "Hochzeitsmappe", href: "/hochzeitsmappe" }
];
