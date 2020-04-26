const mysql = require('mysql');
const dbOption = require('./config');

// 创建连接池
// mysql.createConnection 建立 mysql 连接的方法
const pool = mysql.createPool(dbOption);
function query(sql, params) {
  return new Promise((resolve, reject) => {
    // 获取连接
    // 避免开太多的线程，提升性能
    pool.getConnection((err, conn) => {
      if(err) {
        reject(err)
        return
      }
      // query方法执行mysql语句
      conn.query(sql, params, (err, result) => {
        // 调用connection.release（）会将连接释放回池中，以便再次可用。
        conn.release() // 不管成功失败，都要release（释放）出去 归还资源 
        if(err) {
          reject(err)
          return
        }
        // 将结果resolve出去,Promise里的第一个参数resolve
        resolve(result)
      })
    })
  })
}
module.exports = query