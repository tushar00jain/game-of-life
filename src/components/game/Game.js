import React, { Component } from 'react'

import _ from 'lodash'
import io from 'socket.io-client'

import Cell from './Cell'
import { SERVER } from '../../constants'

const socket = io(SERVER, { path: '/api/game' }) 

const ROWS = 50
    , COLUMNS = 100
    , WIDTH = "1000"
    , HEIGHT = "500"
    , WHITE = 'rgb(255,255,255)'
    , BLACK = 'rgb(0,0,0)'

class Board extends Component {
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

  componentDidMount () {
    // update the state of the application when server broadcasts new sate
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
    for(let i = 0; i < COLUMNS; i++) {
      for(let j = 0; j < ROWS; j++) {
        board.push(
          <Cell 
            key={ i + ',' + j }
            fill={ empty ? WHITE : this.state.colors[i][j] }
            handleClick={ this.handleClick }
            x={ i }
            y={ j }
          />
        )
      }
    }

    return (
    <div>
      <svg height={ HEIGHT } width={ WIDTH }>
        <g>
          { board }
        </g>
      </svg>
    </div>
    )
  }
}


// main page of the game application
export default class Game extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e) {
    socket.emit('client:load:' + e.target.id)
  }

  componentDidMount () {
    // get the game state when the component mounts
    socket.emit('client:connection')
  }

  componentWillUnmount () {
    socket.emit('client:disconnect')
  }

  render () {
    return (
    <div className="container main">
      <h1>
        Game of Life
      </h1>
      <Board socket = { socket }/>

      <div className="patterns">
        <img alt="Game of life block with border.svg"
          src="//upload.wikimedia.org/wikipedia/commons/thumb/9/96/Game_of_life_block_with_border.svg/66px-Game_of_life_block_with_border.svg.png"
          width="66" height="66"
          data-file-width="66" 
          style={{ cursor: "pointer" }}
          onClick={ this.handleClick }
          id="block"
          data-file-height="66">
        </img>

        <img alt="Game of life blinker.gif"
          src="//upload.wikimedia.org/wikipedia/commons/9/95/Game_of_life_blinker.gif" 
          style={{ cursor: "pointer" }}
          onClick={ this.handleClick }
          id="blinker"
          width="82" height="82" data-file-width="82" data-file-height="82">
        </img>

        <img alt="Game of life animated glider.gif" src="//upload.wikimedia.org/wikipedia/commons/f/f2/Game_of_life_animated_glider.gif"
          id="glider"
          style={{ cursor: "pointer" }}
          onClick={ this.handleClick }
          width="84" height="84" data-file-width="84" data-file-height="84">
        </img>

    </div>

    </div>
    )
  }
}
