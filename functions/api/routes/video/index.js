const express = require('express');
const router = express.Router();

router.get('', require('./allVideosGET'));
// router.get('', require('./detailVideoGET'));
router.post('/like/:videoId',  require('./likeVideoPOST'));
router.post('/dislike/:videoId',  require('./dislikeVideoPOST'));
router.post('/comment/:videoId', require('./commentPOST'));
module.exports = router;
