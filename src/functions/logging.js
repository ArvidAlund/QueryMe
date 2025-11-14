import pool from "../db/connector.js";

export default async function log({
    identifier,
    endpoint,
    request,
    response,
    status = "OK",
    error = null,
    metadata = {}
}) {
    const timestamp = Date.now();

    try {
        await pool.query(
            `INSERT INTO function_logs
            (timestamp, identifier, endpoint, request, response, status, error, metadata)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                timestamp,
                identifier,
                endpoint,
                request ? JSON.stringify(request) : null,
                response ? JSON.stringify(response) : null,
                status,
                error,
                JSON.stringify(metadata)
            ]
        );
    } catch (err) {
        console.error("Logging error:", err);
    }
}