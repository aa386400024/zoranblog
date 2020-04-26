let dbOption
// dbOption = {
//   connectionLimit: 10, // 同时创建连接的最大连接数
//   host: 'localhost', // 主机名
//   user: 'root', //MySQL认证用户名
//   password: '0126zhang', // 本地数据库的密码
//   port: '3306', // 端口号
//   database: 'zoranblog' // 连接的数据库名称
// }

// 修改为阿里云服务器上的mysql数据库
dbOption = {
  connectionLimit: 10, // 同时创建连接的最大连接数
  host: '112.126.63.123', // 主机名
  user: 'root', //MySQL认证用户名
  password: '0126ZHang', // 本地数据库的密码
  port: '3306', // 端口号
  database: 'zoranblog' // 连接的数据库名称
}
module.exports = dbOption