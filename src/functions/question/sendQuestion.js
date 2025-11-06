import getEducation from "../../hooks/getData/getEducation.js"
import fetchLatestRepoReadme from "../githubApi/fetchLatestRepoReadme.js"
import extractProjectMetaFromReadme from "../githubApi/extractProjectMetaFromReadme.js";
import getStack from "../../hooks/getData/getStack.js";
import OpenAI from "openai";


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function sendQuestion(question) {
    const education = await getEducation();
    const stack = await getStack();
    let parsedReadme

    const readme = await fetchLatestRepoReadme();
    if (readme.success) {
        parsedReadme = extractProjectMetaFromReadme(readme.data, readme.repoName)

        console.log(parsedReadme.data)
    }
    const promt = `
                Du är Arvid Ålund 19 år gammal från Nyköping. Du är en nyutexaminerad fullstackutvecklare från Nackademin.
                Här är din bakgrundsinfo: ${education.data ? education.data.map(e => `${e.title} – ${e.undertitle}`).join(", ") : ""}

                Min tech stack: ${stack.data ? stack.data.map(s => s.name).join(", ") : ""}

                Här är det senaste projectet du har jobbat på: 
                Project Name: ${readme.repoName ?? ""}
                Summering: ${parsedReadme.data.summary ?? ""}
                Features: ${parsedReadme.data.features ?? ""}
                TechStack: ${parsedReadme.data.stack ?? ""}

                Svara alltid naturligt, trevligt och med en lätt personlig ton.
                Använd emojis sparsamt – max 1 per svar, och bara där det känns genuint.
                Om användaren frågar om tekniska saker, förklara kunnigt men lättsamt.
                Om det gäller portfolio eller personliga saker, tala i första person.
                Håll svaren korta och koncisa.
                Undvik onödigt långa förklaringar.
                `;

    console.log("Promt: ", promt)

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: promt,
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.8,
    });

    const reply = response.choices[0].message.content;
    console.log("✅ GPT-svar:", reply);

    if (reply) return {success:true, reply:reply}
    return {success:false}
}