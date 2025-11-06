import validateKey from "../validateKey.js"
import getPreGenAnswers from "../../hooks/getPreGenAnswers.js";

export default async function question(req, res){
    const key = req.headers?.key;
    if (validateKey(key) === false) return res.status(401).json({ error:"Access denied: Invalid or missing API key."})

    const question = req.body?.data.question;
    if (!question || typeof question !== "string") return res.status(400).json( { error:"Input error: Question missing or not a string."} )
    await getPreGenAnswers();

    return res.status(200)
}