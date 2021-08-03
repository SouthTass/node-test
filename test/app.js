const Koa = require('koa');
const xlsx = require('node-xlsx')
const fs = require("fs")
const app = new Koa()
const KoaJson = require('koa-json')
const KoaBody = require('koa-body')
app.use(KoaBody())
app.use(KoaJson())

app.use(async (ctx, next) => {
  let body = ctx.request.body
  console.log("body", body)
  // let rs = fs.createReadStream(body.file.path)
  // console.log('rs', rs)
  // let sheetList = xlsx.parse(body.file);
  // console.log("sheetList", sheetList)
});

app.listen(3000);