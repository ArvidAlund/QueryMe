import octokit from "./connector.js"
let cachedReadme

/*
 * fetchReadme(reponame, username)
 * --------------------------------
 * Hämtar och returnerar README-filen från ett angivet GitHub-repo.
 *
 * Parametrar:
 *  - reponame (string): Namnet på repot.
 *  - username (string): Ägaren/användarnamnet till repot.
 *
 * Returnerar:
 *  - { success: true, data: "<README-innehåll>" } om hämtningen lyckades.
 *  - { success: false } om `reponame` eller `username` saknas eller något fel uppstår.
 */
export default async function fetchReadme(reponame, username){
        console.log("repo: ", reponame, " user: ", username)
        if (!reponame || !username) return {success:false}

        try {
        const readme = await octokit.request("GET /repos/{owner}/{repo}/readme", {
            owner: username,
            repo: reponame,
            headers: { "Accept": "application/vnd.github.v3.raw" }
        });

        if (!readme?.data) {
            return { success: false, error: "No README content found" };
        }

        return { success: true, data: readme.data };
    } catch (err) {
        console.error("Error fetching README:", err.message);
        return { success: false, error: err.message };
    }
}