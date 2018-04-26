let env = process.env.NODE_ENV

let Sequelize = require('sequelize');

const configDebug = require('debug')('exdebug:config')
configDebug(env)

const { sql, port, glh_sql } = require(`./${env}.config.js`)

const sequelize = new Sequelize(sql.database, sql.user, sql.password, {
    host: sql.host,
    port: sql.port,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

const taskTable = sequelize.define('task', {
    id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
    taskName: { type: Sequelize.STRING, allowNull: false },
    type:{ type: Sequelize.STRING, allowNull: false },
    gift: { type: Sequelize.STRING, allowNull: false },
    commission: { type: Sequelize.BIGINT, allowNull: false },
    status: { type: Sequelize.TINYINT, allowNull: false },
    freight:{ type: Sequelize.BIGINT, allowNull: false },
    remark:{ type: Sequelize.STRING, allowNull: false },
    userId:{ type: Sequelize.BIGINT, allowNull: false },
    createTime: { type: Sequelize.STRING, allowNull: false },
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true //默认表名复数，为true,表名为单数
})

taskTable.sync().then(function() {
    configDebug('成功创建任务表')
})


const statusTable = sequelize.define('status',{
    statusId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
    statusName: { type: Sequelize.STRING, allowNull: false },
    statusValue: { type: Sequelize.TINYINT, allowNull: false },
},{
    timestamps: false,
    underscored: true,
    freezeTableName: true //默认表名复数，为true,表名为单数
})

statusTable.sync().then(function() {
    // 已创建数据表
    configDebug('成功创建状态表')
});

const userTable = sequelize.define('user',{
    userId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
    wxName: { type: Sequelize.STRING, allowNull: false },
    wxId: { type: Sequelize.STRING, allowNull: false },
},{
    timestamps: false,
    underscored: true,
    freezeTableName: true //默认表名复数，为true,表名为单数
})

userTable.sync().then(function() {
    // 已创建数据表
    configDebug('成功创建用户表')
});


const typeTable = sequelize.define('type', {
    typeId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
    typeName: { type: Sequelize.STRING, allowNull: false },
    typeValue: { type: Sequelize.STRING, allowNull: false },
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true //默认表名复数，为true,表名为单数
})

typeTable.sync().then(function() {
    // 已创建数据表
    configDebug('成功创建类型表')
});

module.exports = { taskTable, typeTable, port, sequelize, glh_sql }