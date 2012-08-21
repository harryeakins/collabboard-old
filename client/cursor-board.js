(function($) {
	var methods = {
		init: function(options) {
			this.each(function() {
				$(this).append('<canvas id="cursor-area" />'); 
			});
		},
		drawCursor: function(x, y) {
			this.each(function() {
				var x1 = line[0],
					y1 = line[1],
					x2 = line[2],
					y2 = line[3],
					width = line[4],
					color = line[5],
					id = line[6];

				$(this).drawLine({
	                strokeStyle: color,
	                fillStyle: color,
	                strokeWidth: width,
	                rounded: true,
	                x1: x1, y1: y1,
	                x2: x2, y2: y2 });
			});
		},
		clear: function() {
			this.each(function() {
				this.width = this.width; // Clear canvas by setting width
			});
		},
		drawLines: function(lines) {
			for(var i = 0; i < lines.length; i++) {
				this.drawLine(lines[i]);
			}
		}
	};
	$.fn.drawingArea = function(method) {
		if(methods[method]) {
			methods[method].call(this, Array.prototype.slice(arguments, 1));
		} else if(typeof(method) == Object) {
			methods['init'].call(this, arguments);
		} else {
			$.error("Method " + method + "does not exist for drawingArea objects");
		}
	};
})(jQuery);