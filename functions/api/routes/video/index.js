const express = require('express');
const router = express.Router();

router.get('', require('./allVideosGET'));
router.post('/like/:videoId',  require('./likeVideoPOST'));
module.exports = router;
