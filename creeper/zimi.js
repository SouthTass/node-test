var mysql      = require('mysql');
var moment     = require('moment');
let superagent = require('superagent');
connection.connect();

let url = 'http://api.tianapi.com/txapi/zimi/index';
let count = 0;
let checkTime = 100;
function get(url) {
  superagent.get(url)
  .end(function (err, res) {
    let result = JSON.parse(res.text);
    let lastData = `SELECT id FROM zimi ORDER BY id desc limit 1`;
    connection.query(lastData, function(errl, resl) {
      if(resl.length > 0){
        count = resl[0].id;
      }else{
        count = 0;
      }   
      let sql = `SELECT content FROM zimi WHERE content = "${result.newslist[0].content}"`;
      connection.query(sql, function (errq, resq) {
        if(resq && resq.length < 1){
          console.log(`次数: ${count} 唯一`);
          let addSql = 'INSERT INTO zimi(reason, answer, content, create_time) VALUES(?, ?, ?, ?)';
          let addSqlParams = [
            result.newslist[0].reason,
            result.newslist[0].answer,
            result.newslist[0].content, 
            moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
          ];
          connection.query(addSql, addSqlParams, function (errx, resx) {
            let timer = setTimeout(() => {
              if(count == 50000) return connection.end();
              count++;
              get(url);
              clearTimeout(timer);
            }, checkTime);
          });
        }else{
          console.log(`次数: ${count} 重复内容，重新请求。${moment().format('YYYY年MM月DD日 HH点mm分ss秒')}`);
          let timeset = setTimeout(() => {
            get(url);
            clearTimeout(timeset);
          }, checkTime);
        }
      })
    })
  });
}
get(url)