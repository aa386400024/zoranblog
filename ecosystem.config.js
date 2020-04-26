module.exports = {
  apps : [{
    name: 'app',
    script: './bin/www',
    instances: 1,
    autorestart: true,
    watch: true, // 开启监听
    ignore_watch: [ // 不不用监听的文件
      "node_modules",
      "logs"
    ],
    "error_file": "./logs/app-err.log", // 错误日志文件
    "out_file": "./logs/app-out.log", // 输出日志文件
    "log_date_format": "YYYY-MM-DD HH:mm:ss", // 给每行日志标记一个时间
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  // 自动化部署
  deploy : {
    production : {
      user : 'root', // 服务器的名
      host : '112.126.63.123', // 服务器ip
      ref  : 'origin/master',
      repo : 'git@github.com:aa386400024/zoranblog.git', // github上的链接
      path : '/usr/local/myProject', // 存放在服务器上的路径
      ssh_options: "StrictHostKeyChecking=no", // 秘钥检测设置为不需要
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      "env": {
        "NODE_ENV": "production"
        }
    }
  }
};
