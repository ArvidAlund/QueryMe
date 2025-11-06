import validateKey from "../validateKey.js"
import getPreGenAnswers from "../../hooks/getData/getPreGenAnswers.js";
import useCanAnswer from "../../hooks/useCanAnswer.js";
import sendQuestion from "./sendQuestion.js";

export default async function question(req, res){
    const key = req.headers?.key;
    if (validateKey(key) === false) return res.status(401).json({ error:"Access denied: Invalid or missing API key."})

    const question = req.body?.data.question;
    if (!question || typeof question !== "string") return res.status(400).json( { error:"Input error: Question missing or not a string."} )
    const preGenAnswers = await getPreGenAnswers();

    if (preGenAnswers.success){

        const returnData = useCanAnswer(question, preGenAnswers.data);

        if (returnData.match) return res.status(200).json( { success:true, reply:returnData.reply } )
    }

    const replyData = await sendQuestion(question)

    if (!replyData.success) return res.status(400).json( {error:"Something went wrong"} )

    return res.status(200).json({success:true, reply:replyData.reply})
}