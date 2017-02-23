import React, { Component } from 'react'

import _ from 'lodash'

import Board from './Board'

// main page of the game application
export default class Game extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
    <div className="container">
      <h1>
        Game of Life
      </h1>
      <Board/>
    </div>
    )
  }
}
