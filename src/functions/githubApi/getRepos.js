import octokit from "./connector.js";
let cachedRespons

export default async function getRepos(){
    if (!cachedRespons){
        const resData = await octokit.request('GET /user/repos', {
            headers: "application/vnd.github+json",
            sort: "updated",
            direction:"desc",
            type:"all"
        })
        cachedRespons = resData.data
    }

    console.log(cachedRespons)
    return
}