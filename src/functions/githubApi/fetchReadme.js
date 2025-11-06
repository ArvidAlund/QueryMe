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
    if (!cachedReadme){
        console.log("repo: ", reponame, " user: ", username)
        if (!reponame || !username) return {success:false}
        const readme = await octokit.request("GET /repos/{owner}/{repo}/readme",{
            owner: username,
            repo: reponame
        })

        cachedReadme = Buffer.from(readme.data.content, "base64").toString("utf-8");
    }

    return {success:true, data:cachedReadme}
}