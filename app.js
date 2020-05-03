var createError = require('http-errors'); // 报错提示的依赖
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); // 日志模块
const cors = require('cors'); // 引入cors跨域中间件
const expressJWT = require('express-jwt'); // 解密jwt的中间件
const { PRIVATE_KEY } = require('./utils/constent'); // token的秘钥

var artRouter = require('./routes/article');
var usersRouter = require('./routes/users');
var commentRouter = require('./routes/comment');
var bannerRouter = require('./routes/banner');
var newsRouter = require('./routes/news');
var friendlyLinkRouter = require('./routes/friendlylink');
var proposalRouter = require('./routes/proposal');

var app = express();
console.log(2);

// view engine setup 设置模板引擎，和views文件夹是对应的
// path.join()方法是将多个参数字符串合并成一个路径字符串
// express.static方法是将静态文件目录设置为：项目根目录+public
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors()); // 调用跨域cors方法
app.use(logger('dev')); // 生成日志的操作
// Express中内置的中间件功能。它使用JSON有效负载分析传入请求，并基于body-parser。
app.use(express.json()); // 对传的参数进行解析
app.use(express.urlencoded({ extended: false })); // 对传的参数进行解析
app.use(cookieParser()); // 解析cookie
// path.join()方法是将多个参数字符串合并成一个路径字符串
// express.static方法是将静态文件目录设置为：项目根目录+public
app.use(express.static(path.join(__dirname, 'public')));

// 根据秘钥PRIVATE_KEY进行解密，下面的代码要放在路由的前面，做到路由拦截
app.use(expressJWT({
  secret: PRIVATE_KEY // 秘钥
}).unless({ // unless白名单，里面的路由地址不需要校验token
  path: ['/api/user/register', '/api/user/info', '/api/user/login','/api/user/upload', '/api/article/upload', '/api/article/allList','/api/article/detail','/api/comment/list', '/api/banner/upload', '/api/banner/allBanner', '/api/friendlylink/allFriendly', '/api/friendlylink/upload',]  //白名单,除了这里写的地址，其他的URL都需要验证
}));

app.use('/api/article', artRouter);
app.use('/api/user', usersRouter);
app.use('/api/comment', commentRouter);
app.use('/api/banner', bannerRouter);
app.use('/api/news', newsRouter);
app.use('/api/friendlyLink', friendlyLinkRouter);
app.use('/api/proposal', proposalRouter);

// catch 404 and forward to error handler
// 捕获404并转发到错误处理程序
// 如果没有写路由跳转接口(/后面没有配置路由的话)，就按下面的方法处理
app.use(function(req, res, next) {
  next(createError(404)); // 使用next交给下面的中间件处理
});

// error handler 错误处理程序
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    // 这个需要根据自己的业务逻辑来处理理
    res.status(401).send({ code:-1, msg:'token验证失败' });
  }else {
    // set locals, only providing error in development
    // 设置局部变量，只提供开发错误
    res.locals.message = err.message;
    // req.app.get('env')相当于 process.env.NOED_ENV
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page 呈现错误页
    res.status(err.status || 500);
    res.render('error'); // 渲染error模板
  }
});

module.exports = app;
