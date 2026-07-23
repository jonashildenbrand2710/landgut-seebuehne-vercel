# GitHub-/Greptile-Prüfzyklus

Verwende ausschließlich den bestehenden GitHub-Pull-Request. Ersetze Platzhalter mechanisch; gib keine Tokens aus.

## PR und SHA auflösen

```bash
gh pr view PR_NUMBER --json number,url,headRefName,baseRefName,headRefOid,isDraft
```

Vergleiche `headRefOid` vor jeder Prüfung erneut. Ein Ergebnis einer älteren SHA ist ungültig.

## Laufende Greptile-Prüfung erkennen

```bash
gh pr checks PR_NUMBER --json name,state,link
```

Filtere Check-Namen ohne Beachtung der Großschreibung nach `greptile`. Wenn ein passender Check `PENDING`, `QUEUED` oder `IN_PROGRESS` ist, poste keinen neuen Trigger.

Prüfe zusätzlich, ob für dieselbe SHA bereits ein Kommentar mit `Greploop review of HEAD_SHA` existiert:

```bash
gh api --paginate "repos/OWNER/REPO/issues/PR_NUMBER/comments?per_page=100"
```

Fehlt für die aktuelle SHA sowohl ein laufender Check als auch der Marker:

```bash
gh pr comment PR_NUMBER --body "@greptile review

Greploop review of HEAD_SHA"
```

## Begrenzt warten

Prüfe höchstens 60-mal im Abstand von zehn Sekunden:

```bash
gh api "repos/OWNER/REPO/commits/HEAD_SHA/check-runs"
```

Wähle den neuesten Check Run, dessen Name `greptile` enthält. Stoppe bei `status=completed`. Nach zehn Minuten als Timeout melden; keine alten Kommentare als aktuelles Ergebnis verwenden.

## Aktuelles Ergebnis zusammensetzen

Greptile kann den Score an mehreren Stellen aktualisieren. Lies deshalb:

```bash
gh pr view PR_NUMBER --json body,headRefOid
gh api --paginate "repos/OWNER/REPO/issues/PR_NUMBER/comments?per_page=100"
gh api --paginate "repos/OWNER/REPO/pulls/PR_NUMBER/reviews?per_page=100"
gh api --paginate "repos/OWNER/REPO/pulls/PR_NUMBER/comments?per_page=100"
```

- Akzeptiere nur Autoren wie `greptile-apps[bot]`, `greptile-apps-staging[bot]` oder den im Repository sichtbar bestätigten Greptile-Bot.
- Verwende bei allgemeinen Kommentaren den neuesten `updated_at`-Stand; Greptile kann denselben Kommentar mehrfach bearbeiten.
- Parse den Score `N/5`.
- Berücksichtige konkrete Befunde aus Inline-Kommentaren und aus einem allgemeinen Abschnitt wie `Prompt to fix all with AI`.
- Behaupte null offene Kommentare erst nach Prüfung der Review-Threads.

## Offene Review-Threads lesen

```bash
gh api graphql -f query='
query {
  repository(owner: "OWNER", name: "REPO") {
    pullRequest(number: PR_NUMBER) {
      reviewThreads(first: 100) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          isResolved
          comments(first: 20) {
            nodes { body path line author { login } }
          }
        }
      }
    }
  }
}'
```

Bei mehr als 100 Threads mit `endCursor` weiterblättern. Filtere auf nicht gelöste Threads des bestätigten Greptile-Bots.

## Threads sicher schließen

Einen Thread erst nach nachweisbarer Behebung oder dokumentierter technischer Widerlegung schließen:

```bash
gh api graphql -f query='
mutation {
  resolveReviewThread(input: {threadId: "THREAD_ID"}) {
    thread { id isResolved }
  }
}'
```

Vor einer technischen Widerlegung im Thread kurz Ursache und Beleg posten. Produkt-, Sicherheits-, Daten-, Auth- oder Berechtigungsfragen nicht automatisch als Fehlalarm schließen.

## Erfolg

Erfolg gilt nur gemeinsam:

- Head-SHA unverändert
- neuester Greptile-Score `5/5`
- null offene Greptile-Threads
- keine unbehandelten konkreten Befunde im neuesten allgemeinen Greptile-Kommentar

Bei einer neuen SHA beginnt die commitgebundene Auswertung erneut.
