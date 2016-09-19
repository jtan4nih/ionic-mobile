angular.module('app.services', ['angularMoment'])

.factory('StemFactory', [function(){
  var mem = {};
  return {
    store: function (key, value) { mem[key] = value; },
    get: function (key) { return mem[key]; }
  };
}])

.service('StemService', ['$q','StemFactory','$ionicPopup',function($q,StemFactory,$ionicPopup,stemcfg){

  return {
    getRealHost:function(hosttype, stemcfg, stateParams) {
      var host;
      var mode = localStorage.getItem(stemcfg.appmode);
    //   debugger
      
    //   if(hosttype === 'web') {
if(hosttype.indexOf('localhost:8043') > -1) {
    host = 'https://localhost:3043';
    localStorage.setItem(stemcfg.appmode, 'dev3');
    localStorage.setItem(stemcfg.apihost, host);
} else
if(hosttype.indexOf('amazonaws.com:8043') > -1) {
    host = 'http://ec2-54-175-194-254.compute-1.amazonaws.com:3043';
    localStorage.setItem(stemcfg.apihost, host);
} else
      if(hosttype.indexOf('amazonaws') > -1 || hosttype.indexOf('herokuapp') > -1) {
        host = 'http://ec2-54-175-194-254.compute-1.amazonaws.com:3000';
        localStorage.setItem(stemcfg.apihost, host);
      } else
      if(hosttype.indexOf('3064') > -1) {
//   if(mode === 'dev') {
        host = 'http://localhost:3064';
        localStorage.setItem(stemcfg.appmode, 'dev');
      } else if(hosttype.indexOf('8080') > -1 || hosttype.indexOf('8100') > -1) {
// debugger
        var apihost = localStorage.getItem(stemcfg.apihost);
        if(stateParams.m === '1' ||
        ((typeof apihost !== 'undefined') 
        && apihost !== ''
        && apihost !== null
        )) {
            host = 'http://ec2-54-193-69-129.us-west-1.compute.amazonaws.com:3000';
            // host = 'http://17.173.176.198:3000';
            localStorage.setItem(stemcfg.apihost, host);
        } else {
            // debugger
            host = 'http://localhost:3000';
        }
        localStorage.removeItem(stemcfg.appmode);
      }
    //   }
    //   console.log('services.js:getRealHost hosttype [' + hosttype + '] mode [' + mode + '] host [' + host + ']');
      return host;
    },
    // handleStateParams:function(stateParams, stemcfg) {
    //   if(typeof stateParams.m !== 'undefined') {
    //     localStorage.setItem(stemcfg.appmode, stateParams.m);
    //     console.log('controllers.js:loginCtrl app mode set to [' + localStorage.getItem(stemcfg.appmode) + ']');
    //   } else {
    //     localStorage.removeItem(stemcfg.appmode);
    //   }
    // },
    getUserName: function(stemcfg) {
        var userdf = {}
        try {
            userdf = JSON.parse(localStorage.getItem(stemcfg.dfuser));
        } catch(e) {
            console.log('services.js getUserName() exception = ' + e);
        }
        return userdf.first_name + " " + userdf.last_name;
    },
    getUserId: function(stemcfg) {
        return localStorage.getItem(stemcfg.userid);
    },
    getUserEmail: function(stemcfg) {
        return localStorage.getItem(stemcfg.user);
    },
    getJWTToken: function(stemcfg) {
        return localStorage.getItem(stemcfg.jwt);
    },
    isSwaggerClientResponse: function(data) {
        // debugger
        var ret;
        if(data.obj && typeof data.obj.status !== 'undefined' && data.obj.status !== '') {
            ret = true;
        } else {
            ret = false;
        }
        return ret;
    },
    toExplorerFilter: function(json) {
        var jsonData = json;
        var r = JSON.stringify(jsonData);
        return encodeURIComponent(r);
    },
    handleFetchResponse: function(data, swagger) {
        // debugger
        if(typeof swagger !== 'undefined' && swagger === 'swagger') {
            data = data.obj;
        }
        return data;
    },
    alert: function(message, title) {
        return $ionicPopup.alert({
          title: title || 'STEM',
          template: message
        });
    },
    hasError: function(message) {
// debugger
        var ret = false;
        if(typeof message !== 'undefined' && message.trim().startsWith('{"error":')) {
            ret = true;
        }
        return ret;
    },
    getCurrentTime: function(dayOffset) {
        if(typeof dayOffset === 'undefined') dayOffset = 0;
        var rDate = new Date();
        rDate.setDate(rDate.getDate()+dayOffset);
        var printDate = rDate.getFullYear() + "-" +
        ('0'+(rDate.getMonth()+1)).slice(-2)+ "-" +
        ('0'+(rDate.getDate())).slice(-2)
        + 'T' + rDate.getHours() + ':' + rDate.getMinutes() + ':'+ rDate.getSeconds() + '.000Z'
        ;
        return printDate;
    },
    getCurrentDate: function(dayOffset) {
        if(typeof dayOffset === 'undefined') dayOffset = 0;
        var rDate = new Date();
        rDate.setDate(rDate.getDate()+dayOffset);
        var printDate = rDate.getFullYear() + "-" +
        ('0'+(rDate.getMonth()+1)).slice(-2)+ "-" +
        ('0'+(rDate.getDate())).slice(-2);
        return printDate;
    },
    handleInvalidSession: function($state, $scope, userid, $ionicPopup, appmode) {
        var id = userid;
        // debugger
        if(typeof id === 'undefined' || id === 'undefined' || id === '') {
            if(appmode === 'dev' || localStorage.getItem('appmode') === 'dev') {
                id = -1;
            } else {
                var popup = $ionicPopup.confirm({
                  title: 'STEM',
                  template: 'Session is invalid, please sign in again.'
                });
                popup.then(function(res) {
                    if(res) {
                        popup.close();
                        // $scope.closePopover();
                        $state.go('menu.login');
                    } else {
                        console.log('handleInvalidSession: logout cancelled!');
                    }
                });
            }
        }
    },
    isRemote: function(host) {
        var ret = false;
        if(host.indexOf('localhost') > -1 || host.indexOf('127.0.0.1') > -1) {
            ret = true;
        }
        return ret;
    }
    

  };
}]);
