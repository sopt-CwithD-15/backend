const express = require('express');
const router = express.Router();

router.get('', require('./allVideosGET'));
router.get('/:videoId', require('./videoDetailGET'));
router.post('/like/:videoId',  require('./likeVideoPOST'));
router.post('/dislike/:videoId',  require('./dislikeVideoPOST'));
router.post('/comment/:videoId', require('./commentPOST'));
router.delete('/comment/:commentId', require('./commentDELETE'));
module.exports = router;
