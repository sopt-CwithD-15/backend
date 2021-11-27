const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');

const postVideoComment = async (client, videoId, userId, content) => {
  const { rows } = await client.query(
    `
        INSERT INTO comment
        (video_id, user_id, content)
        VALUES
        ($1, $2, $3)
        RETURNING *
        `,
    [videoId, userId, content]
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};
const getCommentsByVideoId = async (client, videoId) => {
  const { rows } = await client.query(
    `
    SELECT *, c.created_at AS created_at
    FROM "comment" c
    INNER JOIN "user" u ON c.user_id = u.user_id
    WHERE video_id = $1
        AND c.is_deleted = FALSE
        AND u.is_deleted = false
    ORDER BY c.created_at DESC
      `,
    [videoId]
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getCommentByCommentId = async (client, commentId) => {
  const { rows } = await client.query(
    `
        SELECT *, c.created_at AS created_at
        FROM "comment" c
        JOIN "user" u ON c.user_id = u.user_id
        WHERE c.comment_id = $1
          AND c.is_deleted = FALSE
        `,
    [commentId]
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const deleteCommentByCommentId = async (client, commentId) => {
    const { rows } = await client.query(
        `
        UPDATE comment
        SET is_deleted = true
        WHERE comment_id = $1
        RETURNING comment_id, is_deleted
        `,
        [commentId]
    );
    
    return convertSnakeToCamel.keysToCamel(rows);
}
module.exports = {
  postVideoComment,
  getCommentsByVideoId,
  getCommentByCommentId,
  deleteCommentByCommentId
};