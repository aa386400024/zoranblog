var express = require('express');
var router = express.Router();
const querySql = require('../db/index'); // 导入数据库模块
const { PWD_SALT, PRIVATE_KEY, EXPIRESD } = require('../utils/constent'); // 引入常量秘钥
const { md5, upload } = require('../utils/index'); // 引入md5加密方法和文件上传中间件
const jwt = require('jsonwebtoken'); // 引入jsonwebtoken模块，是token的加密算法

// 注册接口
router.post('/register', async(req, res, next) => {
  // 通过req.body获取前端传过来的username, password, nickname
  let { username, password, nickname } = req.body
  try {
    let user = await querySql('select * from user where username = ?', [username])
    console.log(res);
    // 判断用户名是否存在于user表中
    if(!user || user.length === 0) {
      // 通过调用md5方法将password加密（${password}${PWD_SALT}，就是将password和常量PWD_SALT拼接）
      password = md5( `${password}${PWD_SALT}` )
      console.log(password);

      // 没有查到用户名，则注册用户名，插入到数据库
      await querySql('insert into user(username, password, nickname) value(?,?,?)', [username, password, nickname])
      res.send({ code: 0, msg: '注册成功' })
    }else {
      res.send({ code: -1, msg: '该账户已注册' })
    }
  } catch (error) {
    console.log(e);
    next(e)
  }
});

// 登录接口
router.post('/login', async(req, res, next) => {
  // 通过req.body获取前端传过来的username, password, nickname
  let { username, password } = req.body
  try {
    // 查看用户名是否存在user表中
    let user = await querySql('select * from user where username = ?', [username])
    // 判断是否有user
    if(!user || user.length === 0) {
      // 如果没有查到用户名，则提示账号不存在
      res.send({ code: -1, msg: '该账户不存在' })
    }else {
      // 查询到用户名user
      // 对密码进行md5加密
      password = md5( `${password}${PWD_SALT}` )
      // 前端传入的username和password和数据库中的username和password对比
      let result = await querySql('select * from user where username = ? and password = ?', [username, password])
      // 判断数据库中的用户名和密码和输入的账号密码匹配后，才能登陆
      if(!result || result.length === 0) {
        // 不匹配，提示账号或密码不正确
        res.send({ code: -1, msg: '账号或密码不正确' })
      }else {
        // 完全匹配，生成token
        // sign()的第一个参数：要存储的内容。 第二个参数：秘钥。 第三个参数：过期时间
        let token = jwt.sign({username}, PRIVATE_KEY, {expiresIn:EXPIRESD})
        res.send({ code: 0, msg: '登陆成功', token: token })
      }
    }
  } catch (error) {
    console.log(e);
    next(e)
  }
})

// 获取用户信息接口
router.get('/info', async(req, res, next) => {
  // 前端传过来的username数据
  let {username} = req.user
  try {
    // 在user数据库中查看查找username,由于username和password是敏感信息，所以按需查找
    let userinfo = await querySql('select nickname, head_img from user where username = ?', [username])
    console.log(userinfo);
    // 将用户信息返回给前端
    res.send({ code: 0, msg: '获取成功', data: userinfo[0] })
  } catch (e) {
    console.log(e);
    next(e)
  }
})

// 头像上传接口
// upload.single单文件上传
router.post('/upload', upload.single('head_img'), async(req, res, next) => {
  console.log(req.file); // 前端上传的文件的信息
  // .split('public')[1]通过这个方法，把路径从public中间截开，1代表public后面的内容
  let imgPath = req.file.path.split('public')[1]
  // 将截取的路径和服务器拼接
  let imgUrl = 'http://112.126.63.123:3000' + imgPath
  // 发送给前端
  res.send({ code: 0, msg: '上传成功', data: imgUrl })
})

// 保存后，用户信息更新接口
router.post('/update', async(req, res, next) => {
  // 获取前端返回的数据内容
  let {nickname, head_img} = req.body
  // 用户更新需要传token，所以需要获取token
  // token会经过解密之后，存在 req.user 里面
  let {username} = req.user
  try {
    // 在数据库中查看查找nickname,head_img,username
    let result = await querySql('update user set nickname = ?, head_img = ? where username = ?', [nickname, head_img, username])
    console.log(result);
    // 将用户信息返回给前端
    res.send({ code: 0, msg: '更新成功', data: null })   
  } catch (error) {
    console.log(error);
    next(error)
  }
})
module.exports = router;
