importScripts('socket.io.js');
importScripts('jquery.hive.pollen.js');

var self = this;

postMessage({'log': "In Worker"});

(function() {
	var console = {log: function(message) {
		self.postMessage({'log': message});
	}};
	function ClientSyncer(options) {
		var settings = {};
		$.extend(settings, options);

		this.lineBufferOut = [];
		this.lineBufferIn = [];

		if(settings['socket']) {
			this.socket = settings.socket;
		} else {
			this.socket = io.connect('127.0.0.1');
		}
		console.log('socket: ' + settings['socket']);
		console.log(this.socket);

		addEventListener('message', function(e) {
			var data = e.data;

			if(data['lines']) {
				this.lineBufferOut = this.lineBufferOut.concat(data['lines']);
			}
		});

		this.socket.on('data', function(data) {
			if(data['lines']) {
				this.lineBufferIn = this.lineBufferIn.concat(data['lines']);
			}
		});

		function syncWithServer() {
			if(this.lineBufferOut.length > 0) {
				this.socket.emit('data', {'lines': this.lineBufferOut});
				this.lineBufferOut = [];
			}
			if(this.lineBufferIn.length > 0) {
				// Draw lines locally
				postMessage({'lines': this.lineBufferIn});
				this.lineBufferIn = [];
			}
		}

		setInterval(this.syncWithServer, 100);
	};
	addEventListener('message', function(e) {
		var data = e.data;

		if(data['init']) {
			console.log("Initiating client syncer")
			cs = new ClientSyncer(data['init']);
		}
	});
	console.log("Web Worker initialization finished!");
})(); 