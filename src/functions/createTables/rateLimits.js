import pool from "../../db/connector.js";

export default async function createRateLimitTable(){
    const res = await pool.query(`
    create table rate_limits (
    id uuid default uuid_generate_v4() primary key,
    identifier text not null,
    timestamp bigint not null
    );

    -- Index för snabb fetch
    create index rate_limits_identifier_idx on rate_limits(identifier);
    create index rate_limits_timestamp_idx on rate_limits(timestamp);

    `)
}