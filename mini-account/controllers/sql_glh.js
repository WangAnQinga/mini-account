let mysql = require('mysql');
const { glh_sql } = require('../config/index.js')

const pool = mysql.createPool({
    host: glh_sql.host,
    port: glh_sql.port,
    database: glh_sql.database,
    user: glh_sql.user,
    password: glh_sql.password
})


var query = function(sql, callback) {
    pool.getConnection(function(err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            conn.query(sql, function(err, results, fields) {
                //释放连接  
                conn.release();
                //事件驱动回调  
                callback(err, results, fields);
            });
        }
    });
};


const asyncQuery = function(sql) {

    return new Promise((reslove,reject) => {

        pool.getConnection(function(err, conn) {
            if (err) {
                reslove(err)
            } else {
                conn.query(sql, function(err, results, fields) {
                    //释放连接  
                    conn.release();
                    //事件驱动回调  
                    reslove({err, results, fields }) ;
                });
            }
        });
    })
};

module.exports = { query };