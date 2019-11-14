// 首先安装 nodemon
// 执行语句 nodemon server.js

const net = require('net')
const client = net.createConnection({
  host: '127.0.0.1',
  port: 3000
})

client.on('connect', () => {
  console.log('connect success')
  // 建立成功后就可以给服务端发送数据
  client.write('world')
  // 当客户端和服务端建立连接成功，监听终端输入
  // 获取终端的输入发送给服务端
  process.stdin.on('data', data => {
    client.write(data.toString().trim())
  })
})
// 客户端监听data事件
client.on('data', data => {
  console.log('服务端：' + data.toString())
})
