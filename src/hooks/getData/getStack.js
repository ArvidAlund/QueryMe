import pool from "../../db/connector.js"

let cachedResponses

export default async function getStack(){
    if (!cachedResponses){
        const res = await pool.query("SELECT * FROM stack");
        if (res.rowCount === 0) return {success:false}
        cachedResponses = res.rows
    }
    
    return {success:true, data:cachedResponses}
}