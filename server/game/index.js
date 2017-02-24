module.exports = (function (io) {
  'use strict'

  const path  = require('path')
      , utils = require(path.join(__dirname, '../utils'))

  const ROWS    = 50
      , COLUMNS = 50
      , TICK    = 1000
      , WHITE   = 'rgb(255,255,255)'
      , BLACK   = 'rgb(0,0,0)'

  const CLIENT_CLICK      = 'client:click'
      , CLIENT_CONNECTION = 'client:connection'
      , CLIENT_DISCONNECT = 'client:disconnect'
      , SERVER_GAME       = 'server:game'

  var gameTimeout 

  // main class for the game
  class Game {
    constructor() {
      // clients connected to the game
      this.clients = {}

      // colors on the game board
      this.colors = new Array(COLUMNS)
      for (let i = 0; i < COLUMNS; i++) {
        this.colors[i] = new Array(ROWS).fill(WHITE)
      }

      // next state of the game
      this.nexts = new Array(COLUMNS)
      for (let i = 0; i < COLUMNS; i++) {
        this.nexts[i] = new Array(ROWS).fill(WHITE)
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

    removeClient (id)  {
      delete this.clients[id]
    }

    getColors () {
      return this.colors
    }

    getColor (i, j)  {
      return this.colors[i][j]
    }

    setColor (i, j, color) {
      const tc = this.colors[i][j]
      if ( tc === WHITE ) {
        this.colors[i][j] = color
      } else {
        this.colors[i][j] = WHITE
      }
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

    // update the state of the game
    update () {
      this.colors = this.nexts
      this.nexts = new Array(COLUMNS)
      for (let i = 0; i < COLUMNS; i++) {
        this.nexts[i] = new Array(ROWS).fill(WHITE)
      }
    }

    // calculate the neighbours of the cell and the average rgb value
    neighbours (x, y) {
      let count = 0
      let colors = []

      let tx = 0
      let ty = 0
      let tc = ''

      // 1 (0, 0)
      tx = x - 1 > 0 ? x - 1 : COLUMNS - 1
      ty = y - 1 > 0 ? y - 1 : ROWS - 1
      tc = this.colors[tx][ty]
      if (alive(tc)) {
        count++
        colors.push(tc)
      }

      // 2 (1, 0)
      tc = this.colors[x][ty]
      if (alive(tc)) {
        count++
        colors.push(tc)
      }

      // 3 (0, 1)
      tc = this.colors[tx][y]
      if (alive(tc)) {
        count++
        colors.push(tc)
      }

      // 4 (2, 0)
      tx = x + 1 < COLUMNS ? x + 1 : 0
      tc = this.colors[tx][ty]
      if (alive(tc)) {
        count++
        colors.push(tc)
      }

      // 5 (0, 2)
      tx = x - 1 > 0 ? x - 1 : COLUMNS - 1
      ty = y + 1 < ROWS ? y + 1 : 0
      tc = this.colors[tx][ty]
      if (alive(tc)) {
        count++
        colors.push(tc)
      }

      // 6 (2, 2)
      tx = x + 1 < COLUMNS ? x + 1 : 0
      tc = this.colors[tx][ty]
      if (alive(tc)) {
        count++
        colors.push(tc)
      }

      // 7 (1, 2)
      tc = this.colors[x][ty]
      if (alive(tc)) {
        count++
        colors.push(tc)
      }

      // 8 (2, 1)
      tc = this.colors[tx][y]
      if (alive(tc)) {
        count++
        colors.push(tc)
      }

      const average = count === 3 ? utils.average(colors) : ''

      return { count, average }
    }

    // draw a block pattern
    block (color) {
      const { x, y } = randomPosition()
      this.colors[x][y] = color

      let tx = x + 1 < COLUMNS ? x + 1: 0
      let ty = y - 1 > 0 ? y - 1 : ROWS - 1
      this.colors[x][ty] = color
      this.colors[tx][ty] = color

      this.colors[tx][y] = color

    }

    // draw a blinker pattern
    blinker (color) {
      const { x, y } = randomPosition()
      this.colors[x][y] = color

      let ty = y - 1 > 0 ? y - 1 : ROWS - 1
      this.colors[x][ty] = color

      ty = y + 1 < ROWS ? y + 1 : 0
      this.colors[x][ty] = color

    }

    // draw a glider pattern
    glider (color) {
      const { x, y } = randomPosition()

      let tx = x - 1 > 0 ? x - 1 : COLUMNS - 1
      let ty = y - 1 > 0 ? y - 1 : ROWS - 1
      // 2 (1, 0)
      this.colors[x][ty] = color
      // 5 (0, 2)
      tx = x - 1 > 0 ? x - 1 : COLUMNS - 1
      ty = y + 1 < ROWS ? y + 1 : 0
      this.colors[tx][ty] = color
      // 6 (2, 2)
      tx = x + 1 < COLUMNS ? x + 1 : 0
      this.colors[tx][ty] = color
      // 7 (1, 2)
      this.colors[x][ty] = color
      // 8 (2, 1)
      this.colors[tx][y] = color

    }

  }
  
  // check if the cell is  alive, white cells are dead
  function alive (color) {
    if (color === WHITE) {
      return false
    }
    return true
  }

  // get random position on the board
  function randomPosition () {
    const x = Math.floor(Math.random() * (COLUMNS))
    const y = Math.floor(Math.random() * (ROWS))
    return { x, y }
  }

  var game = new Game()

  // calculate the next state of the game to be rendered
  // and update reset the game timeout recursively
  function nextState () {
    // compute the colors on the board
    for (let i = 0; i < COLUMNS; i++) {
      for (let j = 0; j < ROWS; j++) {

        const color = game.getColor(i, j)
        const isAlive = alive(color)
        const { count, average } = game.neighbours(i, j)

        if ((isAlive) && (count < 2)) {
          game.setNext(i, j, WHITE)
        } 

        if (isAlive && (count === 2 || count === 3)) {
          game.setNext(i, j, color)
        } 

        if (isAlive && (count > 3)) {
          game.setNext(i, j, WHITE)
        } 

        if ((isAlive === false) && (count === 3)) {
          game.setNext(i, j, average)
        }
      }
    }

    // update the game
    game.update()
    // broadcast information to all clients
    io.emit(SERVER_GAME, game.getColors())
    // reset game timer
    gameTimeout = setTimeout(nextState, TICK)
  }

  // initially start the game
  nextState()

  io.on('connection', socket => {
    // reset the time if any client clicks and broadcast the click information to all clients
    socket.on(CLIENT_CLICK, (position) => {
      clearTimeout(gameTimeout)
      game.setColor(position.x, position.y, game.getClient(socket.id))
      io.emit(SERVER_GAME, game.getColors())
      gameTimeout = setTimeout(nextState, TICK)
    })

    socket.on('client:load:block', () => {
      clearTimeout(gameTimeout)
      const color = game.getClient(socket.id)
      game.block(color)
      io.emit(SERVER_GAME, game.getColors())
      gameTimeout = setTimeout(nextState, TICK)
    })

    socket.on('client:load:blinker', () => {
      clearTimeout(gameTimeout)
      const color = game.getClient(socket.id)
      game.blinker(color)
      io.emit(SERVER_GAME, game.getColors())
      gameTimeout = setTimeout(nextState, TICK)
    })
    
    socket.on('client:load:glider', () => {
      clearTimeout(gameTimeout)
      const color = game.getClient(socket.id)
      game.glider(color)
      io.emit(SERVER_GAME, game.getColors())
      gameTimeout = setTimeout(nextState, TICK)
    })

    // add client with random color to the client list
    socket.on(CLIENT_CONNECTION, () => {
      clearTimeout(gameTimeout)
      game.setClient(socket.id, utils.randomColor())
    })

    // remove the client from the list
    socket.on(CLIENT_DISCONNECT, () => {
      game.removeClient(socket.id)
    })
  })
})
