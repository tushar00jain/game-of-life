import React, { Component } from 'react'

import _ from 'lodash'
import io from 'socket.io-client'

import Cell from './Cell'

import { SERVER } from '../../constants'
const socket = io(SERVER, { path: '/api/game' }) 

export default class Board extends Component {
  constructor(props) {
    super(props)
    // dimensions of the board for the game of life
    this.state = {
      WIDTH: "500"
    , HEIGHT: "500"
    , ROWS: 50
    , COLUMNS: 50
    // application state defined by the color of each cell recieved from the server at a specified latency
    , colors: [[]]
    }
  }

  // this function is bound to Cell component
  // send position of the click to the server to update the game state
  handleClick (e) {
    const { x, y } = this.props
    socket.emit('client:click', { x, y })
  }

  // update the state of the application when server broadcasts new sate
  componentDidMount () {
    socket.on('server:game', colors => {
      this.setState({ colors })
    })
  }

  // remove listener from the socket
  componentWillUnmount () {
    socket.removeAllListeners('server:game')
  }

  render () {
    // array of cells to be displayed
    var board = []
    const empty = _.isEmpty(this.state.colors[0])

    // prepare the array of cells for render
    for(let i = 0; i < this.state.ROWS; i++) {
      for(let j = 1; j < this.state.COLUMNS + 1; j++) {
        board.push(
          <Cell 
            key={ i + ',' + j }
            fill={ empty ? 'white' : this.state.colors[i][j] }
            handleClick={ this.handleClick }
            x={ i }
            y={ j }
          />
        )
      }
    }

    return (
    <div>
      <svg height={ this.state.WIDTH } width={ this.state.HEIGHT }>
        <g>
          { board }
        </g>
      </svg>
    </div>
    )
  }
}
