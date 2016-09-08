var express = require('express');
var app = express();
app.use(express.static('www'));
var exports = module.exports = {};

app.disable('x-powered-by');
// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
app.set('port', process.env.PORT || 8080);  //NB: 8080 is the default port - DO NOT forget to change the baseUrl inside protractor.conf.js if the default port is changed!
var server = app.listen(app.get('port'), function () {
    console.log('Ionic Web Server listening on port ' + app.get('port'));
});
exports.app = app;
exports.server = server;
