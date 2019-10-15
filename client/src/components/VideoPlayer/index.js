import React, {useEffect, useState} from 'react'
import useYtPlayer from '../../hooks/useYtPlayer'
import socket from '../../lib/socket'
import NewVideoInput from './NewVideoInput'

const VideoPlayer = () => {
  const [currentVideoId, setCurrentVideoId] = useState()
  const [player] = useYtPlayer()

  useEffect(() => {
    if (!player) return

    socket.emit('request_video_id')

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

    socket.on('request_time_update', () => {
      let time
      try {
        time = player.getCurrentTime()
        socket.emit('time_change', time)
      } catch (e) {
        console.error(e)
      }
    })

    socket.on('request_video_id', () => {
      if (currentVideoId)
        socket.emit('update_video_id', currentVideoId)
    })

    socket.on('update_video_id', id => {
      if (currentVideoId !== id) setCurrentVideoId(id)
    })

    socket.on('update_video', id => {
      try {
        setCurrentVideoId(id)
      } catch (e) {
        console.error(e)
      }
    })
  }, [player, currentVideoId])

  useEffect(() => {
    if (player && currentVideoId) player.loadVideoById(currentVideoId)
  }, [player, currentVideoId])

  const onPlay = () => {
    socket.emit('request_time_update')
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
    socket.emit('request_time_update')
  }

  const onChangeTime = d => {
    const newTime = player.getCurrentTime() + d
    socket.emit('time_change', newTime)
    player.seekTo(newTime)
  }

  const onNewVideoSubmit = ytId => {
    socket.emit('update_video_id', ytId)
    player.loadVideoById(ytId)
    setCurrentVideoId(ytId)
  }

  return (
    <>
      <NewVideoInput onSubmit={onNewVideoSubmit} />
      <div id="player" style={{pointerEvents: 'none'}} />

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
    </>
  )
}

export default VideoPlayer
