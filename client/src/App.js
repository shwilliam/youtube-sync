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

    socket.on('time_change', time => {
      player.seekTo(Number(time))
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

  const onSyncTime = () => {
    socket.emit('time_change', player.getCurrentTime())
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
          <button onClick={onSyncTime} type="button">
            sync
          </button>
        </div>
      ) : (
        'loading'
      )}
    </div>
  )
}

export default App
