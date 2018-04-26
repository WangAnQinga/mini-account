const express = require('express');
const router = express.Router();

const post = require('./post.js')
const type = require('./type.js')



router.use('/post',post);
router.use('/type',type)










module.exports = router;