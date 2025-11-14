import octokit from "./connector.js"
let cachedReadme

/**
 * Fetches the raw README content for a GitHub repository.
 *
 * @param {string} reponame - Repository name.
 * @param {string} username - Repository owner or username.
 * @returns {{success: true, data: string} | {success: false, error?: string}} The result object: on success contains `data` with the README content; on failure contains `error` with a message when available.
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