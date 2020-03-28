import React, {useState} from 'react'

export const NewVideoInput = ({onSubmit}) => {
  const [newVideoInput, setNewVideoInput] = useState('')

  const onVideoSubmit = e => {
    e.preventDefault()
    onSubmit(newVideoInput)
  }

  return (
    <form onSubmit={onVideoSubmit} className="new-video-form">
      <input
        className="new-video-form__input"
        onChange={e => setNewVideoInput(e.target.value)}
        placeholder="Enter a new YouTube ID..."
        type="text"
        required
      />
      <button type="submit">Change</button>
    </form>
  )
}
