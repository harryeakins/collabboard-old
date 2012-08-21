var socketio = require('socket.io');
var extend = require('node.extend');

function Syncer(options) {
	var defaults = {'port': 8080};

	var settings = extend({}, defaults, options);

	var io = socketio.listen(settings['port']);

	this.users = {};

	io.sockets.on('connection',	this.addUser);
}

Syncer.prototype.addUser = function(socket) {
	this.users[socket.id] = socket;
	var self = this;
	socket.on('data', function (data) {
		self.sendToAllBut(socket.id, data);
	});
}

Syncer.prototype.sendToAllBut = function(sid, data) {
	for(var id in this.users) {
		if(id != sid) {
			this.users[id].emit('data', data);
		}
	}
}

exports.Syncer = Syncer;