var mysql      = require('mysql');
var moment     = require('moment');
let superagent = require('superagent');

connection.connect();

let url = 'http://api.tianapi.com/txapi/godreply/index?';
let count = 0;
function get(url) {
  superagent.get(url)
    .end(function (err, res) {
      let result = JSON.parse(res.text);
      let sql = 'SELECT content FROM godreply';
      connection.query(sql, function (errq, resq) {
        let index = resq.findIndex((item) => { return result.newslist[0].content == item.content });
        console.log(index == -1 ? "唯一" : `重复${moment()}`);
        if(index == -1){
          let addSql = 'INSERT INTO godreply(title,content,create_time) VALUES(?,?,?)';
          let addSqlParams = [
            result.newslist[0].title, 
            result.newslist[0].content, 
            moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
          ];
          connection.query(addSql,addSqlParams,function (errx, resx) {
            let timer = setTimeout(() => {
              if(count == 50000){
                connection.end();
                return;
              }
              count++;
              get(url);
              clearTimeout(timer);
            }, 300);
          });
        }else{
          let timeset = setTimeout(() => {
            get(url);
            clearTimeout(timeset);
          }, 300);
        }
      })
    });
}
get(url);