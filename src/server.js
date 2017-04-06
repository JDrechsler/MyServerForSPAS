//My Server for spas

var express = require('express')
var app = express()
var server = require('http').Server(app)
var port = process.env.PORT || 3000
var io = require('socket.io')(server)
var connectedIds = []
var winprocess = require('./cpp/winprocess/build/Release/winprocess')

server.listen(port, function () {
	console.log(`Listening on Port: ${port}, https://web-entwicklung-anunymux.c9users.io`);
	showConnectedClientIds()
})

app.use(express.static(__dirname))

app.get('/', function (request, response) {
	response.send("Server is up and running. Yay!")
})

io.on('connection', function (socket) {

	connectedIds.push(socket.id)
	console.log(`A client connected: ${socket.id}`)
	showConnectedClientIds()

	socket.on('halloVonClient', function () {
		socket.emit('halloVonServer', 'Server sagt hallo zu Client')
	})

	socket.on('client-wants-foregroundApp', function () {
		socket.emit('server-sends-foregroundApp', winprocess.getActiveWindowName())
	})

	setInterval(function () {
		socket.emit('server-sends-foregroundApp-permanently', winprocess.getActiveWindowName())
	}, 1000);

	//A client disconnects from the server
	socket.on('disconnect', function () {

		for (var i = connectedIds.length - 1; i >= 0; i--) {
			if (connectedIds[i] === socket.id) {
				connectedIds.splice(i, 1)
			}
		}
		console.log(`Client left: ${socket.id}`);
		showConnectedClientIds()
	})
})

showConnectedClientIds = function () {
	console.log('');
	console.log('Connected client ids:')

	if (connectedIds.length < 1) {
		console.log('none');
	} else {
		for (var i = 0; i < connectedIds.length; i++) {
			console.log(connectedIds[i])
		}
	}

	console.log('');
}