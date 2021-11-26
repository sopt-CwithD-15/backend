const _ = require("lodash");
const convertSnakeToCamel = require("../lib/convertSnakeToCamel");

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
        SELECT c.comment_id, u.user_id, u.nickname, u.profile_image, 
            c.created_at, c.content 
        FROM "comment" c
        JOIN "user" u ON c.user_Id = u.user_Id
        WHERE c.video_id = $1
          AND c.is_deleted = FALSE
        `,
    [videoId]
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = { postVideoComment, getCommentsByVideoId };
