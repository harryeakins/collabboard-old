var syncer = require('./syncer')
var nm = require("nodemock");
var colorize = require('colorize');

function hook_stdout(callback) {
    var old_write = process.stdout.write

    process.stdout.write = (function(write) {
        return function(string, encoding, fd) {
            callback(string, encoding, fd)
        }
    })(process.stdout.write)

    return function() {
        process.stdout.write = old_write
    }
}

var cconsole = colorize.console;

var tests = 
{
testSyncer2Users_callbackCalled: function () {
	var test_lines = [{'id': 1}, {'id':2}];

	console.log("Creating mocks");

	// Callback called immediately with test_lines as argument
	var mockuser1 = nm.mock('on').takes('data', function(){}).calls(1, [test_lines]);
	mockuser1.id = '1';

	var mockuser2 = nm.ignore('on');
	mockuser2.mock('emit').takes('data', test_lines);
	mockuser2.id = '2';

	console.log("Creating syncer");

	s = new syncer.Syncer();

	console.log("Adding users");

	s.addUser(mockuser2);
	s.addUser(mockuser1);

	console.log("Added users");

	mockuser1.assert();
	mockuser2.assert();
}
}

for (var test_name in tests) {
	process.stdout.write(colorize.ansify("#green[Running #bold[" + test_name + "]...] "));
	var debugString = "";
	var unhook = hook_stdout(function(string, encoding, fd) {
    	debugString += string;
	})

	try {
		tests[test_name]();
	} catch(err) {
		unhook();
		cconsole.log("#red[Failed!]");
		cconsole.log("#red[Exception Raised:]");
		cconsole.log(err.toString());
		cconsole.log("#red[Log:]");
		cconsole.log(debugString);
		continue;
	}

	unhook();

	cconsole.log("#green[Successful!]");
}

process.exit();