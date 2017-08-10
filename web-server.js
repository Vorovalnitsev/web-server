var http = require('http');

server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html; charset = utf-8'});
    res.write('<p>Привет мир</p>');
    res.end();
}).listen(8081, '127.0.0.1');