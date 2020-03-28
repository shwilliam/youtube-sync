import {useState, useEffect} from 'react'
import {init as initYtPlayer} from '../lib/yt-player'

const useYtPlayer = initialVideoId => {
  const [player, setPlayer] = useState()

  useEffect(() => {
    initYtPlayer(initialVideoId).then(setPlayer)
  }, [initialVideoId])

  return [player]
}

export default useYtPlayer
