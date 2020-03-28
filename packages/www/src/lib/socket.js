import IO from 'socket.io-client/dist/socket.io.js'

// TODO: handle error connecting to server
export const socket = IO(
  `${process.env.REACT_APP_URL}:${process.env.PORT || '3000'}`,
)
