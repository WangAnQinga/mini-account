var express = require('express');
var router = express.Router();


const {  postList, putPost, addPost, deletePost, postInfo} = require('../controllers/post.js')


/**帖子相关的路由 */
router.get('/list', postList);
router.put('/update', putPost);
router.post('/add', addPost);
router.delete('/delete/:id', deletePost);
router.get('/:id', postInfo);




module.exports = router;