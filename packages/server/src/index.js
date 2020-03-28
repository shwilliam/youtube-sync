const express = require('express')
const app = express()
const path = require('path')
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const PORT = process.env.PORT || '3000'

app.use(express.static(path.join(__dirname, '../build')))

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'))
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

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})
