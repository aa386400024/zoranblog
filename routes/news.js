var express = require('express');
var router = express.Router();
const request = require('request');


// router.get('/newList', async(req, res, next) => {
//   let url = 'http://v.juhe.cn/toutiao/index?type=top&key=2ebb30e58527ef3622155f3c56e3f223'
//   res.send({code: 200, msg: '新闻列表', dada: url})
// })

// request({
//   url: url,//请求路径
//   method: "POST",//请求方式，默认为get
//   headers: {//设置请求头
//       "content-type": "application/json",
//   },
//   body: JSON.stringify(requestData)//post参数字符串
// }, function(error, response, body) {
//   if (!error && response.statusCode == 200) {
//   }
// });

// router.get('/newList', (req, res, next) => {
//   request('http://v.juhe.cn/toutiao/index?type=keji&key=2ebb30e58527ef3622155f3c56e3f223', (error, response, body) => {
//     let data = JSON.parse(body)
//     res.send({code: 200, msg: '新闻列表', data: data})
//   })
// })

module.exports = router;