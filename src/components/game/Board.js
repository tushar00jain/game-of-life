import React, { Component } from 'react'

import _ from 'lodash'
import io from 'socket.io-client'

import Cell from './Cell'

import { SERVER } from '../../constants'
const socket = io(SERVER, { path: '/api/game' }) 

// dimensions of the board for the game of life
const ROWS = 50
    , COLUMNS = 50
    , WIDTH = "500"
    , HEIGHT = "500"

export default class Board extends Component {
  constructor(props) {
    super(props)
    this.state = {
    // application state defined by the color of each cell recieved from the server at a specified latency
      colors: [[]]
    }
  }

  // this function is bound to Cell component
  // send position of the click to the server to update the game state
  handleClick (e) {
    const { x, y } = this.props
    socket.emit('client:click', { x, y })
  }

  componentWillMount () {
  }

  componentDidMount () {
    // get the game state when the component mounts
    socket.emit('client:connection')
    // update the state of the application when server broadcasts new sate
    socket.on('server:game', colors => {
      this.setState({ colors })
    })
  }

  // remove listener from the socket
  componentWillUnmount () {
    socket.emit('client:disconnect')
    socket.removeAllListeners('server:game')
  }

  render () {
    // array of cells to be displayed
    var board = []
    const empty = _.isEmpty(this.state.colors[0])

    // prepare the array of cells for render
    for(let i = 0; i < ROWS; i++) {
      for(let j = 1; j < COLUMNS + 1; j++) {
        board.push(
          <Cell 
            key={ i + ',' + j }
            fill={ empty ? '#ffffff' : this.state.colors[i][j] }
            handleClick={ this.handleClick }
            x={ i }
            y={ j }
          />
        )
      }
    }

    return (
    <div>
      <svg height={ WIDTH } width={ HEIGHT }>
        <g>
          { board }
        </g>
      </svg>
    </div>
    )
  }
}
