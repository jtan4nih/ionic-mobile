/**
 * Current limitations: 
 * 
 * 1. Only a single user is used amd should be used, i.e. user1@gmail.com
 * 2. Not all REST APIs are supported
 * 
 */
//setup Dependencies
var express = require('express'),
    path = require('path'),
    options = require('node-options'),
    fileSystem = require('node-fs'),
    cors = require('cors');
var bodyParser = require('body-parser'); 

var rootDir = path.resolve('.', 'resources').toLowerCase();

var gFakeMsg1LikeCount = 0;  //TODO bad bad bad!!!
var saveLikeId = 1;  //277;

// var opts =  {
//     "port"    : process.env.MOCK_API_PORT | 1080,
//     "verbose" : true
// };
// options.parse(process.argv.slice(2), opts);
//Setup Express
var app = express();
app.use(express.static('../www'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// var server = app.listen(opts.port);
app.set('port', process.env.MOCK_API_PORT || 3000);  //NB: 8080 is the default port - DO NOT forget to change the baseUrl inside protractor.conf.js if the default port is changed!
var server = app.listen(app.get('port'), function () {
  console.log('Mock API Server Listening on http://localhost:' + app.get('port'));
  console.log('Root directory = \'' + rootDir + '\'');
});

app.all('/explorer', function (req, res) {
    if (req.method == 'GET') {
        res.status(200).send('StrongLoop API Explorer');
    }
    res.end();
});

app.all('/explorer/swagger.json', function (req, res) {
    var resourceDir = path.resolve('.', 'swagger.json');
    console.log('swagger.json [' + resourceDir + ']');
    var text = fileSystem.readFileSync(resourceDir);
    var message = stringFormat(text);
    if (req.method == 'GET') {
        res.status(200).send(message);
    }
    res.end();
});

app.all('/api/*Questspowerups?filter*', function (req, res) {
    var obj = `
[{"id":3,"questsid":2,"powerupsid":1,"powerups":{"id":1,"title":"Hydration PU 1","what":"a brief instruction () describing how to complete the Hydration","how":"a corresponding explanation of how the Hydration may be beneficial to the user","category":"Hydration","subcategory":"Brainstorm","state":"Incomplete","point":0,"questsId":null}}]
    `;
    if (req.method == 'GET') {
        res.status(200).send(obj);
    }
    res.end();
});

app.all('/api/*Usersthreads/*inbox*', function (req, res) {
    var obj = `
{"inbox":[{"id":257,"subject":"Message by u 1","text":"test 1 from my messages","createdat":"2016-04-05T00:00:00.000Z","updatedat":"2016-04-05T00:00:00.000Z","liked":"false","state":"Private","type":"NA","owner":0,"likecount":0,"threadid":39},{"id":258,"subject":"Message by u 1","text":"test 2 from my messages","createdat":"2016-04-05T00:00:00.000Z","updatedat":"2016-04-05T00:00:00.000Z","liked":"false","state":"Private","type":"NA","owner":0,"likecount":0,"threadid":39},{"id":257,"subject":"Message by u 1","text":"test 1 from my messages","createdat":"2016-04-05T00:00:00.000Z","updatedat":"2016-04-05T00:00:00.000Z","liked":"false","state":"Private","type":"NA","owner":0,"likecount":0,"threadid":39},{"id":258,"subject":"Message by u 1","text":"test 2 from my messages","createdat":"2016-04-05T00:00:00.000Z","updatedat":"2016-04-05T00:00:00.000Z","liked":"false","state":"Private","type":"NA","owner":0,"likecount":0,"threadid":39}]}
    `;
    if (req.method == 'GET') {
        res.status(200).send(obj);
    }
    res.end();
});

app.all('/api/*Usersthreads/*mymessages*', function (req, res) {
    var obj = `
{"messages":[{"id":278,"subject":"Message from u1 to u2","text":"u1 sent to u2","createdat":"2016-04-05T00:00:00.000Z","updatedat":"2016-04-05T00:00:00.000Z","liked":"false","state":"Private","type":"NA","owner":0,"likecount":0,"threadid":1,"fromwho":"u1","towho":"u2"}]}
    `;
    if (req.method == 'GET') {
        res.status(200).send(obj);
    }
    res.end();
});

app.all('/api/*UsersThreads/*sendMessage', function (req, res) {
    var obj = `
    {"usersthreads":{"id":35,"messages":254}}
    `;
    if (req.method == 'POST') {
        res.status(200).send(obj);
    }
    res.end();
});

app.all('/api/*UsersThreads', function (req, res) {
    var obj = `
    [{"id":1,"title":"Hydration","description":null,"threshold":2,"state":"Unlocked","point":5},{"id":2,"title":"Medication","description":null,"threshold":4,"state":"Unlocked","point":10},{"id":3,"title":"Exercise","description":null,"threshold":10,"state":"Unlocked","point":20}]
    `;
    if (req.method == 'GET') {
        res.status(200).send(obj);
    }
    res.end();
});

app.all('/api/*Quests', function (req, res) {
    var obj = `
    [{"id":1,"title":"Hydration","description":null,"threshold":2,"state":"Unlocked","point":5},{"id":2,"title":"Medication","description":null,"threshold":4,"state":"Unlocked","point":10},{"id":3,"title":"Exercise","description":null,"threshold":10,"state":"Unlocked","point":20}]
    `;
    if (req.method == 'GET') {
        res.status(200).send(obj);
    }
    res.end();
});

app.all('/api/*Users/*findOne?filter=*', function (req, res) {
console.log('/api/*Users/findOne?filter=* req.id = [' + req.params.id + ']')
    var obj = `
    {"id":1,"name":"u 1","email":"user1@gmail.com","studyid":"string","interests":"string","transplantdate":"2016-07-11T00:00:00.000Z","startdate":"2016-07-11T00:00:00.000Z","avatar":"string","state":0}
    `;
    if (req.method == 'GET') {
        res.status(200).send(obj);
    }
    res.end();
});

app.all('/api/*Users', function (req, res) {
    var obj = `
    [{"id":3,"name":"u 1","email":"user1@gmail.com","studyid":"string","interests":"string","transplantdate":"2016-07-11T00:00:00.000Z","startdate":"2016-07-11T00:00:00.000Z","avatar":"string","state":0},{"id":4,"name":"u2","email":"user2@gmail.com","studyid":"string","interests":"string","transplantdate":"2016-07-11T00:00:00.000Z","startdate":"2016-07-11T00:00:00.000Z","avatar":"string","state":0}]
    `;
    if (req.method == 'GET') {
        res.status(200).send(obj);
    }
    res.end();
});

app.all('/api/*Messages/*count', function (req, res) {
    if (req.method == 'GET') {
        res.status(200).send(`
            {
              "count": 11
            }
        `);
        res.end();
    }
});

app.all('/api/*Messages/*findOne*', function (req, res) {
    if (req.method == 'GET') {
        console.log('/api/Messages/*findOne?filter=* req.id = [' + req.params.id + ']');
        res.status(200).send(`{"id":29,"subject":"Message by u 1","text":"c1","createdat":"2016-08-23T08:28:04.000Z","updatedat":null,"liked":"false","state":"Public","type":"topic143","owner":25,"likecount":0}`);
    }
    res.end();
});

//=== only support first message for now
app.all('/api/*Messages/*:id', function (req, res) {
    if (req.method == 'GET') {
        console.log('/api/Messages/:id req.id = [' + req.params.id + ']');
        if(req.params.id >= 0) {
            gFakeMsg1LikeCount++;
        } else {
            gFakeMsg1LikeCount--;
        }
        console.log('/api/Messages/:id gFakeMsg1LikeCount = ' + gFakeMsg1LikeCount);
        //=== flip the state from true to false!
        //???
        var data = `{"id":'${req.params.id}',"subject":"Message by u ${req.params.id}'","text":"t1 from mock service","createdat":"2016-04-05T00:00:00.000Z","updatedat":"2016-04-05T00:00:00.000Z","state":false,"type":"topic158-owner","owner":-1,"likecount": ${gFakeMsg1LikeCount}}`;
        res.status(200).send(data.trim());
        res.end();
    }
});

app.all('/api/*Flags', function (req, res) {
    if (req.method == 'GET') {
        console.log('2');
        var user = req.body.user;
        console.log('3');
        console.log(user);
        // if(typeof user !== 'undefined' && user !== '') {
          console.log('4');
          res.status(200).send(`[{"id":1,"subject":"Like by u 1","description":"favourite of a message","state":0,"messages":1,"owner":1}]`);

    } else
    if (req.method == 'POST') {
        if(typeof req.body === 'undefined') {
            console.log('1 /api/Flags posted!!! <-------------------------');
            res.status(200).send('{"status":""}');
        } else {
            // } else {
            //   console.log('5');
            //   res.status(200).send('{"status":""}');
            // }
        }
    } else
    if (req.method == 'PUT') {
        console.log('2 /api/Flags put!!! <-------------------------');
        res.status(200).send('{"status":""}');
    }
    res.end();
});

//TODO 1-23 this needs to be in lb-services.js for reuse! (c.f. https://docs.strongloop.com/display/public/LB/AngularJS+JavaScript+SDK)
function predicatBy(prop){
   return function(a,b){
      if( a[prop] > b[prop]){
          return 1;
      }else if( a[prop] < b[prop] ){
          return -1;
      }
      return 0;
   }
}

app.all('/api/*Threads', function (req, res) {
    var obj = `
    {"id":5,"messages":5}
    `;
    if (req.method == 'POST') {
        res.status(200).send(obj);
    }    
    res.end();
});

app.all('/api/*Threads/*wall', function (req, res) {
    var obj =
        [
    {"id":1,"subject":"string","text":"first topic - 1 comment","createdat":"2016-04-06T00:02:30.000Z","updatedat":"2016-04-06T00:00:00.000Z","state":"string","type":"topic1-owner","owner":1,"threadid":1,"likecount":gFakeMsg1LikeCount},
    {"id":2,"subject":"string","text":"comment 1","createdat":"2016-04-11T13:45:00.000Z","updatedat":"2016-04-01T00:00:00.000Z","state":"string","type":"topic2","owner":2,"threadid":1,"likecount":1},
    {"id":3,"subject":"string","text":"second topic - two comments","createdat":"2016-04-11T13:45:00.000Z","updatedat":"2016-04-01T00:00:00.000Z","state":"string","type":"topic2-owner","owner":2,"threadid":2,"likecount":1},
    {"id":4,"subject":"string","text":"comment 2","createdat":"2016-04-11T00:00:00.000Z","updatedat":"2016-04-06T00:00:00.000Z","state":"string","type":"topic2","owner":3,"threadid":2,"likecount":1},
    {"id":5,"subject":"string","text":"comment 3","createdat":"2016-04-11T00:00:00.000Z","updatedat":"2016-04-06T00:00:00.000Z","state":"string","type":"topic2","owner":3,"threadid":2,"likecount":1},
    {"id":6,"subject":"string","text":"third topic - zero comment","createdat":"2016-04-07T13:45:00.000Z","updatedat":"2016-04-07T00:00:00.000Z","state":"string","type":"topic1-owner","owner":0,"threadid":1,"likecount":0}
        ];
    //console.log('cb obj 3 [');
    //console.log(obj);
    //console.log(']');
    
    //=== sort it based on owner's, message type and timestamp
    // var data = Array.prototype.slice.call(obj);
    var sortedMessages;
    // sortedMessages = data.sort(predicatBy('createdat'));
    // sortedMessages = sortedMessages.sort(predicatBy('owner'));
    // sortedMessages = sortedMessages.sort(predicatBy('type'));
    sortedMessages = obj;  //TODO comment this out for sorting!
    var wrapper = {'wall':sortedMessages};
    var message = wrapper;
    // console.log(typeof message);
    // console.log(message);
    // console.log('sorted cb obj [');
    // console.log(sortedMessages);
    // console.log(']');

    // var message = stringFormat(text);
    if (req.method == 'GET') {
        res.status(200).send(message);
        // console.log('/api/Messages GET message [' + message + '] <===================================================');
    }
    if (req.method == 'POST') {
        console.log('/api/Messages POST req id [' + req.body.id + '] text [' + req.body.text + ']');
        res.status(200).send('{"id":7,"subject":"string","text":"'+ req.body.text + '","createdat":"2016-04-05T00:00:00.000Z","updatedat":"2016-04-05T00:00:00.000Z","state":"string","type":"string","owner":0}');
    }    
    res.end();
});

app.all('/api/Messages', function (req, res) {
    console.log('/api/Messages called!');
    if (req.method == 'GET') {
        console.log('/api/Messages GET called!');
        // res.status(200).send(message);
        // res.end();
    } else
    if (req.method == 'POST') {
        console.log('/api/Messages POST called!');
        console.log('/api/Messages POST req fromwho [' + req.body.fromwho + '] towho [' + req.body.towho + '] text [' + req.body.text + ']');
        console.log('/api/Messages POST req body [' + req.body + ']');
        var expectedMegId = 5;
        var expectedText = req.body.text || "";
        var obj = `
        {"id":${expectedMegId},"subject":"Message by u 1","text":"${expectedText}","liked":"false","state":"Public","type":"topic147-owner","owner":25,"likecount":0}
        `;

        res.status(200).send(obj);
    } else
    if (req.method == 'PUT') {
        console.log('/api/Messages PUT called!');
        console.log('/api/Messages req.body = ' + req.body);
        console.log('/api/Messages PUT req fromwho [' + req.body.fromwho + '] towho [' + req.body.towho + '] text [' + req.body.text + ']');
        var expectedText = req.body.text;
        var obj = `{"id":${saveLikeId},"subject":"Message by u 1","text":"${expectedText}","createdat":"2016-04-05T00:00:00.000Z","updatedat":"2016-04-05T00:00:00.000Z","liked":"false","state":"Public","type":"topic58-owner","owner":3,"likecount":${gFakeMsg1LikeCount}}`;
    
        res.status(200).send(obj);
    }

    res.end();
});


app.all('/api/Users/login', function (req, res) {
// app.all('/Users/login', function (req, res) {
    if (req.method == 'POST') {
        if(typeof req.body === 'undefined') {
            console.log('1');
            res.status(200).send('{"status":""}');
        } else {
            console.log('2');
            var userId = req.body.userId;
            var password = req.body.password;
            console.log('3');
            console.log(userId);
            console.log(password);
            if((userId === 'test@gmail.com' || userId === 'user1@gmail.com') && password === '111111') {
              console.log('4');
              //=== Notes: the response type has to match Loopback return type!
              res.status(200).send(`{"status":{"flag": "ok", "userId": "user1@gmail.com", "jwtToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1c2VyMUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImV4cCI6MTQ3MzkzNTg5ODQxNn0.DBOZVQirzgnYVRN-pLZIzgMaqAgTt7eItlH7G9GNUw4", "user": {"session_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjMsInVzZXJfaWQiOjMsImVtYWlsIjoidXNlcjFAZ21haWwuY29tIiwiZm9yZXZlciI6ZmFsc2UsImlzcyI6Imh0dHBzOlwvXC9kZi1zdGVtMi5lbnRlcnByaXNlLmRyZWFtZmFjdG9yeS5jb21cL2FwaVwvdjJcL3VzZXJcL3Nlc3Npb24iLCJpYXQiOjE0NjYxNTk4NzksImV4cCI6MTQ2NjE2MzQ3OSwibmJmIjoxNDY2MTU5ODc5LCJqdGkiOiJlYWNmNWE3NTA5MjY5OTU5YzhhMjkyZGJkYjA3Y2U3ZiJ9.I_YBX39oQpIWLQ0ZeVgPsjkLn-IUte-FzfJ6dmtm_sI","session_id":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjMsInVzZXJfaWQiOjMsImVtYWlsIjoidXNlcjFAZ21haWwuY29tIiwiZm9yZXZlciI6ZmFsc2UsImlzcyI6Imh0dHBzOlwvXC9kZi1zdGVtMi5lbnRlcnByaXNlLmRyZWFtZmFjdG9yeS5jb21cL2FwaVwvdjJcL3VzZXJcL3Nlc3Npb24iLCJpYXQiOjE0NjYxNTk4NzksImV4cCI6MTQ2NjE2MzQ3OSwibmJmIjoxNDY2MTU5ODc5LCJqdGkiOiJlYWNmNWE3NTA5MjY5OTU5YzhhMjkyZGJkYjA3Y2U3ZiJ9.I_YBX39oQpIWLQ0ZeVgPsjkLn-IUte-FzfJ6dmtm_sI","id":3,"name":"u1","first_name":"u","last_name":"1","email":"user1@gmail.com","is_sys_admin":false,"last_login_date":"2016-06-17 10:37:59","host":"enterprise-console"}}}`);
            } else {
              console.log('5');
              res.status(200).send('{"status":""}');
            }
          }
    } 
    else if (req.method == 'GET') {
        //TODO
    } else {
        res.status(404).send('Don\'t know what you\'re looking for...');
    }
    res.end();
});

function stringFormat(format /* arg1, arg2... */) {
    if (arguments.length === 0) {
        return undefined;
    }
    if (arguments.length === 1) {
        return format;
    }
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
        if (m === "{{") {
            return "{";
        }
        if (m === "}}") {
            return "}";
        }
        return args[n];
    });
}

exports.app = app;
exports.server = server;
