const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors');

const koajwt = require('koa-jwt');
const response_formatter=require('./middlewares/response_formatter')
const errorHandle = require('./middlewares/jwtErrorHandle')
const loggerHandle = require('./middlewares/loggerHandle')

const user = require('./routes/user')
const captcha = require('./routes/captcha')
const article = require('./routes/article')
const upload = require('./routes/upload')

// error handler
onerror(app)

// 具体参数我们在后面进行解释
app.use(cors({
    origin: 'http://localhost:8081',
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))


// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
//控制台日志
app.use(logger()) 
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// loggerHandle 本地日志
app.use(loggerHandle);

// jwt错误处理
app.use(errorHandle);


app.use(koajwt({
        secret: 'my_token'
    }).unless({
        path: [
          /\/api\/users\/registerUser/,
          /\/api\/users\/login/,
          /\/api\/article/,
          /\/captcha/,
          /\/upload/,
        ]
    }));
// 所有走/api/打头的请求都需要经过jwt验证。
//router.use('/api', jwt({ secret: db.jwtSecret }), apiRouter.routes()); 
//添加格式化处理响应结果的中间件，在添加路由之前调用
app.use(response_formatter('^/api'));
// routes 
app.use(user.routes(), user.allowedMethods())
app.use(captcha.routes(), captcha.allowedMethods())
app.use(article.routes(), article.allowedMethods())
app.use(upload.routes(), upload.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
