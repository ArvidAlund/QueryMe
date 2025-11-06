const keywordsMap = [
    { key: 'title', words: ['queryme', 'project', 'title', 'namn', 'name', 'overview'] },
    { key: 'features', words: ['funktioner', 'features', 'funktion', 'funktionality', 'funktionalitet', 'capabilities', 'what it does'] },
    { key: 'stack', words: ['teknikstack', 'tech stack', 'stack', 'technologies', 'tech', 'tech stack used', 'built with'] },
    { key: 'install', words: ['installation', 'install', 'setup', 'getting started', 'komma igång'] },
    { key: 'usage', words: ['användning', 'usage', 'how to use', 'instructions', 'exempel', 'example'] },
    { key: 'contribute', words: ['bidra', 'contribute', 'contribution', 'collaboration', 'för bidra', 'contributing'] },
    { key: 'license', words: ['licens', 'license', 'copyright', 'rights', 'liscens', 'terms'] },
    { key: 'summary', words: ['summary', 'sammanfattning', 'sum', 'description', 'beskrivning', 'overview'] },
    { key: 'authors', words: ['authors', 'författare', 'contributors', 'medverkande'] },
    { key: 'acknowledgements', words: ['acknowledgements', 'tack', 'credits', 'erkännande'] },
    { key: 'changelog', words: ['changelog', 'ändringar', 'changes', 'update log', 'uppdateringar'] },
    { key: 'faq', words: ['faq', 'vanliga frågor', 'questions', 'frågor'] },
    { key: 'tests', words: ['tests', 'testing', 'test', 'tester', 'enhetstester', 'unit tests'] },
    { key: 'dependencies', words: ['dependencies', 'beroenden', 'requirements', 'krav', 'packages'] },
    { key: 'docker', words: ['docker', 'container', 'docker setup', 'docker-compose'] },
    { key: 'environment', words: ['environment', 'miljö', 'env variables', 'configuration', 'config'] }
];


export default function extractProjectMetaFromReadme(readmetxt, reponame = ""){
    const lines = readmetxt.split('\n');
    const sections = {};
    let currentSection = 'summary'
    sections[currentSection] = [];

    for (const line of lines){
        const headingMatch = line.match(/^#{1,6}\s+(.*)/);
        if (headingMatch){
            currentSection = normalizeKey(headingMatch[1], reponame);
            sections[currentSection] = [];
            continue;
        }

        if (line.trim() === "") continue;

        sections[currentSection].push(line);
    }

    for (const key in sections){
        sections[key] = sections[key].join('\n').trim();
    }

    return {success:true, data:sections}

}


const normalizeKey = (heading, reponame) => {
    const lower = heading.toLowerCase().trim();
    if (lower === reponame.toLowerCase().trim()) return 'summary'
    for (const item of keywordsMap) {
      if (item.words.some(word => lower.includes(word))) {
        return item.key;
      }
    }
    return lower.replace(/\s+/g, '-');
  };