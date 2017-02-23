import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'

import Game from './components/game/Game'

render(
  <Game></Game>,
  document.getElementById('root')
)
