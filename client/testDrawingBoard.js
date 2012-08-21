function rgbaToHex(r, g, b, a) {
		if (r > 255 || g > 255 || b > 255 || a > 255)
				throw "Invalid color component";
		var number = ((r << 24) | (g << 16) | (b << 8) | a);
		number = 0xFFFFFFFF + number + 1;
		return number.toString(16);
}

this.testDrawingBoard = nodeunit.testCase({
	setUp: function(callback) {
		$('#canvas-div').drawingBoard();
		callback();
	},
	tearDown: function(callback) {
		$('#canvas-div').empty();	
		callback();
	},
	'Test Drawing a Line': function (test) {
		test.expect(2);
		$("#drawing-board").drawingBoard('drawLine', {
								strokeStyle: '#000000',
								fillStyle: '#000000',
								strokeWidth: 10,
								rounded: true,
								x1: 0, y1: 0,
								x2: 100, y2: 100 });

		var hex = $("#drawing-board").drawingBoard('getColor', {x: 50, y: 50});
		test.equal("#000000ff", 
					hex,
					"Line is black");

		hex = $("#drawing-board").drawingBoard('getColor', {x: 50, y: 10});
		test.equal("#00000000", 
					hex,
					"Not-line is transparent");
		 
		test.done();
	},
	'Test Drawing Multiple Lines': function (test) {
		test.expect(3);
		$("#drawing-board").drawingBoard('drawLines', [{
								strokeStyle: '#000000',
								fillStyle: '#000000',
								strokeWidth: 10,
								rounded: true,
								x1: 0, y1: 0,
								x2: 100, y2: 100 },
								{ strokeStyle: '#000000',
								fillStyle: '#000000',
								strokeWidth: 10,
								rounded: true,
								x1: 100, y1: 0,
								x2: 0, y2: 100 }]);

		var hex = $("#drawing-board").drawingBoard('getColor', {x: 10, y: 10});
		test.equal("#000000ff", 
					hex,
					"Line 1 is black");

		hex = $("#drawing-board").drawingBoard('getColor', {x: 90, y: 10});
		test.equal("#000000ff", 
					hex,
					"Line 2 is black");

		hex = $("#drawing-board").drawingBoard('getColor', {x: 50, y: 10});
		test.equal("#00000000", 
					hex,
					"Not-either-line is transparent");
		 
		test.done();
	},
	'Test Clearing a Page': function (test) {
		test.expect(2);
		$("#drawing-board").drawingBoard('drawLine', {
								strokeStyle: '#000000',
								fillStyle: '#000000',
								strokeWidth: 10,
								rounded: true,
								x1: 0, y1: 0,
								x2: 100, y2: 100 });

		var hex = $("#drawing-board").drawingBoard('getColor', {x: 50, y: 50});
		test.equal("#000000ff", 
					hex,
					"Line is black");

		$("#drawing-board").drawingBoard('clear');
		hex = $("#drawing-board").drawingBoard('getColor', {x: 50, y: 50});
		test.equal("#00000000", 
					hex,
					"Line is no-longer there");
		 
		test.done();
	},
	'Test Undoing Lines: 2 Users': function (test) {
		test.expect(2);
		$("#drawing-board").drawingBoard('drawLines', [{
								strokeStyle: '#000000',
								fillStyle: '#000000',
								strokeWidth: 10,
								rounded: true,
								x1: 0, y1: 0,
								x2: 100, y2: 100, id: 1 },
								{ strokeStyle: '#000000',
								fillStyle: '#000000',
								strokeWidth: 10,
								rounded: true,
								x1: 100, y1: 0,
								x2: 0, y2: 100, id: 1 }]);

		$("#drawing-board").drawingBoard('drawLines', [{
								strokeStyle: '#ff0000',
								fillStyle: '#ff0000',
								strokeWidth: 10,
								rounded: true,
								x1: 50, y1: 0,
								x2: 50, y2: 100, id: 2 },
								{ strokeStyle: '#ff0000',
								fillStyle: '#ff0000',
								strokeWidth: 10,
								rounded: true,
								x1: 0, y1: 50,
								x2: 100, y2: 50, id: 2 }]);

		var hex = $("#drawing-board").drawingBoard('getColor', {x: 50, y: 50});
		test.equal("#ff0000ff", 
					hex,
					"Center is red");

		$("#drawing-board").drawingBoard('undo', 2);
		hex = $("#drawing-board").drawingBoard('getColor', {x: 50, y: 50});
		test.equal("#000000ff", 
					hex,
					"Center is black after undo");
		test.done();
	},
	'Test Undoing Lines: 1 User': function (test) {
		test.expect(2);
		$("#drawing-board").drawingBoard('drawLines', [{
								strokeStyle: '#000000',
								fillStyle: '#000000',
								strokeWidth: 10,
								rounded: true,
								x1: 0, y1: 0,
								x2: 100, y2: 100, id: 2 },
								{ strokeStyle: '#000000',
								fillStyle: '#000000',
								strokeWidth: 10,
								rounded: true,
								x1: 100, y1: 0,
								x2: 0, y2: 100, id: 2 }]);

		$("#drawing-board").drawingBoard('save', 2);

		$("#drawing-board").drawingBoard('drawLines', [{
								strokeStyle: '#ff0000',
								fillStyle: '#ff0000',
								strokeWidth: 10,
								rounded: true,
								x1: 50, y1: 0,
								x2: 50, y2: 100, id: 2 },
								{ strokeStyle: '#ff0000',
								fillStyle: '#ff0000',
								strokeWidth: 10,
								rounded: true,
								x1: 0, y1: 50,
								x2: 100, y2: 50, id: 2 }]);

		var hex = $("#drawing-board").drawingBoard('getColor', {x: 50, y: 50});
		test.equal("#ff0000ff", 
					hex,
					"Center is red");

		$("#drawing-board").drawingBoard('undo', 2);
		hex = $("#drawing-board").drawingBoard('getColor', {x: 50, y: 50});
		test.equal("#000000ff", 
					hex,
					"Center is black after undo");
		test.done();
	},
	'Test Undoing Lines: 2 Users Interleaved': function (test) {
		test.expect(2);
		$("#drawing-board").drawingBoard('drawLines', [{
								strokeStyle: '#000000',
								fillStyle: '#000000',
								strokeWidth: 10,
								rounded: true,
								x1: 0, y1: 0,
								x2: 100, y2: 100, id: 2 },
								{ strokeStyle: '#000000',
								fillStyle: '#000000',
								strokeWidth: 10,
								rounded: true,
								x1: 100, y1: 0,
								x2: 0, y2: 100, id: 2 }]);

		$("#drawing-board").drawingBoard('save', 2);

		$("#drawing-board").drawingBoard('drawLines', [{
								strokeStyle: '#ff0000',
								fillStyle: '#ff0000',
								strokeWidth: 10,
								rounded: true,
								x1: 50, y1: 0,
								x2: 50, y2: 100, id: 1 },
								{ strokeStyle: '#ff0000',
								fillStyle: '#ff0000',
								strokeWidth: 10,
								rounded: true,
								x1: 0, y1: 50,
								x2: 100, y2: 50, id: 1 }]);

		$("#drawing-board").drawingBoard('save', 1);

		$("#drawing-board").drawingBoard('drawLines', [{
								strokeStyle: '#000000',
								fillStyle: '#000000',
								strokeWidth: 10,
								rounded: true,
								x1: 0, y1: 60,
								x2: 100, y2: 60, id: 2 }]);

		var hex = null;

		hex = $("#drawing-board").drawingBoard('getColor', {x: 50, y: 60});
		test.equal("#000000ff", 
					hex,
					"(50, 60) is black before undo 1");

		$("#drawing-board").drawingBoard('undo', 2);

		hex = $("#drawing-board").drawingBoard('getColor', {x: 50, y: 60});
		test.equal("#ff0000ff", 
					hex,
					"(50, 60) is red after undo 1");
		test.done();
	}
});