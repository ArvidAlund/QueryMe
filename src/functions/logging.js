import pool from "../db/connector.js";

/**
 * Record a function invocation log entry in the database.
 *
 * @param {Object} params - Log entry properties.
 * @param {string} params.identifier - Unique identifier for the function invocation (e.g., request or job id).
 * @param {string} params.endpoint - Name or path of the function or endpoint being logged.
 * @param {*} [params.request] - Request payload; if provided it will be JSON-stringified for storage.
 * @param {*} [params.response] - Response payload; if provided it will be JSON-stringified for storage.
 * @param {string} [params.status="OK"] - Status label for the invocation.
 * @param {*} [params.error=null] - Error information associated with the invocation, if any.
 * @param {Object} [params.metadata={}] - Additional metadata; will be JSON-stringified for storage.
 */
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