(function($) {
	/*--- Utility functions -----------------------------*/
	function rgbaToHex(r, g, b, a) {
			if (r > 255 || g > 255 || b > 255 || a > 255)
					throw "Invalid color component";
			var number = ((r << 24) | (g << 16) | (b << 8) | a);
			number = 0xFFFFFFFF + number + 1;
			return number.toString(16);
	}

	function array_reverse(array) {
		var left = null;
		var right = null;
		for (left = 0; left < array.length / 2; left += 1)
		{
		    right = array.length - 1 - left;
		    var temporary = array[left];
		    array[left] = array[right];
		    array[right] = temporary;
		}
		return array;
	}


	/*--- Public methods --------------------------------*/
	var methods = {
		init: function(options) {
			this.each(function() {
				$(this).append('<canvas id="drawing-board" />');
			});
			return this;
		},
		drawLine: function(line, options) {
			options = $.extend({}, {save: true}, options);
			if(options.save) {
				var lines = this.data('lines');
				if(lines == undefined) {
					this.data('lines', []);
					lines = this.data('lines');
				}
				lines.push(line);
			}

			this.each(function() {
				$(this).drawLine(line);
			});
			return this;
		},
		clear: function() {
			this.each(function() {
				this.width = this.width; // Clear canvas by setting width
			});
			return this;
		},
		redraw: function() {
			this.drawingBoard('drawLines', this.data('lines'), {'save': false});
			return this;
		},
		drawLines: function(lines, options) {
			for(var i = 0; i < lines.length; i++) {
				this.drawingBoard('drawLine', lines[i], options);
			}
			return this;
		},
		undo: function(id) {
			var lines = this.data('lines');
			if(lines == undefined) return this;

			lines = array_reverse(lines);

			for(var i = 0; i < lines.length; i++) {
				var line = lines[i];
				if(line['id'] == id) {
					if(line['savepoint']) break;
					lines.splice(i, 1);
					i--;
				}
			}
			lines = array_reverse(lines);

			this.data('lines', lines);
			this.drawingBoard('clear').drawingBoard('redraw');
		},
		save: function(id) {
				var lines = this.data('lines');
				if(lines == undefined) {
					this.data('lines', []);
					lines = this.data('lines');
				}
				lines.push({'id': id, 'savepoint': true});
		},
		getColor: function(pos) {
			var c = this[0].getContext('2d');
			var x = pos.x, y = pos.y;
			var pa = c.getImageData(x, y, 1, 1);
			var p = pa.data;
			var hex = "#" + ("00000000" + rgbaToHex(p[0], p[1], p[2], p[3])).slice(-8);
			return hex;
		}
	};

	/*--- Method Dispatcher -----------------------------------*/
	$.fn.drawingBoard = function(method) {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if(typeof method === 'object' || !method) {
			return methods['init'].apply(this, arguments);
		} else {
			$.error("Method " + method + "does not exist for drawingArea objects");
		}
	};
})(jQuery);

/*(function() {
	var cleared = true;
		var lines = []
		var saves = [0]

		function drawLine(line, options) {
			var default_options = {
				save_for_undo: true
			};
			for(var index in default_options) 
				if(options[index] === "undefined") options[index] = default_options[index];

			if(options.save_for_undo) lines.push(line);
			var x1 = line[0],
			y1 = line[1],
			x2 = line[2],
			y2 = line[3],
			width = line[4],
			color = line[5],
			id = line[6];
			$("#canvas").drawLine({
								strokeStyle: color,
								fillStyle: color,
								strokeWidth: width,
								rounded: true,
								x1: x1, y1: y1,
								x2: x2, y2: y2 });
			cleared = false;
		}

		function clear() {
			if(!cleared) {
				var canvas = document.getElementById("canvas");
				canvas.width = canvas.width; // Clear canvas
				cleared = true;
			}
		}

		function redraw(lines_in) {
			if(typeof(lines_in) !== "undefined") lines = lines_in;
			clear();
			console.log("redrawing: " + lines.length);
			for(var i = 0; i < lines.length; i++) {
				drawLine(lines[i], false);
			}
		}

		function resize() {
			var canvas = document.getElementById("canvas");
			canvas.width = $("#drawing-area").width();
			canvas.height = $("#drawing-area").height();
			redraw();
		}

		function undo(savepoint, id) {
			lines = lines.filter(function(element, index, array) {
				return !(element[6] == id && index >= savepoint);
			});
			console.log("Undoing to " + savepoint);
			redraw();
		}

		function save() {
			console.log("Saving at " + lines.length);
			saves.push(lines.length);
		}

		function wipe_clean() {
			lines.length = 0
			saves.length = 0
			redraw();
		}

		window.canvas_drawLine = drawLine;
		window.canvas_lines = lines;
		window.canvas_saves = saves;
		window.canvas_resize = resize;
		window.canvas_redraw = redraw;
		window.canvas_undo = undo;
		window.canvas_save = save;
		window.canvas_wipe_clean = wipe_clean;
})();*/