var http = require('http'),
httpProxy = require('http-proxy');
var servers = ['http://127.0.0.1:8001', 'http://127.0.0.1:8002', 'http://127.0.0.1:8003'];

var proxy = httpProxy.createProxyServer();
var count = 0;
var server = 1;
http.createServer(function (req, res) {
    var cur = server % servers.length;
    server++;
    var target = servers[cur];
    proxy.web(req, res, {
        target: target
    });
}).listen(8000);

