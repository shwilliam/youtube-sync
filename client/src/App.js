import React, {useEffect} from 'react'
import useYtPlayer from './hooks/useYtPlayer'
import socket from './lib/socket'

function App() {
  const [player] = useYtPlayer()

  useEffect(() => {
    if (!player) return

    socket.on('state_change', state => {
      switch (state) {
        case 'play':
          return player.playVideo()
        case 'pause':
          return player.pauseVideo()
        case 'stop':
          return player.stopVideo()
        default:
          break
      }
    })

    socket.on('connection', () => {
      let time
      try {
        time = player.getCurrentTime()
        socket.emit('time_change', time)
      } catch (e) {
        console.error(e)
      }
    })

    socket.on('time_change', time => {
      try {
        player.seekTo(Number(time))
      } catch (e) {
        console.error(e)
        alert('Unable to sync time')
      }
    })

    socket.on('request_time_change', () => {
      let time
      try {
        time = player.getCurrentTime()
        socket.emit('time_change', time)
      } catch (e) {
        console.error(e)
      }
    })
  }, [player])

  // TODO: fix unable to sync until video play
  const onPlay = () => {
    socket.emit('state_change', 'play')
    player.playVideo()
  }

  const onPause = () => {
    socket.emit('state_change', 'pause')
    player.pauseVideo()
  }

  const onStop = () => {
    socket.emit('state_change', 'stop')
    player.stopVideo()
  }

  const onSync = () => {
    socket.emit('time_change', player.getCurrentTime())
  }

  const onSyncRequest = () => {
    socket.emit('request_time_change')
  }

  const onChangeTime = d => {
    const newTime = player.getCurrentTime() + d
    socket.emit('time_change', newTime)
    player.seekTo(newTime)
  }

  return (
    <div className="App">
      <div id="player" style={{'pointer-events': 'none'}} />

      {player ? (
        <div>
          <button onClick={onPlay} type="button">
            play
          </button>
          <button onClick={onPause} type="button">
            pause
          </button>
          <button onClick={onStop} type="button">
            stop
          </button>
          <button onClick={onSync} type="button">
            sync others
          </button>
          <button onClick={onSyncRequest} type="button">
            sync
          </button>
          <button onClick={() => onChangeTime(-5)} type="button">
            -5
          </button>
          <button onClick={() => onChangeTime(5)} type="button">
            +5
          </button>
        </div>
      ) : (
        'loading...'
      )}
    </div>
  )
}

export default App
