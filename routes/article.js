var express = require('express');
var router = express.Router();
const querySql = require('../db/index') // 导入数据库模块
const { showUpload } = require('../utils/index'); // 引入md5加密方法和文件上传中间件

/* 新增博客接口 */
router.post('/add', async(req, res, next) => {
  // 获取前端返回的数据内容
  let {title, content, thumb_img} = req.body
  // 用户更新需要传token，所以需要获取token
  // token会经过解密之后，存在 req.user 里面
  let {username} = req.user
  try { 
    // 在数据库中查找username
    let result = await querySql('select id from user where username = ?', [username])
    // console.log(result);
    // 当前博客的id。user_id
    let user_id = result[0].id
    // 将内容插入数据库
    await querySql('insert into article(title, content, thumb_img, user_id, create_time) values(?, ?, ?, ?, NOW())', [title, content, thumb_img, user_id])
    // console.log(user_id);
    // 将信息返回给前端
    res.send({ code: 0, msg: '新增成功', data: null })
  }catch (e) {
    console.log(e);
    next(e)
  }
});

// 头像上传接口
// upload.single单文件上传
router.post('/upload', showUpload.single('thumb_img'), async(req, res, next) => {
  console.log(req.file); // 前端上传的文件的信息
  // .split('public')[1]通过这个方法，把路径从public中间截开，1代表public后面的内容
  let imgPath = req.file.path.split('public')[1]
  // 将截取的路径和服务器拼接
  let imgUrl = 'http://127.0.0.1:3000' + imgPath
  // 发送给前端
  res.send({ code: 0, msg: '上传成功', data: imgUrl })
})

// 首页上获取全部博客列表的接口
router.get('/allList', async(req, res, next) => {
  try {
    // 在数据库article中查找id, title, content,create_time
    let sql = 'select id, title, content, thumb_img, DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article'
    let result = await querySql(sql)
    res.send({ code: 0, msg: '获取成功', data: result })
  } catch (error) {
    console.log(e);
    next(e)
  }
})

// 获取我的博客列表的接口
router.get('/myList', async(req, res, next) => {
  // 从req.user中获取token
  let {username} = req.user
  try {
    // 查询用户id
    let userSql = 'select id from user where username = ?'
    let user = await querySql(userSql, [username])
    // console.log(user);

    // 获取到博客用户id
    let user_id = user[0].id
    let sql = 'select id, title, content, DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article where user_id = ?'
    // 在数据库中查找article,找到user_id对应用户
    let result = await querySql(sql, [user_id])
    // 将result里面的数据返回给前端
    res.send({ code: 0, msg: '获取成功', data: result })
  }catch(e) {
    console.log(e);
    next(e)
  }
})

// 获取博客详情接口
router.get('/detail', async(req, res, next) => {
  // 获取博客id,因为是get请求，所以用req.query
  let article_id = req.query.article_id
  try {
    let sql = 'select id, title, content, thumb_img, DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article where id = ?'
    // 在数据库中查找article,找到user_id对应用户
    let result = await querySql(sql, [article_id])
    // 将result里面的数据返回给前端
    console.log(result[0]);
    res.send({ code: 0, msg: '获取成功', data: result[0] })
  } catch (e) {
    console.log(e);
    next(e)
  }
})

// 博客更新接口
router.post('/update', async(req, res, next) => {
  // 获取博客id,因为是post请求，所以用req.body
  let { title, content, thumb_img, article_id } = req.body
  let {username} = req.user
  try {
    // 查询用户id
    let userSql = 'select id from user where username = ?'
    let user = await querySql(userSql, [username])
    // 获取到user_id,也就是对应作者的ID
    let user_id = user[0].id
    console.log(user_id)
    let sql = 'update article set title = ?, content = ?, thumb_img = ? where id = ? and user_id = ?'
    // 在数据库中查找article,
    let result = await querySql(sql, [title, content, thumb_img, article_id, user_id])
    // 将result里面的数据返回给前端
    // console.log(result[0]);
    res.send({ code: 0, msg: '更新成功', data: null })
  }catch(e) {
    console.log(e);
    next(e)
  }
});

// 删除博客接口
router.post('/delete', async(req, res, next) => {
  // 获取博客文章id,因为是post请求，所以用req.body
  let { article_id } = req.body
  // 当前用户的username
  let {username} = req.user
  try {
    // 数据库中查询用户id
    let userSql = 'select id from user where username = ?'
    let user = await querySql(userSql, [username])
    // 通过user.id获取当前用户的id值
    let user_id = user[0].id
    let sql = 'delete from article where id = ? and user_id = ?'
    // sql, [article_id, user_id]和前端传的内容做一下比对
    let result = await querySql(sql, [article_id, user_id])
    // 将result里面的数据返回给前端
    console.log(result[0]);
    res.send({ code: 0, msg: '删除成功', data: null })
  }catch(e) {
    console.log(e);
    next(e)
  }
});

module.exports = router;
