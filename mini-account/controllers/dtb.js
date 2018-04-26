const { query,asyncQuery } = require('./sql_glh.js')
const moment = require('moment')


/**
 * glh数据库g_subject表
 */

//select * from table limit (start-1)*limit,limit
//直播考核查询直播列表

const liveList = (req, res) => {
    (async() => {
        let { page, count,nick,title,type,content,beginDate,endDate,specialDate} = req.query;
        const start = (page - 1) * count;
        let totalCount = null;
        let userId = null
        
        
        let sqlLive = `select ID id,TYPE type,TITLE title,CONTENT content,READING reading,LINK link,LINK_NAME linkName,CREATE_DATE creatDate,USER_ID userId from g_live `;
        let sqlCount = `select count( *) as totalCount,FROM_UNIXTIME(CREATE_DATE,'%w') as whichWeek,FROM_UNIXTIME(CREATE_DATE,'%Y-%m-%d') as whichDate from g_live `

        if(nick || beginDate || endDate || specialDate || type){
            sqlLive += 'where ';
            sqlCount += 'where ';
        }
        var denick = decodeURI(nick);
        const resultppp = await asyncQuery(`select USER_ID userId from g_user where NICK = '${denick}'`);

        if(nick){

            userId = resultppp.results[0] ? resultppp.results[0].userId : null;
            sqlLive += ` USER_ID = ${userId}`
            sqlCount += ` USER_ID = ${userId}`
           
                if(beginDate && endDate){
                    sqlLive += ` and CREATE_DATE between ${beginDate} and ${endDate} and FROM_UNIXTIME(CREATE_DATE,'%w') != 0  and  FROM_UNIXTIME(CREATE_DATE,'%w') != 6 and HOUR(FROM_UNIXTIME(CREATE_DATE)) >= 6 and HOUR(FROM_UNIXTIME(CREATE_DATE)) < 18`;
                    sqlCount += ` and CREATE_DATE between ${beginDate} and ${endDate} and FROM_UNIXTIME(CREATE_DATE,'%w') != 0  and  FROM_UNIXTIME(CREATE_DATE,'%w') != 6 and HOUR(FROM_UNIXTIME(CREATE_DATE)) >= 6 and HOUR(FROM_UNIXTIME(CREATE_DATE)) < 18`

                }

                if(specialDate){
                    specialDate = specialDate.split(';');
                    for(var i=0;i<specialDate.length;i++){
                        var time = specialDate[i];
                        sqlLive += ` and FROM_UNIXTIME(CREATE_DATE,'%Y-%m-%d') != '${time}' `;
                        sqlCount += ` and FROM_UNIXTIME(CREATE_DATE,'%Y-%m-%d') != '${time}' `;
                    }
                }

                if(type){
                    sqlLive += ` and TYPE = ${type}`;
                    sqlCount += ` and TYPE = ${type}`
                }
            

            
                

        }else {

            if(beginDate && endDate){
                sqlLive += ` CREATE_DATE between ${beginDate} and ${endDate} and FROM_UNIXTIME(CREATE_DATE,'%w') != 0  and  FROM_UNIXTIME(CREATE_DATE,'%w') != 6 and HOUR(FROM_UNIXTIME(CREATE_DATE)) >= 6 and HOUR(FROM_UNIXTIME(CREATE_DATE)) < 18`;
                sqlCount += ` CREATE_DATE between ${beginDate} and ${endDate} and FROM_UNIXTIME(CREATE_DATE,'%w') != 0  and  FROM_UNIXTIME(CREATE_DATE,'%w') != 6 and HOUR(FROM_UNIXTIME(CREATE_DATE)) >= 6 and HOUR(FROM_UNIXTIME(CREATE_DATE)) < 18`                
            
                if(specialDate){
                    specialDate = specialDate.split(';');
                    for(var i=0;i<specialDate.length;i++){
                        var time = specialDate[i]
                        sqlLive += ` and FROM_UNIXTIME(CREATE_DATE,'%Y-%m-%d') != '${time}' `;
                        sqlCount += ` and FROM_UNIXTIME(CREATE_DATE,'%Y-%m-%d') != '${time}' `;
                    }
                }

                if(type){
                    sqlLive += ` and TYPE = ${type}`;
                    sqlCount += `  and TYPE = ${type}`
                }

            }else{

                if(specialDate){
                    specialDate = specialDate.split(';');
                    for(var i=0;i<specialDate.length;i++){
                        var time = specialDate[i]
                        sqlLive += ` FROM_UNIXTIME(CREATE_DATE,'%Y-%m-%d') != '${time}' and `;
                        sqlCount += ` FROM_UNIXTIME(CREATE_DATE,'%Y-%m-%d') != '${time}' and `;
                    }

                    if(type){
                        sqlLive += ` TYPE = ${type}`;
                        sqlCount += ` TYPE = ${type}`
                    }

                }else{
                    
                    if(type){
                        sqlLive += ` TYPE = ${type} `;
                        sqlCount += ` TYPE = ${type} `;

                    }
                }

            }

        }

            sqlLive += ` order by ID desc limit ${start},${count}`;
            totalCount = await  asyncQuery(`${sqlCount}`);
            query(`${sqlLive}`, (err, results, fields) => {
                if (!err) {
                   results.map((item,index) => {
                        query(`select NICK nick from g_user where USER_ID = ${item.userId}`,(errs,res,field) => {
                         item.nick = res[0].nick
                        });
                    })
                    setTimeout(function(){
                        res.status(200).json({ statusCode: 200, message: '成功查询', result: results, totalCount: totalCount.results[0].totalCount});
                    },300)
                   
                } else {
                    res.json({ err: err });
                }
            })
    
    })()
}


module.exports = { liveList } 