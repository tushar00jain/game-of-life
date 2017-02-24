module.exports = (function () {
  'use strict'
  const path = require('path')
      , utils = require(path.join(__dirname, '../utils'))
  
  const ROWS    = 50
      , COLUMNS = 50
      , TICK    = 1000

  // methods to be returned from this file
  var methods   = {}

  class Game {
    constructor() {
      // client id's and their colors
      this.clients = {}
      // colors array that stores the game state
      this.colors = new Array(ROWS)
      for (let i = 0; i < ROWS; i++) {
        this.colors[i] = new Array(COLUMNS).fill('#ffffff')
      }
    }

    getClient (id) {
      return this.clients[id]
    }

    getClients () {
      return this.clients
    }

    setClient (id, color) {
      this.clients[id] = color
    }

    getColors () {
      return this.colors
    }

    getColor (i, j)  {
      return this.colors[i][j]
    }

    setColor (i, j, color) {
      this.colors[i][j] = color
    }
  }

  var game = new Game()


  return game
  // return methods
})()
