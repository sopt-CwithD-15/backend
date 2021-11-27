const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { videoDB, commentDB } = require('../../../db');

module.exports = async (req, res) => {
  console.log('동영상 Detail 조회 API 호출');
  const { videoId } = req.params;
  let client;

  try {
    client = await db.connect(req);

    let video = await videoDB.getOneVideo(client, videoId);
    let comments = await commentDB.getCommentsByVideoId(client, videoId);

    const tags = video.tags.split('#');
    video = {
      videoId: video.videoId,
      title: video.title,
      tags,
      viewCount: video.viewCount,
      createdAt: video.createdAt,
      author: {
        userId: video.userId,
        nickname: video.nickname,
        profileImage: video.profileImage,
      },
      description: video.description,
      runtime: video.runtime,
      thumbnail: video.thumbnail,
      isHot: video.isHot,
      isLike: video.isLike,
      isDislike: video.isDislike,
      likeCount: video.likeCount,
      dislikeCount: video.dislikeCount,
    };

    comments = comments.map((comment) => {
      return {
        commentId: comment.commentId,
        commenter: {
          userId: comment.userId,
          nickname: comment.nickname,
          profileImage: comment.profileImage
        },
        createdAt: comment.createdAt,
        content: comment.content
      }
    });

    let recommended = await videoDB.getRecommendedVideos(client,videoId);

    recommended = recommended.map((video) => {
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

    res.status(statusCode.OK).send(
      util.success(statusCode.OK, responseMessage.READ_ONE_VIDEOS_SUCCESS, {
        video,
        comments,
        recommended
      })
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