import React, {useState} from 'react'

function NewVideoInput({onSubmit}) {
  const [newVideoInput, setNewVideoInput] = useState('')

  const onVideoSubmit = e => {
    e.preventDefault()
    onSubmit(newVideoInput)
  }

  return (
    <form onSubmit={onVideoSubmit}>
      <input
        onChange={e => setNewVideoInput(e.target.value)}
        placeholder="YouTube ID"
        type="text"
        required
      />
      <button type="submit">submit</button>
    </form>
  )
}

export default NewVideoInput
