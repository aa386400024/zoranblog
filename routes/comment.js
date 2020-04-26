var express = require('express');
var router = express.Router();
const querySql = require('../db/index') // 导入数据库模块

// 发表评论接口
router.post('/public', async(req, res, next) => {
  // 获取前端返回的数据内容
  let {content, article_id} = req.body
  // 用户更新需要传token，所以需要获取token
  // token会经过解密之后，存在 req.user 里面
  let {username} = req.user 
  try {
    // 根据user查询用户表，返回username对应的id，head_img, nickname
    let userSql = 'select id, head_img, nickname from user where username = ?'
    let user = await querySql(userSql, [username])
    // 从用户表user里获取的用户数据， id:user_id对应的就是user[0]里的id值。因为是解构赋值，所以这么写
    let {id:user_id, head_img, nickname} = user[0]
    // 将对应字段插入到数据库comment表中
    let sql = 'insert into comment(user_id, article_id, cm_content, nickname, head_img, create_time) values(?, ?, ?, ?, ?, NOW())'
    // 字段要和上面的对应
    let result = await querySql(sql, [user_id, article_id, content, nickname, head_img])
    console.log(result[0]);
    // 将result里面的数据返回给前端
    res.send({ code: 0, msg: '评论发表成功', data: null })
  }catch(e) {
    console.log(e);
    next(e)
  }
});

// 评论列表接口
router.get('/list', async(req, res, next) => {
  // 获取前端返回的数据内容,字段要和前端发过来的一样
  let {article_id} = req.query
  try {
    // 根据user查询用户表，返回username对应的id，head_img, nickname
    let sql = 'select id, head_img, nickname, cm_content, DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from comment where article_id = ?'
    // 字段要和前端的相同
    let result = await querySql(sql, [article_id])
    console.log(result[0]);
    // 将result里面的数据返回给前端
    res.send({ code: 0, msg: '成功', data: result })
  }catch(e) {
    console.log(e);
    next(e)
  }
});

module.exports = router;
