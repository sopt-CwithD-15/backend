const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { videoDB } = require('../../../db');

module.exports = async (req, res) => {
    console.log("동영상 싫어요 API 호출");
    const { videoId }  = req.params;
    let client;

  try {
    client = await db.connect(req);

    const data = await videoDB.postVideoDislike(client, videoId);

    if(data.isDislike) {
        res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.DISLIKE_VIDEO_SUCCESS, {dislikeCount: data.dislikeCount}));
    }
    else {
        res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.CANCEL_DISLIKE_VIDEO_SUCCESS, {dislikeCount: data.dislikeCount}));
    }
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
