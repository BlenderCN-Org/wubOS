var forever = require('forever-monitor');

var child = new (forever.Monitor)('app.js');

child.start();