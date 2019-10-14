import IO from 'socket.io-client/dist/socket.io.js'

// TODO: handle error connecting to server
const socket = IO('http://localhost:3000')

export default socket
