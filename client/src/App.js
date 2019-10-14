import React, {useState, useEffect} from 'react'
import useYtPlayer from './hooks/useYtPlayer'

function App() {
  const [player] = useYtPlayer()

  return (
    <div className="App">
      <div id="player" />

      {player ? (
        <div>
          <button onClick={() => player.playVideo()} type="button">
            play
          </button>
          <button onClick={() => player.pauseVideo()} type="button">
            pause
          </button>
          <button onClick={() => player.stopVideo()} type="button">
            stop
          </button>
        </div>
      ) : (
        'loading'
      )}
    </div>
  )
}

export default App
