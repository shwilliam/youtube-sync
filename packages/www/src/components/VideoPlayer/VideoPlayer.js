import React, {useEffect, useState} from 'react'
import CheeseToast from 'cheese-toast'
import {socket} from '../../lib'
import {useYtPlayer} from '../../hooks'
import {NewVideoInput} from './NewVideoInput'

export const VideoPlayer = () => {
  const [currentVideoId, setCurrentVideoId] = useState()
  const [player] = useYtPlayer('l0vrsO3_HpU')
  const timeOfInit = performance.now()

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
        new CheeseToast({
          text: 'Unable to sync new user',
          className: 'toast',
        })
      }
    })

    socket.on('time_change', time => {
      try {
        player.seekTo(Number(time))
      } catch (e) {
        console.error(e)

        // avoid trigger on mount
        if (performance.now() - timeOfInit > 500) {
          new CheeseToast({
            text: 'Unable to sync time',
            className: 'toast',
          })
        }
      }
    })
  }, [player])

  useEffect(() => {
    if (!player) return

    socket.emit('request_video_id')

    // TODO: clean up listeners
    socket.on('request_video_id', () => {
      if (currentVideoId) socket.emit('update_video_id', currentVideoId)
    })

    socket.on('update_video_id', id => {
      if (currentVideoId !== id) setCurrentVideoId(id)
    })

    socket.on('update_video', id => {
      try {
        setCurrentVideoId(id)
      } catch (e) {
        console.error(e)
        new CheeseToast({
          text: 'Unable to change video',
          className: 'toast',
        })
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
    try {
      player.seekTo(newTime)
    } catch (e) {
      // TODO
    }
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
        <div className="player-controls">
          <button
            className="player-controls__button"
            onClick={onPlay}
            type="button"
          >
            <img src="/images/icons/play.svg" alt="" />
            <p className="player-controls__label">play</p>
          </button>
          <button
            className="player-controls__button"
            onClick={onPause}
            type="button"
          >
            <img src="/images/icons/pause.svg" alt="" />
            <p className="player-controls__label">pause</p>
          </button>
          <button
            className="player-controls__button"
            onClick={onStop}
            type="button"
          >
            <img src="/images/icons/stop.svg" alt="" />
            <p className="player-controls__label">stop</p>
          </button>
          <button
            className="player-controls__button"
            onClick={() => onChangeTime(-5)}
            type="button"
          >
            <img src="/images/icons/rewind.svg" alt="" />
            <p className="player-controls__label">rewind</p>
          </button>
          <button
            className="player-controls__button"
            onClick={() => onChangeTime(5)}
            type="button"
          >
            <img src="/images/icons/skip.svg" alt="" />
            <p className="player-controls__label">fastforward</p>
          </button>
          <button
            className="player-controls__button"
            onClick={onSync}
            type="button"
          >
            <img src="/images/icons/sync-other.svg" alt="" />
            <p className="player-controls__label">sync others</p>
          </button>
          <button
            className="player-controls__button"
            onClick={onSyncRequest}
            type="button"
          >
            <img src="/images/icons/sync-self.svg" alt="" />
            <p className="player-controls__label">sync self</p>
          </button>
        </div>
      ) : (
        'loading...'
      )}
    </>
  )
}
