const crypto = require('crypto'); // 引入密码加密模块
const multer = require('multer'); // 图片上传中间件
const fs = require('fs');
const path = require('path');


function md5(s){
  //注意参数需要为string类型，否则会报错
  return crypto.createHash('md5').update(String(s)).digest('hex');
}

// 文件上传方法
let upload = multer({
  storage: multer.diskStorage({
    // 设置文件存储位置
    destination: function (req, file, cb) {
      // 创建年月日变量，作为文件夹的名字
      let date = new Date()
      let year = date.getFullYear()
      let month = (date.getMonth() + 1).toString().padStart(2, '0')
      let day = date.getDate()
      // 将图片存到 /public/uploads 中
      let dir = path.join(__dirname,'../public/uploads/' + year + month
      + day)
      // 判断目录是否存在，没有则创建
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true})
      }
      // dir就是上传文件存放的目录
      cb(null, dir)
    },
    // 设置文件名称
    filename: function (req, file, cb) {
      let fileName = Date.now() + path.extname(file.originalname)
      // fileName就是上传文件的文件名
      cb(null, fileName)
    }
  })
  })

// 缩略图文件上传方法
let showUpload = multer({
  storage: multer.diskStorage({
    // 设置文件存储位置
    destination: function (req, file, cb) {
      // 创建年月日变量，作为文件夹的名字
      let date = new Date()
      let year = date.getFullYear()
      let month = (date.getMonth() + 1).toString().padStart(2, '0')
      let day = date.getDate()
      // 将图片存到 /public/uploads 中
      let dir = path.join(__dirname,'../public/showuploads/' + year + month
      + day)
      // 判断目录是否存在，没有则创建
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true})
      }
      // dir就是上传文件存放的目录
      cb(null, dir)
    },
    // 设置文件名称
    filename: function (req, file, cb) {
      let fileName = Date.now() + path.extname(file.originalname)
      // fileName就是上传文件的文件名
      cb(null, fileName)
    }
  })
  })

// 轮播缩略图文件上传方法
let bannerUpload = multer({
  storage: multer.diskStorage({
    // 设置文件存储位置
    destination: function (req, file, cb) {
      // 创建年月日变量，作为文件夹的名字
      let date = new Date()
      let year = date.getFullYear()
      let month = (date.getMonth() + 1).toString().padStart(2, '0')
      let day = date.getDate()
      // 将图片存到 /public/uploads 中
      let dir = path.join(__dirname,'../public/banneruploads/' + year + month
      + day)
      // 判断目录是否存在，没有则创建
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true})
      }
      // dir就是上传文件存放的目录
      cb(null, dir)
    },
    // 设置文件名称
    filename: function (req, file, cb) {
      let fileName = Date.now() + path.extname(file.originalname)
      // fileName就是上传文件的文件名
      cb(null, fileName)
    }
  })
})

// 友情链接缩略图文件上传方法
let friendlyUpload = multer({
  storage: multer.diskStorage({
    // 设置文件存储位置
    destination: function (req, file, cb) {
      // 创建年月日变量，作为文件夹的名字
      let date = new Date()
      let year = date.getFullYear()
      let month = (date.getMonth() + 1).toString().padStart(2, '0')
      let day = date.getDate()
      // 将图片存到 /public/uploads 中
      let dir = path.join(__dirname,'../public/friendlyupload/' + year + month
      + day)
      // 判断目录是否存在，没有则创建
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true})
      }
      // dir就是上传文件存放的目录
      cb(null, dir)
    },
    // 设置文件名称
    filename: function (req, file, cb) {
      let fileName = Date.now() + path.extname(file.originalname)
      // fileName就是上传文件的文件名
      cb(null, fileName)
    }
  })
})

// 将md5这个方法暴露出去
module.exports = {
  md5,
  upload,
  showUpload,
  bannerUpload,
  friendlyUpload
}