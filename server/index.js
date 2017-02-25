const path = require('path')
    , express = require('express')

    , app = express()
    , server = require('http').Server(app)
    , io = require('socket.io').listen(server, { path: '/api/game'})
    , game = require(path.join(__dirname, 'game'))(io)
  
// set port for the application
app.set('port', process.env.PORT || 3000)

// middleware
app.use('/static', express.static(path.join(__dirname, '../public')))
app.use('/static', express.static(path.join(__dirname, '../build')))

// send html file to the client at all routes except `/api/*`
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'))
})

// start server
if (!module.parent) {
  server.listen(3000, (err) => {
    if (err) return console.log(err.message)
    console.log('Listening at port ' + app.get('port'))
  })
}
