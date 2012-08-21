this.testClientSyncer = nodeunit.testCase({
	setUp: function(callback) {
		console.log("Creating worker!");
		try{
			this.worker = new Worker('clientSyncer.js');
		} catch(err) {
			console.log(err);
			throw "Error creating Worker";
		}
		console.log(this.worker);
		this.worker.onmessage = function(event) {
			var data = event.data;
			if(data['log']) {
				console.log("Worker: " + data['log']);
			}
		};
		console.log("Finished setUp");
		callback();
	},
	tearDown: function(callback) {
		console.log("Tearing down");
		this.worker.terminate();
		callback();
	},
	'Test Syncing a Line': function (test) {
		test.expect(2);
		var socketMock = new NodeMock('on').takes('data', function(){}).calls(1, [])
		console.log(Object.keys(socketMock));
		console.log()
		this.worker.postMessage({'init': {socket: socketMock} } );
		setTimeout(test.done, 5000);
		//test.done();
	}
});