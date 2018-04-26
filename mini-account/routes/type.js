var express = require('express');
var router = express.Router();


const { typeList, putType, addType, deleteType, typeInfo} = require('../controllers/type.js')


/**类型相关的路由 */

router.get('/type/list', typeList);
router.put('/type/update', putType);
router.post('/type/add', addType);
router.delete('/type/delete/:id', deleteType);
router.get('/type/:id', typeInfo)


module.exports = router;