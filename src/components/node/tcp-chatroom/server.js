const net = require('net')
const types = require('./types')
const server = net.createServer()

const users = []

server.on('connection', clientSocket => {
  clientSocket.on('data', data => {
    data = JSON.parse(data.toString().trim())
    switch (data.type) {
      case types.login:
        if (users.find(item => item.nickname === data.nickname)) {
          return clientSocket.write(JSON.stringify({
            type: types.login,
            success: false,
            message: '该用户已存在'
          }))
        }
        clientSocket.nickname = data.nickname
        users.push(clientSocket)
        clientSocket.write(JSON.stringify({
          type: types.login,
          success: true,
          message: '登陆成功',
          nickname: data.nickname,
          sumUsers: users.length
        }))
        users.forEach(user => {
          if (user.nickname !== clientSocket.nickname) {
            user.write(JSON.stringify({
              type: types.log,
              message: `${data.nickname} 进入了聊天室，当前在线用户：${users.length}`
            }))
          }
        })
        break
      case types.broadcast:
        users.forEach(item => {
          item.write(JSON.stringify({
            type: types.broadcast,
            nickname: clientSocket.nickname,
            message: data.message
          }))
        })
        break
      case types.p2p:
        const user = users.find(item => item.nickname === data.nickname)
        if (!user) {
          return clientSocket.write(JSON.stringify({
            type: types.p2p,
            success: false,
            message: '该用户不存在'
          }))
        }

        user.write(JSON.stringify({
          type: types.p2p,
          success: true,
          nickname: clientSocket.nickname,
          message: data.message
        }))
        break
    }
  })

  clientSocket.on('end', () => {
    const index = users.findIndex(user => user.nickname === clientSocket.nickname)
    if (index !== -1) {
      // const offlineUser = users[index]
      users.splice(index, 1)
      users.forEach(user => {
        user.write(JSON.stringify({
          type: types.log,
          message: `${clientSocket.nickname} 离开了聊天室，当前在线用户：${users.length}`
        }))
      })
    }
  })

  // clientSocket.on("error", function (err) {
  //   console.log('出错啦', err)
  //   const index = users.findIndex(user => user.nickname === clientSocket.nickname)
  //   if (index !== -1) {
  //     // const offlineUser = users[index]
  //     users.splice(index, 1)
  //     users.forEach(user => {
  //       user.write(JSON.stringify({
  //         type: types.log,
  //         message: `${clientSocket.nickname} 离开了聊天室，当前在线用户：${users.length}`
  //       }))
  //     })
  //   }
  // });
})

server.listen(3000, () => console.log('Server running...'))
