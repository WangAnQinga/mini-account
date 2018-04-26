const { typeTable } = require('../config/index.js')
const typeTableDebug = require('debug')('exdebug:typeTab')

/**
 * 通过单个id查询类型
 */
const typeInfo = (req, res) => {
    (async() => {
        const { id } = req.params;

        await typeTable.findById(id).then(item => {
            if (item) {
                res.status(200).json({ statusCode: 200, message: 'success', result: item })
            } else {
                res.status(417).json({ statusCode: 417, message: 'fail', result: "未查询到数据" })
            }
        })
    })()
}




/**
 * 类型列表
 */
const typeList = (req, res) => {
    (async() => {
        let { page, count } = req.query;
        page = Number(page) ? Number(page) : 1;
        count = Number(count) ? Number(count) : 10000000;
        await typeTable.findAndCount({
            // where: '', //为空，获取全部，也可以自己添加条件
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
修改类型 
    */
const putType = (req, res) => {
    (async() => {
        const { typeId, typeName, typeValue, typeImg } = req.body;
        if(!typeId || !typeName || !typeValue || !typeImg){
            res.status(400).json({ statusCode: 400, message: '信息不完整' });
            return false
        }
        typeTable.findById(typeId).then(item => {
            if (item) {
                typeTable.update({ typeName, typeValue, typeImg }, { 'where': { 'typeId': typeId } }).then(data => {
                    res.status(200).json({ statusCode: 200, message: 'success', result: null })
                }).catch(err => { return err })
            } else {
                res.status(417).json({ statusCode: 417, message: 'not found', result: null })
            }
        })

    })();
}

//新增类型
const addType = (req, res) => {
    (async() => {
        const { typeName, typeValue, typeImg } = req.body;
        if(!typeName || !typeValue || !typeImg){
            res.status(400).json({ statusCode: 400, message: '信息不完整' });
            return false
        }
        typeTable.create({
            typeName: typeName,
            typeValue: typeValue,
            typeImg: typeImg
        }).then(result => {
            res.status(200).json({ statusCode: 200, message: 'success', result: null })
        }).catch(err => {
            res.end(err)
        })
    })();
}

//删除类型
const deleteType = (req, res) => {
    (async() => {
        const { id } = req.params;
        await typeTable.destroy({ where: { 'typeId': id } }).then(result => {
            res.status(200).json({ statusCode: 200, message: "删除成功", result: null })
        }).catch(err => {
            res.end(err);
        })
    })()
}




module.exports = {
    typeList,
    putType,
    addType,
    deleteType,
    typeInfo
}