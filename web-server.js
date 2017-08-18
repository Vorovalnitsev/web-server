var http = require('http');
//var net = require('net');

var events = require('events');

server = http.createServer();

var EventEmmiter  = events.EventEmitter;

var stopEvent = new EventEmmiter();

stopEvent.on('stop', onStop);

function onStop(param) {
    console.log(param);
    server.close();
}


server.listen(8081);

server.on('request', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html; charset = utf-8'});
    res.write('<p>Привет мир!</p>');
    res.end();
})


server.on('request', function (req, res) {
    console.log('Somebody wants to see ...');
    console.log('URL: ', req.url);
    console.log('Method: ', req.method);
    console.log('Status: ', res.statusCode);
})

server.on('request', function (req, res) {
    if (req.url=='/stop'){
        stopEvent.emit('stop', "Goodbye");
    }
})

server.on('listening', function () {
    console.log('The Server is started...');
    console.log('The port is 8081...');
})

server.on('connection', function (req, socket, head) {
    console.log('Somebody is connected...');
})

server.on('close', function () {
    console.log('The Server is closed...');
})