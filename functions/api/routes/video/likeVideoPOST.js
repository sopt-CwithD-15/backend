const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { videoDB } = require('../../../db');

module.exports = async (req, res) => {
    console.log("동영상 좋아요 API 호출");
    const { videoId }  = req.params;
    let client;

  try {
    client = await db.connect(req);

    const data = await videoDB.postVideoLike(client, videoId);

    if(data.isLike) {
        res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LIKE_VIDEO_SUCCESS, {likeCount: data.likeCount}));
    }
    else {
        res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.CANCEL_LIKE_VIDEO_SUCCESS, {likeCount: data.likeCount}));
    }
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
