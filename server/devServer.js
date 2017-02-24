const path = require('path')
    , config = require(path.join(__dirname, '../webpack.config.dev'))
    , express = require('express')
    , game = require(path.join(__dirname, 'game'))
    , utils = require(path.join(__dirname, 'utils'))
    , webpack = require('webpack')
    , bodyParser = require('body-parser')

    , compiler = webpack(config)

    , app = express()
    , server = require('http').Server(app)
    , io = require('socket.io').listen(server, { path: '/api/game'})
  
// webpack
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))

// middleware
app.use(require('webpack-hot-middleware')(compiler))
app.use(bodyParser.json())       
app.use(bodyParser.urlencoded({extended: true})) 
app.use('/static', express.static(path.join(__dirname, '../public')))

// api

// send html file to the client at all routes except `/api/*`
// client side routing handled by react router
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'))
})

// socket io
io.on('connection', socket => {
  socket.on('client:click', (position) => {
    game.setColor(position.x, position.y, utils.randomColor())
    io.emit('server:game', game.getColors())
  })
  
  socket.on('client:connection', () => {
  })

  socket.on('client:disconnect', () => {
  })
})

// start server
if (!module.parent) {
  server.listen(3000, (err) => {
    if (err) return console.log(err.message)
    console.log('Listening at http://localhost:3000')
  })
}
