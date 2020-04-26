var express = require('express');
var router = express.Router();
const querySql = require('../db/index') // 导入数据库模块

// 提交意见接口
router.post('/pubProposal', async(req, res, next) => {
  // 获取前端返回的数据内容
  let {pr_content} = req.body
  try {
    let sql = 'insert into proposal(pr_content, create_time) values(?, NOW())'
    // 字段要和上面的对应
    let result = await querySql(sql, [pr_content])
    console.log(result[0]);
    // 将result里面的数据返回给前端
    res.send({ code: 0, msg: '意见发表成功', data: null })
  }catch(e) {
    console.log(e);
    next(e)
  }
});

// 意见列表接口
router.get('/list', async(req, res, next) => {
  try {
    // 根据user查询用户表，返回username对应的id，head_img, nickname
    let sql = 'select id, pr_content, DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from proposal'
    // 字段要和前端的相同
    let result = await querySql(sql)
    console.log(result[0]);
    // 将result里面的数据返回给前端
    res.send({ code: 0, msg: '成功', data: result })
  }catch(e) {
    console.log(e);
    next(e)
  }
});

// 删除意见接口
router.post('/delete', async(req, res, next) => {
  // 获取轮播图id,因为是post请求，所以用req.body
  let { proposal_id } = req.body
  try {
    let sql = 'delete from proposal where id = ?'
    // sql, [banner_id, user_id]和前端传的内容做一下比对
    let result = await querySql(sql, [proposal_id])
    // 将result里面的数据返回给前端
    console.log(result[0]);
    res.send({ code: 0, msg: '删除意见成功', data: null })
  }catch(e) {
    console.log(e);
    next(e)
  }
});


module.exports = router;