const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>')
})

io.on('connection', socket => {
  socket.on('state_change', state => {
    socket.broadcast.emit('state_change', state)
  })
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})
