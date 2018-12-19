import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from '../reducers/store'
import '../public/index.css'

ReactDOM.render(
  <Provider store={store}>{/* rest of your app goes here! */}</Provider>,
  document.getElementById('app')
)
