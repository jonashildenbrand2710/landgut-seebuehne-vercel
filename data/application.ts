export const applicationFunnel = {
  intro: {
    image: {
      src: "/images/site/bewerbung-team-hands.jpg",
      alt: "Mehrere Hände als Symbol für Teamarbeit"
    },
    title: "Werde Teil eines besonderen Teams – an einem besonderen Ort.",
    text:
      "Wir glauben daran, dass Arbeit mehr sein kann als nur ein Job: Sie kann ein Ort des Wachstums sein – persönlich, menschlich und im Einklang mit unserer Umgebung.",
    note: "Aktuell suchen wir neue Teammitglieder in folgenden Bereichen:",
    cta: "Bewirb dich für unsere freien Stellen!"
  },
  job: {
    image: {
      src: "/images/site/bewerbung-servicekraft.jpg",
      alt: "Servicekraft mit Getränken beim Landgut Seebühne"
    },
    location: "Vestenbergsgreuth, Mittelfranken",
    employer: "Landgut Seebühne",
    title: "Servicekraft (m/w/d) – Hochzeiten auf dem Landgut Seebühne",
    scope: "Mini",
    hours: "5-10h/woche",
    intro:
      "Damit bei unseren Hochzeiten alles läuft, suchen wir Leute, die Bock haben mit anzupacken, im Team Gas zu geben und ein Gefühl dafür haben, wie man Gästen eine richtig gute Zeit macht.",
    qualifications: [
      "Erfahrung im Bereich Hauswirtschaft & Reinigung von Vorteil",
      "Führerschein Klasse B",
      "Liebe zum Detail, hohe Hygienestandards und Zuverlässigkeit"
    ],
    duties: [
      {
        icon: "Megaphone",
        title: "Gäste begeistern",
        text:
          "Du bist mittendrin statt nur dabei. Du sorgst dafür, dass sich unsere Gäste rundum wohlfühlen – vom ersten Getränk bis zur letzten Runde auf der Tanzfläche. Aufmerksam, freundlich und immer einen Schritt voraus."
      },
      {
        icon: "MessageSquareMore",
        title: "Service mit Flow",
        text:
          "Du servierst Getränke und Speisen, behältst den Überblick und hältst den Ablauf am Laufen. Ob Kaffee & Kuchen, Dinner oder Party – du bist Teil eines Teams, das Hand in Hand arbeitet und Events reibungslos macht."
      },
      {
        icon: "Headphones",
        title: "Hinter den Kulissen abliefern",
        text:
          "Du unterstützt beim Aufbau, bei schnellen Umbauten und sorgst dafür, dass alles sauber und vorbereitet ist. Du siehst, was zu tun ist – und machst es einfach."
      },
      {
        icon: "UsersRound",
        title: "Ein echtes Teamgefühl",
        text:
          "Wir sind kein anonymer Betrieb. Man kennt sich, unterstützt sich und hat gemeinsam gute Abende – auch wenn’s mal stressig wird."
      },
      {
        icon: "Trophy",
        title: "Überblick behalten",
        text:
          "Du weißt, was zu tun ist – und kannst dich darauf verlassen, dass alles vorbereitet ist. Wir arbeiten strukturiert, damit Events sauber laufen und du entspannt performen kannst."
      }
    ],
    expectationsTitle: "Das erwartet dich bei uns:",
    expectations: [
      {
        title: "Struktur, die funktioniert",
        text:
          "Du arbeitest mit klaren Abläufen, guter Vorbereitung und einem System, auf das du dich verlassen kannst. Keine Hektik ohne Plan – sondern ein Setup, das dich unterstützt, damit du dich auf den Service konzentrieren kannst."
      },
      {
        title: "Freundliches Team",
        text:
          "Hier kennt man sich beim Namen. Wir arbeiten eng zusammen, helfen uns gegenseitig und ziehen an einem Strang – gerade dann, wenn es drauf ankommt. Du bist nie allein im Stress."
      },
      {
        title: "Eine Location, die Spaß macht",
        text:
          "Arbeiten, wo andere feiern. Mitten im Grünen, direkt am Wasser und in einer Atmosphäre, die einfach besonders ist. Das hier ist kein typischer Gastro-Job."
      }
    ],
    cta: "Jetzt bewerben!"
  },
  form: {
    title: "Bitte füllen Sie das Kontaktformular aus",
    text:
      "Ihre Daten werden ausschließlich für den Bewerbungsprozess und zur Kontaktaufnahme verwendet.",
    submitLabel: "Meine Bewerbung einreichen",
    uploadTitle: "Bitte laden Sie Ihren Lebenslauf hoch (optional)",
    uploadText: "Ziehen Sie hier eine PDF-, DOCX- oder JPEG-Datei hin",
    uploadLimit: "Die maximale Dateigröße beträgt 10 MB"
  }
} as const;
