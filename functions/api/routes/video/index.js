const express = require('express');
const router = express.Router();

router.get('', require('./allVideosGET'));

module.exports = router;
