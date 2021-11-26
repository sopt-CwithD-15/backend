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

const postVideoLike = async (client, videoId) => {
    const { rows } = await client.query(
        `
        UPDATE video
        SET is_like = CASE
            WHEN is_like = true THEN false
            ELSE true
        END,
        like_count = CASE
        WHEN is_like = true THEN like_count - 1
        ELSE like_count + 1
        END
        WHERE video_id = $1
        RETURNING like_count, is_like
        `,
        [videoId]
    )
    return convertSnakeToCamel.keysToCamel(rows[0]);
}
module.exports = { getAllVideos, postVideoLike };

// like_count = CASE
// WHEN is_like = true THEN like_count - 1
// ELSE like_count + 1
