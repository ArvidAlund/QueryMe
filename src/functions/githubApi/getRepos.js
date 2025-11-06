import octokit from "./connector.js";
let cachedRespons

/*
 * getRepos()
 * -------------
 * Hämtar en lista med alla användarens GitHub-repos (både publika och privata)
 * sorterade efter senast uppdaterad. 
 *
 * Returnerar:
 *  - { success: true, data: [...] } om hämtningen lyckades
 *  - { success: false } om inga repos hittades
 */
export default async function getRepos(){
    if (!cachedRespons){
        const resData = await octokit.request('GET /user/repos', {
            headers: "application/vnd.github+json",
            sort: "updated",
            direction:"desc",
            type:"all"
        })
        if (resData.length === 0) return {success:false}

        cachedRespons = resData.data
    }

    return {success:true, data:cachedRespons}
}