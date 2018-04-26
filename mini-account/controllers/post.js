// let moment = require('moment');
const { taskTable, sequelize } = require('../config/index.js')
const taskTableDebug = require('debug')('exdebug:postTab')
/**
 * 通过id查询单个帖子的信息
 */
const postInfo = (req, res) => {
    (async() => {
        const { id } = req.params;
        await taskTable.findById(id).then(item => {
            if (item) {
                res.status(200).json({ statusCode: 200, message: 'success', result: item })
            } else {
                res.status(417).json({ statusCode: 417, message: 'fail', result: "未查询到数据" })
            }
        })
    })()
}

//过滤对象空属性
function objFilter(obj) {
    for (var key in obj) {
        if (!obj[key]) {
            delete obj[key]
        }
    }
    return obj
}

/**
 * 管理系统帖子列表
 */
const postList = (req, res) => {
    (async() => {
        let { page, count, type, title,author,postId } = req.query;
        page = Number(page) ? Number(page) : 1;
        count = Number(count) ? Number(count) : 100000000;
        console.log(page,count)
        let cond = { 'type': type, 'title': title ,'author':author,'postId':postId};
        taskTable.findAndCount({
            where: objFilter(cond), //为空，获取全部，也可以自己添加条件
            order: [
                ["id", "DESC"] //按照id降序排列
            ],
            offset: (Number(page) - 1) * Number(count), //开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
            limit: Number(count) //每页限制返回的数据条数
        }).then((response) => {
            res.status(200).json({ statusCode: 200, message: '查询成功', result: response.rows, totalCount: response.count })
        }).catch((err) => {
             res.end(err)
        })

    })()
}

/**
修改帖子   
 */
const putPost = (req, res) => {
    (async() => {
        const { id,postId, title, imageUrl, type,author, createTime } = req.body;
        if (!postId || !title || !author||!imageUrl  || !type || !createTime) {
            res.status(400).json({ statusCode: 400, message: '信息不完整' });
            return false
        }
        taskTable.findById(id).then(item => {
            if (item) {
                taskTable.update({ postId,title,author, imageUrl,type, createTime }, { 'where': { 'id': id } }).then(data => {
                    res.status(200).json({ statusCode: 200, message: 'success', result: null })
                }).catch(err => { return err })
            } else {
                res.status(417).json({ statusCode: 417, message: 'not found', result: null })
            }
        })

    })();
}

/**
   新增帖子   
    */
const addPost = (req, res) => {
    (async() => {
        const { postId,title, author,imageUrl,  type, createTime } = req.body;
        if (!postId|| !title || !imageUrl || !author || !type || !createTime) {
            res.status(400).json({ statusCode: 400, message: '信息不完整' });
            return false
        }
        taskTable.create({
            postId:postId,
            title: title,
            author:author,
            imageUrl: imageUrl,
            type: type,
            createTime: createTime
        }).then(result => {
            res.status(200).json({ statusCode:200,message: 'success', result: null })
        }).catch(err => {
            res.end(err)
        })
    })();
}

/**
 * 
 删除帖子
 */
const deletePost = (req, res) => {
    (async() => {
        const { id } = req.params;
        taskTable.destroy({ where: { 'id': id } }).then(result => {
            res.status(200).json({ statusCode:200,message: "删除成功", result: null })
        }).catch(err => {
            res.end(err);
        })
    })()
}


module.exports = {
    postList,
    putPost,
    addPost,
    deletePost,
    postInfo
}