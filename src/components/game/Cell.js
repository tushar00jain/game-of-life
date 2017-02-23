import React, { Component } from 'react'
import { Link } from 'react-router'

import _ from 'lodash'
import io from 'socket.io-client'

import { SERVER } from '../../constants'
const socket = io(SERVER, { path: '/api/game' }) 

// individual cell that is displayed on the board
export default class Cell extends Component {
  constructor(props) {
    super(props)
    // dimensions of the cell
    this.state = {
      WIDTH: "10"
    , HEIGHT: "10"
    }

    this.handleClick = this.handleClick.bind(this)
  }

  // emit change in game state to the server
  handleClick (e) {
    const { x, y } = this.props
    socket.emit('client:click', { x, y })
  }

  render () {
    return (
      <rect
        width={ this.state.WIDTH }
        height={ this.state.HEIGHT }
        fill={ this.props.fill }
        x={ 10 * this.props.x }
        y={ 10 * this.props.y }
        onClick={ this.handleClick }
        stroke="black"
        strokeWidth="1">
      </rect>
    )
  }
}
