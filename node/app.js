const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))


// 中间件判断跳转
app.use(async (ctx, next) => {

  const {hostname, 'x-client-proto': clientProto} = ctx.request;
  console.log(`https://www.xiaoxili.com${ctx.originalUrl}`)
  // 协议强制 https、域名强制跳转到带 wwww 的域名
  if(clientProto=='http' || hostname =='xiaoxili.com'){
    return ctx.redirect(`https://www.xiaoxili.com${ctx.originalUrl}`)
  }else{
    // 执行正常逻辑
    await next()
  }
})

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
