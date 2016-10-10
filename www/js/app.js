// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'jett.ionic.filter.bar', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'app.silverbullet', 'ngResource', 'lbServices'])

.factory('$exceptionHandler', function() {
    return function(exception, cause) {
        console.error('app.js angular exception: ' + exception.message + ' (caused by ' + cause + ')');
    };
})

.factory('serviceLogger', function () {
    return {
        request: function (config) {
            //weed out loading of views - we just want service requests.
            if (config.url.indexOf('html') == -1) {
                console.log("app.js: HTTP " + config.method + " request: " + config.url);
            }
            return config;
        }
    };
})

.factory('serviceJWTTokenAdder', function () {
    return {
        request: function (config) {
            //weed out loading of views - we just want service requests.
            // if (config.url.indexOf('html') == -1) {
                var token = localStorage.getItem('stem2token'); //StemService.getJWTToken();
                config.headers.Authorization = 'Bearer ' + token;
                // console.log("JWT: " + config.headers.Authorization + " added into HTTP header");
            // }
            return config;
        }
    };
})

.run(function($ionicPlatform, amMoment) {
    amMoment.changeTimezone('Europe/Paris');

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
    });
})

.constant("stemcfg", {
    "newtopiclabel": "What's Happening?",
    "replytopiclabel": "Leave a Comment",
    "jwt": "stem2token",
    "user": "jwtiss",
    "userid": "stem2userid",
    "username": "stem2name",
    "useravatar": "stem2avatar",
    "dfuser": "df",
    "messagetype1": "topic",
    "messagetype2": "comment",
    "appmode": "appmode",
    "apihost": "apihost",
    // "port": "80",
    // "webhost": "http://127.0.0.1:3064"  //TODO just for testing with mockApiServer
    // "webhost": "https://web.stem.dev:3000" //c.f. mapping see bit.do/6tNS?s=stemdd
    // "webhost": 'http://50.28.56.122:3000' //TODO just for test with a central DEV server
    "webhost": "http://127.0.0.1:3000"  //TODO just for testing with a local middle-tier server
})

.config(configure)

.run(function($location) {
    // You can only inject instances (not Providers)
    // into the run blocks
});

//TODO need to be able to inject StemService into config!!!
// configure.$inject = ['$httpProvider','LoopBackResourceProvider', 'StemService'];
// function configure($httpProvider,LoopBackResourceProvider,stemcfg) {
configure.$inject = ['$httpProvider','LoopBackResourceProvider'];
function configure($httpProvider,LoopBackResourceProvider) {
    // You can only inject Providers (not instances)
    // into the config blocks

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("stem2token");

// debugger
    var host;
    var mode = localStorage.getItem('appmode');
    if(mode === 'dev3') {
    // if($location.absUrl().indexOf('3064') > -1) {
        host = 'https://localhost:3043';
    } else
    if(mode === 'dev') {
    // if($location.absUrl().indexOf('3064') > -1) {
        host = 'http://localhost:3064';
    } else {
        var apihost = localStorage.getItem('apihost') || '';
        if(apihost.trim() !== '') {
            var devTier = localStorage.getItem('appmode');
            if(devTier === 'dev2') {
                host = 'https://polar-cliffs-89059.herokuapp.com:3043';
            } else
            if(devTier === 'dev3') {
                host = 'http://ec2-54-175-194-254.compute-1.amazonaws.com:3000';  //just a hack!
            } else {
                //TODO until "net::ERR_INSECURE_RESPONSE" is resolved with Chrome, can't enable this!                
                // host = 'https://ec2-54-175-194-254.compute-1.amazonaws.com:3043';  //just a hack!
                host = 'http://ec2-54-175-194-254.compute-1.amazonaws.com:3000';  //just a hack!
            }
            // host = apihost;
        } else {
            // debugger
            host = 'http://localhost:3000';
        }
    }
    console.log('lbng-service URL = [' + host +']');
    // Change the URL where to access the LoopBack REST API server
    LoopBackResourceProvider.setUrlBase(host + '/api/');
    // LoopBackResourceProvider.setUrlBase(stemcfg.getRealHost('web', stemcfg) + '/api/');

    //here's where you add your interceptor
    $httpProvider.interceptors.push('serviceLogger');
    $httpProvider.interceptors.push('serviceJWTTokenAdder');

}

window.onerror = function(msg, url, line, col, error) {
  // Note that col & error are new to the HTML 5 spec and may not be
  // supported in every browser.  It worked for me in Chrome.
  var extra = !col ? '' : '\ncolumn: ' + col;
  extra += !error ? '' : '\nerror: ' + error;

  // You can view the information in an alert to see things working like this:
  alert("app.js onerror: " + msg + "\nurl: " + url + "\nline: " + line + extra);

  // TODO: Report this error via ajax so you can keep track
  //       of what pages have JS issues

  var suppressErrorAlert = true;
  // If you return true, then error alerts (like in older versions of
  // Internet Explorer) will be suppressed.
  return suppressErrorAlert;
};
