const mysql       = require('mysql')
const moment      = require('moment')
const superagent  = require('superagent')
const { 
  tianapi, 
  dataBase
}                 = require('../config/config')
const { 
  currentTime     
}                 = require('../plugins/utils')
const tianurl     = 'http://api.tianapi.com/txapi/hsjz/index'

var count         = 0
const endNum      = 50000

const connection = mysql.createConnection({
  host     : dataBase.host,
  user     : dataBase.user,
  password : dataBase.password,
  database : dataBase.database
});
connection.connect()

async function getApi(){
  count++
  try{
    let res = await superagent(`${tianurl}?key=${tianapi.key}`)
    if(res.status != 200) return
    let text = JSON.parse(res.text)
    verdictInclude(text.newslist[0].content)
  }catch(err){
    console.log(`接口有误(getApi) ===> ${currentTime()}`)
  }
}

async function verdictInclude(content){
  let sql = `SELECT id FROM hsjz WHERE content = '${content}'`
  connection.query(sql, function(err, res){
    if(res && res.length < 1) writeDataBase(content)
  })
}

async function writeDataBase(content){
  let sql = 'INSERT INTO hsjz(content, created_at) VALUES(?, ?)'
  let val = [content, currentTime('YYYY-MM-DD HH:mm:ss')]
  connection.query(sql, val, function (err, res) {
    console.log(`插入成功(writeDataBase) ===> ${currentTime()}`)
  })
}

async function initFunction(){
  let timer = setInterval(() => {
    if(count >= endNum){
      connection.end()
      clearInterval(timer)
    }else{
      getApi()
    }
    if(count % 10 == 1){
      console.log(`程序运行中(initFunction) ===> ${currentTime()}，当前计数：${count}`)
    }
  }, 300)
}

initFunction()