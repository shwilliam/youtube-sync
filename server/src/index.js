const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>')
})

io.on('connection', socket => {
  socket.broadcast.emit('connection')

  socket.on('state_change', state => {
    socket.broadcast.emit('state_change', state)
  })
  socket.on('time_change', time => {
    socket.broadcast.emit('time_change', time)
  })
  socket.on('request_time_update', () => {
    socket.broadcast.emit('request_time_update')
  })
  socket.on('request_video_id', () => {
    socket.broadcast.emit('request_video_id')
  })
  socket.on('update_video_id', id => {
    socket.broadcast.emit('update_video_id', id)
  })
  socket.on('update_video', id => {
    socket.broadcast.emit('update_video', id)
  })
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})
