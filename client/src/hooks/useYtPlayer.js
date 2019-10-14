import React, {useState, useEffect} from 'react'
import initYtPlayer from '../lib/initYtPlayer'

const useYtPlayer = () => {
  const [player, setPlayer] = useState()

  useEffect(() => {
    initYtPlayer.then(setPlayer)
  }, [])

  return [player]
}

export default useYtPlayer
