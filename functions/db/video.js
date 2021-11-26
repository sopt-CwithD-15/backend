const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');


const getAllVideos = async (client) => {
    const { rows } = await client.query(
        `
        SELECT *, v.created_at AS created_at
        FROM "video" v
        INNER JOIN "user" u ON v.user_id = u.user_id
        WHERE v.is_deleted = false
            AND u.is_deleted = false
        `
    )
    return convertSnakeToCamel.keysToCamel(rows);
}

module.exports = { getAllVideos };
