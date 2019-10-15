import {useState, useEffect} from 'react'
import {init as initYtPlayer} from '../lib/yt-player'

const useYtPlayer = () => {
  const [player, setPlayer] = useState()

  useEffect(() => {
    initYtPlayer('l0vrsO3_HpU').then(setPlayer)
  }, [])

  return [player]
}

export default useYtPlayer
