const net = require('net')
const server = net.createServer()

server.on('connection', clientSocket => {
  console.log('有新的链接进来了')
  // 监听通过clientSocket的data事件
  clientSocket.on('data', data => {
    console.log('客户端：' + data.toString())
  })
  // 给客户端发消息
  // 通过clientSocket，给当前客户端发送数据
  clientSocket.write('hello')
})

server.listen(3000, () => {
  console.log('server running')
})
