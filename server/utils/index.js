module.exports = (function () {
  'use strict'
  
  // methods to be returned from this file
  const ROWS    = 50
      , COLUMNS = 50

  var methods   = {}

  methods.randomColor = function () {
    return ('#' + ('00000' + (Math.random() * (1<<24)|0).toString(16)).slice(-6))
  }

  methods.getColors = function () {
    var colors = []
    for (let i = 0; i < ROWS; i++) {
      let temp = []
      for (let j = 0; j < COLUMNS; j++) {
        temp.push(methods.randomColor())
      }
      colors.push(temp)
    }
    return colors
  }

  return methods
})()
