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

// 비디오 상세 페이지 조회
const getVideoById = async (client, videoId) => {
  const { rows } = await client.query(
    `
      SELECT v.video_id, v.title, v.tags, v.view_count, v.created_at, v.runtime, v.thumbnail, v.is_hot, v.is_like, v.is_dislike, v.like_count, v.dislike_count,
      u.user_iD, u.nickname, u.profile_image FROM "video" v
      JOIN "user" u ON v.user_id = u.user_id
      WHERE v.video_id = $1
        AND v.is_deleted = FALSE
      `,
    [videoId]
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

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

const postVideoDislike = async (client, videoId) => {
    const { rows } = await client.query(
        `
        UPDATE video
        SET is_dislike = CASE is_dislike
            WHEN true THEN false
            ELSE true
        END,
        dislike_count = CASE is_dislike
        WHEN true THEN dislike_count - 1
        ELSE dislike_count + 1
        END
        WHERE video_id = $1
        RETURNING dislike_count, is_dislike
        `,
        [videoId]
    )
    return convertSnakeToCamel.keysToCamel(rows[0]);
}

module.exports = { getAllVideos, postVideoLike, postVideoDislike};


