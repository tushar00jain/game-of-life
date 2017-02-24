module.exports = (function () {
  'use strict'
  const _ = require('lodash')
  
  // calculates random number between 0 and 255
  function randomNumber () {
    return Math.floor(Math.random() * (256))
  }

  // extract numbers from string
  function split (rgb) {
    return rgb.match(/\d+/g).map(d => parseInt(d))
  }

  var methods   = {}

  // create a random rgb value
  methods.randomColor = function () {
    var randoms = []
    for (let i = 0; i < 3; i++) {
      randoms.push(randomNumber())
    }

    const colors = randoms.join(',')
    return 'rgb(' + colors + ')'
  }

  // compute the average of array of rgb values
  methods.average = function (rgbs) {
    return 'rgb(' + _.zip.apply(
      null,
      rgbs.map(rgb => split(rgb))
    ).map(
      d => ~~(d.reduce((acc, curr) => acc + curr, 0) / 3)
    ).join(',') + ')'
  }
  
  return methods
})()
