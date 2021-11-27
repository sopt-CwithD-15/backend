const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { commentDB } = require('../../../db');

module.exports = async (req, res) => {
  console.log('댓글 등록 API 호출');
  const { videoId } = req.params;
  const { userId, content } = req.body;

  let client;

  try {
    client = await db.connect(req);
    const postedComment = await commentDB.postVideoComment(
      client,
      videoId,
      userId,
      content
    );

    const comment = await commentDB.getCommentByCommentId(
      client,
      postedComment.commentId
    );

    const data = {
      commentId: comment.commentID,
      commenter: {
        userId: comment.userID,
        nickname: comment.nickname,
        profileImage: comment.profileImage
      },
      content: comment.content,
      createdAt: comment.createdAt
    };
    res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, responseMessage.ADD_COMMENT_SUCCESS, data)
      );
  } catch (error) {
    functions.logger.error(
      `[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`,
      `[CONTENT] ${error}`
    );
    console.log(error);

    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          responseMessage.INTERNAL_SERVER_ERROR
        )
      );
  } finally {
    client.release();
  }
};