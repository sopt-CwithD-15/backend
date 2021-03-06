const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { commentDB } = require('../../../db');

module.exports = async (req, res) => {
  console.log('댓글 삭제 API 호출');
  const { commentId } = req.params;

  let client;

  try {
    client = await db.connect(req);
    const comment = await commentDB.deleteCommentByCommentId(client,commentId);
    console.log(comment);
    if (comment.length) {
        res
        .status(statusCode.OK)
        .send(
          util.success(statusCode.OK, responseMessage.DELTE_COMMENT_SUCCESS)
        );
    }
    else if (!comment.length) {
      res
      .status(statusCode.BAD_REQUEST)
      .send(
        util.fail(
          statusCode.BAD_REQUEST,
          responseMessage.NO_COMMENT
        )
      );
    }

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