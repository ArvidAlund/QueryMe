# QueryMe

QueryMe är en personlig AI-driven chattapplikation som gör det möjligt för användare att ställa frågor om mig och få svar som är skräddarsydda utifrån specifika parametrar. Den är byggd för att integreras på min portfoliosida och visar hur AI kan användas för att skapa en interaktiv och personlig upplevelse.

## Funktioner

- Ställ frågor om mig och mitt arbete.
- AI:n genererar svar baserat på parametrar som definierar min bakgrund, erfarenhet och preferenser.
- Enkel och interaktiv chattgränssnitt.
- Anpassad för portfoliosidor.

## Teknikstack

- **Backend / AI-integration:** Express, GitHub API, Open AI
- **Databas / Parametrar:** Supabase

## Installation

1. Klona repoet:

```bash
git clone https://github.com/ArvidAlund/QueryMe.git
```

1. Gå in i mappen:

```bash
cd queryme
```

2. Installera beroenden:

```bash
npm install
```

3. Lägg till dina miljövariabler:

```bash
DATABASE_URL=
API_KEY=
GITHUB_TOKEN=
OPENAI_API_KEY=
```

4. Starta projektet:

```bash
npm run dev
```

Projektet körs nu på http://localhost:3000.

## Användning
Du kan skicka en fråga till API:t med en POST-förfrågan. Följande exempel använder fetch i JavaScript:

```bash
const res = await fetch("http://localhost:3000/question", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "key": process.env.NEXT_PUBLIC_API_KEY
    },
    body: JSON.stringify({
      data: {
        question: question
      }
    })
  });
```
Svar

Om förfrågan lyckas returneras ett objekt i följande format:
```json
{
    "success": true,
    "reply": "Svaret på frågan"
}
```
- success: true om förfrågan lyckades.

- reply: svaret från AI:n på den fråga du skickade.

## Bidra

Om du vill bidra eller ge feedback är du välkommen att skapa en issue eller skicka en pull request.

## Licens

Detta projekt är licensierat under MIT License. Se LICENSE för mer information.

Gjort av Arvid Ålund – en AI-driven personlig chatt för portfolio-syfte.
