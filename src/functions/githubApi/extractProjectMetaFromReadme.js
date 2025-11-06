const keywordsMap = [
        { key: 'title', words: ['queryme', 'project', 'title'] },
        { key: 'features', words: ['funktioner', 'features', 'funktion', 'funktionality'] },
        { key: 'stack', words: ['teknikstack', 'tech stack', 'stack', 'technologies', 'tech'] },
        { key: 'install', words: ['installation', 'install', 'setup'] },
        { key: 'usage', words: ['användning', 'usage', 'how to use', 'instructions'] },
        { key: 'contribute', words: ['bidra', 'contribute', 'contribution'] },
        { key: 'license', words: ['licens', 'license', 'copyright'] },
        { key: 'summary', words: ['summary', 'sammanfattning', 'sum']}
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