import validateKey from "../validateKey.js"
import getPreGenAnswers from "../../hooks/getData/getPreGenAnswers.js";
import useCanAnswer from "../../hooks/useCanAnswer.js";
import sendQuestion from "./sendQuestion.js";
import rateLimiter from "../rateLimiter.js";
import log from "../logging.js";

/**
 * Handle an incoming question request by enforcing rate limits, validating an API key, optionally returning a pre-generated answer, and otherwise forwarding the question to a remote generator.
 *
 * Validates the client IP against a rate limiter and returns 429 when the client exceeded 20 requests per 60 seconds. Validates `req.headers.key` and returns 401 for an invalid or missing key. Validates `req.body.data.question` and returns 400 if missing or not a string. If a matching pre-generated answer is found, responds with 200 and `{ success: true, reply }`; otherwise forwards the question to a remote service and responds with 200 and `{ success: true, reply }` on success or 400 on generation failure.
 *
 * @param {import('http').IncomingMessage & { headers: Record<string,string>, socket: any, body?: any }} req - Express request object; expects `req.headers.key` (API key) and `req.body.data.question` (the question string).
 * @param {import('http').ServerResponse & { status: (code:number)=>any, json: (obj:any)=>any }} res - Express response object used to send JSON HTTP responses with appropriate status codes.
 */
export default async function question(req, res){
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const limit = await rateLimiter(ip, 20, 60);

    if(!limit.allowed){
        await log({
            ip,
            endpoint: "/question",
            request: req.body,
            status: "RATE_LIMITED"
        })
        return res.status(429).json({ error: "Too many requests. Please wait a bit."})
    }
    const key = req.headers?.key;
    if (validateKey(key) === false){
        await log({
            ip,
            endpoint: "/question",
            request: req.body,
            status: "INVALID_APIKEY"
        })
        return res.status(401).json({ error:"Access denied: Invalid or missing API key."})
    }
    
    
    const question = req.body?.data.question;
    if (!question || typeof question !== "string"){
        await log({
            ip,
            endpoint: "/question",
            request: req.body,
            status: "QUESTION MISSING"
        })
        return res.status(400).json( { error:"Input error: Question missing or not a string."} )
    }
    const preGenAnswers = await getPreGenAnswers();

    if (preGenAnswers.success){

        const returnData = useCanAnswer(question, preGenAnswers.data);
        await log({
            ip,
            endpoint: "/question",
            request: req.body,
            response: returnData.reply,
            status: "OK"
        })

        if (returnData.match) return res.status(200).json( { success:true, reply:returnData.reply } )
    }

    const replyData = await sendQuestion(question)

    if (!replyData.success){
        await log({
            ip,
            endpoint: "/question",
            request: req.body,
            status: "INTERNAL ERROR"
        })
        return res.status(400).json( {error:"Something went wrong"} )
    }

    await log({
            ip,
            endpoint: "/question",
            request: req.body,
            response:replyData.reply,
            status: "OK"
        })
    return res.status(200).json({success:true, reply:replyData.reply})
}