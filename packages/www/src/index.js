import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import './lib/socket'

ReactDOM.render(<App />, document.getElementById('root'))

// https://bit.ly/CRA-PWA
serviceWorker.unregister()
