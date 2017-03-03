module.exports = (function (io) {
  'use strict'

  const path  = require('path')
      , utils = require(path.join(__dirname, '../utils'))
      , gameFactory = require('./game.js')

  const TICK = 1000

  const CLIENT_CLICK      = 'client:click'
      , CLIENT_CONNECTION = 'client:connection'
      , CLIENT_DISCONNECT = 'client:disconnect'
      , SERVER_GAME       = 'server:game'

  var gameTimeout 

  var game = gameFactory()

  // calculate the next state of the game to be rendered
  // and update reset the game timeout recursively
  function nextState () {
    // compute the colors on the board
    game.nextState()

    // update the game
    game.update()
    // broadcast information to all clients
    io.emit(SERVER_GAME, game.get('colors'))
    // reset game timer
    gameTimeout = setTimeout(nextState, TICK)
  }

  // initially start the game
  nextState()

  io.on('connection', socket => {
    // reset the time if any client clicks and broadcast the click information to all clients
    socket.on(CLIENT_CLICK, ({ x, y }) => {
      clearTimeout(gameTimeout)
      game.setColor(x, y, game.get('clients')[socket.id])
      io.emit(SERVER_GAME, game.get('colors'))
      gameTimeout = setTimeout(nextState, TICK)
    })

    socket.on('client:load:block', () => {
      clearTimeout(gameTimeout)
      const color = game.get('clients')[socket.id]
      game.block(color)
      io.emit(SERVER_GAME, game.get('colors'))
      gameTimeout = setTimeout(nextState, TICK)
    })

    socket.on('client:load:blinker', () => {
      clearTimeout(gameTimeout)
      const color = game.get('clients')[socket.id]
      game.blinker(color)
      io.emit(SERVER_GAME, game.get('colors'))
      gameTimeout = setTimeout(nextState, TICK)
    })
    
    socket.on('client:load:glider', () => {
      clearTimeout(gameTimeout)
      const color = game.get('clients')[socket.id]
      game.glider(color)
      io.emit(SERVER_GAME, game.get('colors'))
      gameTimeout = setTimeout(nextState, TICK)
    })

    // add client with random color to the client list
    socket.on(CLIENT_CONNECTION, () => {
      clearTimeout(gameTimeout)
      game.setClient(socket.id, utils.randomColor())
      gameTimeout = setTimeout(nextState, TICK)
    })

    // remove the client from the list
    socket.on(CLIENT_DISCONNECT, () => {
      game.removeClient(socket.id)
    })
  })
})
