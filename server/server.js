let app = require('express')()
let express = require('express')
let http = require('http').Server(app)
let io = require('socket.io')(http)
let browserify = require('browserify-middleware')
let path = require('path')
let assetFolder = path.join(__dirname, '..', 'client','public')

// Parse JSON bodies
app.use(express.json());

// Endpoint to check if password protection is enabled
app.get('/status', function(req, res) {
  res.json({ passwordProtected: !!process.env.ALLOW_CODE });
});

// Endpoint to validate the password
app.post('/login', function(req, res) {
  const { password } = req.body;
  const allowCode = process.env.ALLOW_CODE;

  if (!allowCode) {
    // If no password is set, always allow access
    return res.json({ success: true });
  }

  if (password === allowCode) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: '访问码错误' });
  }
});




//---  socket.io is listening for queues triggered by ----//
//---  players, then emits information to both     ----//
io.on('connection', function(socket){
  console.log('用户已连接')
  socket.on('player move', gameData => {
    io.emit('player move', gameData)
  })
  socket.on('player ready', gameData => {
    io.emit('player ready', gameData)
  })
  socket.on('player won', gameData => {
    io.emit('player won', gameData)
  })
})


// Serve Static Assets
app.use(express.static(assetFolder))

// Serve JS Assets
app.get('/app-bundle.js',
 browserify('./client/index.js', {
    transform: [ [ require('babelify'), { presets: ['es2015', 'react'] } ] ]
  })
)

// Wild card route for client side routing.
app.get('/*', function(req, res){
  res.sendFile( assetFolder + '/index.html' )
})

// Start server
let port = process.env.PORT || 4000
http.listen(port)
console.log("正在监听本地主机（localhost）上的端口：" + port)
