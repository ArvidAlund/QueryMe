import { Octokit } from "octokit";
import { config } from "dotenv";
config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
}) 

// octokit.on('connect', () => console.log('Connected to GitHub!'));

export default octokit