var express = require('express');
var router = express.Router();
const querySql = require('../db/index') // 导入数据库模块
const { bannerUpload } = require('../utils/index'); // 引入文件上传中间件

/* 新增轮播图接口 */
router.post('/add', async(req, res, next) => {
  // 获取前端返回的数据内容
  let {title, banner_img, banner_href} = req.body
  // 用户更新需要传token，所以需要获取token
  // token会经过解密之后，存在 req.user 里面
  let {username} = req.user
  try { 
    // 在数据库中查找username
    let result = await querySql('select id from user where username = ?', [username])
    // console.log(result);
    // 当前博客的id。user_id
    // let user_id = result[0].id
    // 将内容插入数据库
    await querySql('insert into banner(title, banner_img, banner_href, create_time) values(?, ?, ?, NOW())', [title, banner_img, banner_href])
    // console.log(user_id);
    // 将信息返回给前端
    res.send({ code: 0, msg: '新增成功', data: null })
  }catch (e) {
    console.log(e);
    next(e)
  }
});

// 轮播图上传接口
// upload.single单文件上传
router.post('/upload', bannerUpload.single('banner_img'), async(req, res, next) => {
  console.log(req.file); // 前端上传的文件的信息
  // .split('public')[1]通过这个方法，把路径从public中间截开，1代表public后面的内容
  let imgPath = req.file.path.split('public')[1]
  // 将截取的路径和服务器拼接
  let imgUrl = 'http://112.126.63.123:3000' + imgPath
  // 发送给前端
  res.send({ code: 0, msg: '上传成功', data: imgUrl })
})

// 首页上获取全部博客列表的接口
router.get('/allBanner', async(req, res, next) => {
  try {
    // 在数据库article中查找id, title, content,create_time
    let sql = 'select id, title, banner_img, banner_href, DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from banner'
    let result = await querySql(sql)
    res.send({ code: 0, msg: '获取成功', data: result })
  } catch (error) {
    console.log(e);
    next(e)
  }
})

// 轮播图更新接口
router.post('/update', async(req, res, next) => {
  // 获取banner的id,因为是post请求，所以用req.body
  let { title, banner_img, banner_href, banner_id } = req.body
  let {username} = req.user
  try { 
    // 查询用户id
    let userSql = 'select id from user where username = ?'
    let user = await querySql(userSql, [username])
    // 获取到user_id,也就是对应作者的ID
    let user_id = user[0].id
    console.log(user_id)
    let sql = 'update banner set title = ?, banner_img = ?, banner_href = ? where id = ?'
    // 在数据库中查找banner,
    let result = await querySql(sql, [title, banner_img, banner_href, banner_id])
    // 将result里面的数据返回给前端
    // console.log(result[0]);
    res.send({ code: 0, msg: '更新成功', data: null })
  }catch(e) {
    console.log(e);
    next(e)
  }
});

// 获取轮播详情接口
router.get('/getlist', async(req, res, next) => {
  // 获取博客id,因为是get请求，所以用req.query
  let banner_id = req.query.banner_id
  try {
    let sql = 'select id, title, banner_img, banner_href, DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from banner where id = ?'
    // 在数据库中查找article,找到user_id对应用户
    let result = await querySql(sql, [banner_id])
    // 将result里面的数据返回给前端
    console.log(result[0]);
    res.send({ code: 0, msg: '获取成功', data: result[0] })
  } catch (e) {
    console.log(e);
    next(e)
  }
})

// 删除轮播接口
router.post('/delete', async(req, res, next) => {
  // 获取轮播图id,因为是post请求，所以用req.body
  let { banner_id } = req.body
  // 当前用户的username
  let {username} = req.user
  try {
    // 数据库中查询用户id
    let userSql = 'select id from user where username = ?'
    let user = await querySql(userSql, [username])
    // 通过user.id获取当前用户的id值
    let user_id = user[0].id
    let sql = 'delete from banner where id = ?'
    // sql, [banner_id, user_id]和前端传的内容做一下比对
    let result = await querySql(sql, [banner_id])
    // 将result里面的数据返回给前端
    console.log(result[0]);
    res.send({ code: 0, msg: '删除成功', data: null })
  }catch(e) {
    console.log(e);
    next(e)
  }
});


module.exports = router;