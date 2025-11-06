import pool from "../../db/connector.js"
let cachedResponses

export default async function getEducation(){
    if (!cachedResponses){
        const res = await pool.query("SELECT * FROM education");
        if (res.rowCount === 0) return {success:false}
        cachedResponses = res.rows
    }
    
    return {success:true, data:cachedResponses}
}