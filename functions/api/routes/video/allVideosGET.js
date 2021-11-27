const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { videoDB } = require('../../../db');

module.exports = async (req, res) => {
    console.log("전체 동영상 조회 API 호출");

  let client;

  try {
    client = await db.connect(req);

    let videos = await videoDB.getAllVideos(client);

    videos = videos.map((video) => {
        return {
            videoId: video.videoId,
            title: video.title,
            viewCount: video.viewCount,
            createdAt: video.createdAt,
            author: {
                userId: video.userId,
                nickname: video.nickname,
                profileImage: video.profileImage
            },
            description: video.description,
            runtime: video.runtime,
            thumbnail: video.thumbnail,
            isHot: video.isHot,
        }
    });

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_ALL_VIDEOS_SUCCESS, {videos}));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
