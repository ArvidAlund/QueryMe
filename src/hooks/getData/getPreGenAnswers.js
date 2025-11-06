import pool from "../../db/connector.js"
let cachedResponses

export default async function getPreGenAnswers(){
    if (!cachedResponses){
        const res = await pool.query("SELECT * FROM pregenanswers");
        if (res.rowCount === 0) return {success:false}
        cachedResponses = res.rows
    }
    
    return {success:true, data:cachedResponses}
}