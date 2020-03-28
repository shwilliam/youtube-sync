import IO from 'socket.io-client/dist/socket.io.js'

// TODO: handle error connecting to server
const socket = IO(`${process.env.REACT_APP_URL}:${process.env.PORT || '3000'}`)

export default socket
