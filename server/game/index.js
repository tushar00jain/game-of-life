module.exports = (function () {
  'use strict'
  const path = require('path')
      , utils = require(path.join(__dirname, '../utils'))
  
  const ROWS    = 50
      , COLUMNS = 50
      , TICK    = 1000

  // methods to be returned from this file
  var methods   = {}

  // check if the cell is alive or dead
  function alive (color) {
    if (color === '#ffffff') {
      return false
    }
    return true
  }

  class Game {
    constructor() {
      // client id's and their colors
      this.clients = {}
      // colors array that stores the game state
      // white means dead cell, any other color means alive
      this.colors = new Array(ROWS)
      for (let i = 0; i < ROWS; i++) {
        this.colors[i] = new Array(COLUMNS).fill('#ffffff')
      }

      // next generation of colors
      this.nexts = new Array(ROWS)
      for (let i = 0; i < ROWS; i++) {
        this.nexts[i] = new Array(COLUMNS).fill('#ffffff')
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

    getNexts () {
      return this.nexts
    }

    getNext (i, j)  {
      return this.nexts[i][j]
    }

    setNext (i, j, color) {
      this.nexts[i][j] = color
    }
  }

  var game = new Game()


  return game
  // return methods
})()
