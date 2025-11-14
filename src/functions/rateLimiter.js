import pool from "../db/connector.js";

export default async function rateLimiter(identifier, maxRequests, windowSec) {
    const now = Date.now();
    const windowStart = now - windowSec * 1000;

    let count;
    try {
        const res = await pool.query(
            "SELECT COUNT(*) FROM ratelimits WHERE identifier = $1 AND timestamp >= $2",
            [identifier, windowStart]
        );
        
        count = parseInt(res.rows[0].count, 10);
    } catch (err) {
        console.error("Rate limit error:", err);
        return { allowed: true, error: err };
    }

    if (count >= maxRequests) {
        return { allowed: false };
    }

    try {
        await pool.query(
            "INSERT INTO ratelimits (identifier, timestamp) VALUES ($1, $2)",
            [identifier, now]
        );

        // Rensa gamla entries
        await pool.query(
            "DELETE FROM ratelimits WHERE identifier = $1 AND timestamp < $2",
            [identifier, windowStart]
        );
    } catch (err) {
        console.error("Rate limit insert/delete error:", err);
    }

    return { allowed: true };
}
