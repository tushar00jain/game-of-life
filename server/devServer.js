const path = require('path')
    , config = require(path.join(__dirname, '../webpack.config.dev'))
    , express = require('express')
    , webpack = require('webpack')

    , compiler = webpack(config)

    , app = express()
    , server = require('http').Server(app)
    , io = require('socket.io').listen(server, { path: '/api/game'})
    , game = require(path.join(__dirname, 'game'))(io)
  
// webpack
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))

// middleware
app.use(require('webpack-hot-middleware')(compiler))
app.use('/static', express.static(path.join(__dirname, '../public')))

// send html file to the client at all routes except `/api/*`
// client side routing handled by react router
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'))
})

// start server
if (!module.parent) {
  server.listen(3000, (err) => {
    if (err) return console.log(err.message)
    console.log('Listening at http://localhost:3000')
  })
}
