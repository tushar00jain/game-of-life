module.exports= (() => {
  const utils = require('../utils')

  const ROWS    = 50
      , COLUMNS = 100
      , TICK    = 1000
      , WHITE   = 'rgb(255,255,255)'
      , BLACK   = 'rgb(0,0,0)'

  // get random position on the board
  function randomPosition () {
    const x = Math.floor(Math.random() * (COLUMNS))
    const y = Math.floor(Math.random() * (ROWS))
    return { x, y }
  }

  // check if the cell is  alive, white cells are dead
  function alive (color) {
    if (color === WHITE) {
      return false
    }
    return true
  }

  // create empyt board
  function createBoard () {
    let board = new Array()
    for (let i = 0; i < COLUMNS; i++) {
      board.push(new Array(ROWS).fill(WHITE))
    }
    return board
  }

  // main class for the game
  const Game = {

    // update the state of the game
    update () {
      this.colors = this.nexts
      this.nexts = createBoard()
    },

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
    },

    // draw a block pattern
    block (color) {
      const { x, y } = randomPosition()
      this.colors[x][y] = color

      let tx = x + 1 < COLUMNS ? x + 1: 0
      let ty = y - 1 > 0 ? y - 1 : ROWS - 1
      this.colors[x][ty] = color
      this.colors[tx][ty] = color

      this.colors[tx][y] = color

    },

    // draw a blinker pattern
    blinker (color) {
      const { x, y } = randomPosition()
      this.colors[x][y] = color

      let ty = y - 1 > 0 ? y - 1 : ROWS - 1
      this.colors[x][ty] = color

      ty = y + 1 < ROWS ? y + 1 : 0
      this.colors[x][ty] = color

    },

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

    },

    nextState ()  {
      for (let i = 0; i < COLUMNS; i++) {
        for (let j = 0; j < ROWS; j++) {

          const color = this.colors[i][j]
          const isAlive = alive(color)
          const { count, average } = this.neighbours(i, j)

          if ((isAlive) && (count < 2)) {
            this.nexts[i][j] = WHITE
          } 

          if (isAlive && (count === 2 || count === 3)) {
            this.nexts[i][j] = color
          } 

          if (isAlive && (count > 3)) {
            this.nexts[i][j] = WHITE
          } 

          if ((isAlive === false) && (count === 3)) {
            this.nexts[i][j] = average
          }
        }
      }
    },

    setColor (x, y, color) {
      this.colors[x][y] = color
    },

    setClient (id, color) {
      this.clients[id] = color
    }
  }

  const GetSet = {
    get (name) {
      return this[name]
    }
  , set (name, value) {
      return this[name]
    }
  }

  const factory = () => {
    return Object.assign(Object.create(Game), { colors: createBoard(), nexts: createBoard(), clients: {} }, GetSet)
  }

  return factory 

})()
