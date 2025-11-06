import fetchReadme from "./fetchReadme.js";
import getRepos from "./getRepos.js";

export default async function fetchLatestRepoReadme(){
    const repoRes = await getRepos();

    if (!repoRes.success) return {success:false}

    const readmeRes = await fetchReadme(repoRes.data[0].name, repoRes.data[0].owner.login);

    if (!readmeRes.success) return {success:false}
    
    return {success:true, data:readmeRes.data, repoName:repoRes.data[0].name}
}