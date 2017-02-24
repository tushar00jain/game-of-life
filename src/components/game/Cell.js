import React, { Component } from 'react'
import { Link } from 'react-router'

import _ from 'lodash'

// individual cell that is displayed on the board
export default class Cell extends Component {
  constructor(props) {
    super(props)
    // dimensions of the cell
    this.state = {
      WIDTH: "10"
    , HEIGHT: "10"
    }
  }

  render () {
    return (
      <rect
        width={ this.state.WIDTH }
        height={ this.state.HEIGHT }
        fill={ this.props.fill }
        x={ 10 * this.props.x }
        y={ 10 * this.props.y }
        onClick={ this.props.handleClick.bind(this) }
        stroke="black"
        strokeWidth="1">
      </rect>
    )
  }
}
