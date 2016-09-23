'use strict';

var gitems;   //just for test

/**
Usesful SQLs:

select sum(a.quests), sum(a.powerups), sum(a.usersthreads), sum(a.threads), sum(a.flags), sum(a.messages) from (
select count(*) as usersthreads,0 as threads,0 as flags,0 as messages,0 as users,0 as quests, 0 as powerups from usersthreads
union
select 0,count(*),0,0,0,0,0 from threads
union
select 0,0,count(*),0,0,0,0 from flags
union
select 0,0,0,count(*),0,0,0 from messages
union
select 0,0,0,0,count(*),0,0 from users
union
select 0,0,0,0,0,count(*),0 from quests
union
select 0,0,0,0,0,0,count(*) from powerups
) a

Note: a space after -- is required!
-- delete from usersthreads;
-- delete from threads;
-- delete from flags;
-- delete from messages;
-- delete from users;
-- delete from powerups;

Useful Explorer filter:

GET /Questspowerups
{"where": {"questsid": 1}}
{"where": {"powerupsid": 1}}
GET /Users
{"where": {"email": "user1@gmail.com"}}
GET /Quests
{"include": "powerups"}
GET /Powerups
{"where": {"point": 11}}
GET /Flags
{"where": {"messages": 45, "owner": 28}}

References:

https://github.com/urish/angular-moment
*/
angular.module('app.controllers', ['controller.walls', 'controller.quests','controller.powerups','controller.activity'])

.controller('newMessageCtrl', function($location, $ionicFilterBar, Users, $scope, stemcfg, StemFactory, StemService, $state, $stateParams, $ionicLoading, capi) {
    StemFactory.store('newMessagesCtrl', $scope);
    var component = this;
    var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);

    //=== retrieve id selected by toMessage (i.e. private message recipient!)
    component.recipientId = $stateParams.id;
    component.recipientName = $stateParams.name;
    component.recipientEmail = $stateParams.email;

    component.sendMessage = function(id, name, email) {
        $ionicLoading.show({template: `Sending message ...`});
        var fromwhoId = localStorage.getItem(stemcfg.userid);
        var fromwhoName = localStorage.getItem(stemcfg.username);
        var fromwhoEmail = localStorage.getItem(stemcfg.user);
        var towhoId = component.recipientId;
        var towhoName = name;
        var towhoEmail = email;
        var json = {
            id: 0,
            fromwhoId: fromwhoId,
            fromwhoName: fromwhoName,
            fromwhoEmail: fromwhoEmail,
            towhoId: towhoId,
            towhoName: towhoName,
            towhoEmail: towhoEmail,
            text: component.text
        };
        component.createMessage(json);
    };

    component.createMessage = function(json) {
        function afterPrivateMessageCreate(data) {
            // console.log(JSON.stringify(data));
            $ionicLoading.hide();
            StemService.alert('Message sent to ' + component.recipientName + '!');
        }
// debugger
        // console.log('json = ' + json);
        capi(webHost, '/api/UsersThreads/sendmessage', 'POST', 'model', 'method', json, afterPrivateMessageCreate, null);
    }


})

.controller('myMessagesThreadsCtrl', function($ionicFilterBar, Usersthreads, Users, Threads, $scope, StemFactory, StemService, $state, stemcfg, $ionicLoading) {
    StemFactory.store('myMessagesThreadsCtrl', $scope);
    var component = this;
    // console.log($stateParams.id);
    // console.log($stateParams.towho);
    // console.log($state.params.id);
    // console.log($state.params.towho);
    component.id = $state.params.towho;

    $scope.$on('$ionicView.enter', function(){
        $ionicLoading.show({template: `Retrieving all the private messages sent to ${component.id} ...`});
        getInbox();
    });

    function populateInbox(results) {
        // console.log(results);
        component.items = [];
        var loadItemsLimit = results.inbox.length;
        // debugger
        for (var i = 0; i < loadItemsLimit; i++) {
            component.items.push(results.inbox[i]);
            // console.log(component.items[i]);
        }
        $ionicLoading.hide();
    }

    function getInbox() {
        Usersthreads
        .inbox({id: 0})
        .$promise
        .then(function(results) {
            populateInbox(results);
        });
    }

    component.loadMoreItems = function() {
        //TODO
    } //end of component.loadMoreItems


})

.controller('myMessagesCtrl', function($ionicPopup, $ionicFilterBar, Usersthreads, Users, Threads, $scope, StemFactory, $stateParams, StemService, $state, stemcfg, $ionicLoading) {
    StemFactory.store('myMessagesCtrl', $scope);
    StemService.handleInvalidSession($state, $scope, localStorage.getItem(stemcfg.userid), $ionicPopup, $stateParams.m);
    var component = this;
    component.email = localStorage.getItem(stemcfg.user);
    // console.log($stateParams.towho);
    // console.log($state.params);

    $scope.$on('$ionicView.enter', function(){
        $ionicLoading.show({template: `Retrieving all the private messages sent to ${component.id} ...`});
        getItems();
    });

    function populateItems(results) {
        // console.log(results);
        var loadItemsLimit = results.messages.length;
        // debugger
        for (var i = 0; i < loadItemsLimit; i++) {
            var item = results.messages[i];
            // if(item.subject.indexOf('Message from ' + item.towho) > -1) {
            //     item.source = 'Received from: ' + item.towho;
            //     // item.source = 'Received from: ' + item.fromwho + ' to ' + item.towho;
            // }
            // else
            if(item.subject.indexOf('to ' + item.towho) > -1) {
                if(item.towho === localStorage.getItem(stemcfg.username)) {
                    // item.source = 'Sent to: ' + item.fromwho + ' to ' + item.towho;
                    item.source = 'Received from: ' + item.fromwho;
                } else {
                    item.source = 'Sent to: ' + item.towho;
                }
            }
            component.items.push(item);
            // console.log(item);
        }
        $ionicLoading.hide();
    }
    function getItems() {
        var ownerId;
        try {
            ownerId = localStorage.getItem(stemcfg.username);
        } catch(e) {
            throw e;
        }
        // debugger
        $ionicLoading.show({template: 'Retrieving all my messages ...'});
        component.items = [];
        Usersthreads
        .mymessages({fromwho: ownerId, towho: null, text: null})
        .$promise
        .then(function(results) {
            populateItems(results);
        });
    }

    component.loadMoreItems = function() {
        //TODO
    } //end of component.loadMoreItems


})

.controller('toMessageCtrl', function($location, $ionicFilterBar, Users, $scope, StemFactory, StemService, $state, $ionicLoading, capi) {

    StemFactory.store('toMessagesCtrl', $scope);
    var component = this,
        items = [],
        filterBarInstance;

    function getUsers() {
      Users
        .find()
        .$promise
        .then(function(results) {
            var scope = StemFactory.get('toMessagesCtrl');
            items = results;
            // console.log(items);
            component.items = items;
            $ionicLoading.hide();
        });
    }
    $ionicLoading.show({template: 'Retrieving the signed in users ...'});
    getUsers();

    component.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: component.items,
        update: function (filteredItems) {
          component.items = filteredItems;
        },
        filterProperties: 'name'
      });
    };

    component.selectToMessage = function (item) {
        // debugger
        // StemService.alert('You picked ' + item.name + '!');
        $state.go('menu.newMessage', {id: item.id, name: item.name, email: item.email});
    };

})

// .controller('questCtrl', function($ionicPopup, $state, $stateParams, $location, $scope,StemService,stemcfg, $resource, Quests) {
//     StemService.handleInvalidSession($state, $scope, localStorage.getItem(stemcfg.userid), $ionicPopup, $stateParams.m);
//     // console.log('questCtrl called!');

//     var component = this;
//     // component.items = Quests;
//     $scope.items = [];
//     function getQuests() {
// // console.log('questCtrl 1');
//       Quests
//         .find()
//         .$promise
//         .then(function(results) {
//           component.items = results;
// // console.log('questCtrl 3 size ' + component.items.length);
//         });
//     }
//     $scope.$on('$ionicView.enter', function(){
// // console.log('questCtrl 2');
//         getQuests();
//     });

// })


.controller('loginCtrl', function($ionicPopup, $location, $scope,$state,$stateParams,StemFactory,$ionicLoading,StemService,stemcfg, $ionicHistory, capi) {
    // console.log($stateParams.m);
    // alert($stateParams.m);

    StemFactory.store('loginCtrl', $scope);

    StemService.handleInvalidSession($state, $scope, localStorage.getItem(stemcfg.userid), $ionicPopup, $stateParams.m);
    // debugger
    var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
// debugger
    // console.log('inside loginCtrl');
    // StemService.handleStateParams($stateParams, stemcfg);
    function purgeUsersData() {
        localStorage.removeItem(stemcfg.jwt);
        localStorage.removeItem(stemcfg.user);
        localStorage.removeItem(stemcfg.userid);
        localStorage.removeItem(stemcfg.username);
        localStorage.removeItem(stemcfg.useravatar);
        localStorage.removeItem(stemcfg.dfuser);

        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        document.getElementById("mydata").innerHTML = "";
    }
    $scope.$on('$ionicView.enter', function(){
        purgeUsersData();
    });
    var that = this;
    var component = this;

    component.createLocalUser = function(name, userEmail, cb) {
        function createNow(data) {
            function afterCreateNow(data) {
                // console.log('handleResuls():');
                // console.log(data);
                // debugger;
                //TODO need to upcate the localstorage user with the local user id for ionic!!!
                localStorage.setItem(stemcfg.userid, data.id);
                cb(data);  //proceed as usual (to landing page aka wall)
            }
            //TODO metadata is hardcodeded!
// id is 0!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var jsonData = {
                             "id": 0,
                             "name": name,
                             "email": userEmail,
                             "studyid": "string",
                             "interests": "string",
                             "transplantdate": StemService.getCurrentDate(),
                             "startdate": StemService.getCurrentDate(),
                             "avatar": "string",
                             "state": 0
                           };
            capi(webHost, '/api/Users', 'POST', 'model', 'method', jsonData, afterCreateNow, null);
            // capi(webHost, '/api/Users', 'POST', 'model', 'method', jsonData, afterCreateNow, null, 'swagger');
        }
        function handleExistingUser(data) {
            // console.log('handleExistingUser data: ');
            // console.log(data);
            // debugger
            if(typeof data.email !== 'undefined' && data.email === userEmail) {
                //TODO need to upcate the localstorage user with the local user id for ionic!!!
                localStorage.setItem(stemcfg.userid, data.id);  //TODO data.id is invalid if the duplicate exsist!??????
                //NOTES: we will never reach here as the fetch throws error if the user is not found!
                //do npthing!
                // console.log(userEmail + ' exists locally!');
                component.afterCreateLocalUser(data);
            } else {
                createNow(data);
            }
        }
        var json = {"where": {"email": userEmail}};
        try {
            capi(webHost, '/api/Users/findOne?filter=' + StemService.toExplorerFilter(json), 'GET', 'model', 'method', {}, handleExistingUser, null);
        } catch(e) {
            //debugger
            throw e;
        }
    }

    component.isAuthenticated = function() {
        // console.log('controllers.js:isAuthenticated webHost [' + webHost + ']');
        // webHost = 'http://50.28.56.122:3000'; //TODO - just for test - comment this out in production!!!
        // webHost = 'http://localhost:3000'; //TODO - just for test - comment this out in production!!!
        // webHost = 'http://localhost:3064'; //TODO - just for test - comment this out in production!!!

        // console.log('loginCtrl:isAuthenticated called');
        // debugger
        var u = that.userId;
        var p = that.password;
        var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
        var targetUrl = webHost + "/explorer/swagger.json";
        var msg = "loginCtrl: connecting to openAPI [" + targetUrl + "] ...";
        // document.getElementById("mydata").innerHTML = msg;
        // console.log(msg);
        $ionicLoading.show({template: 'Logging in ...'});

        function authenticated(data) {
            var dfJSONResponse = data;
            // debugger

            if(typeof data !== 'undefined' && data.data === '{"status":""}') {
                var scope = StemFactory.get('loginCtrl');
                scope.$apply(function() {
                    //Tnvalid login
                    document.getElementById("mydata").innerHTML = "Invalid credentials.";
                    $ionicLoading.hide();
                });
                return;
            }

            var jsonStr;
            try {
                var d = JSON.parse(JSON.stringify(StemService.handleFetchResponse(dfJSONResponse)));
                if (StemService.isSwaggerClientResponse(data)) {
                    jsonStr = d.obj.status; //must be through Swagger-Client!
                } else {
                    jsonStr = d.status; //must be via HTTP Fetch
                }
            } catch (e) {
                StemService.alert('Serious system failure or communication error! Is the network up and running correctly?');
                return e;
            }
            var json = JSON.parse(JSON.stringify(jsonStr)); //ya, I know, JSON.stringify() is not needed in reality :(
            //TODO this is not the way   to do it! Is the JSON valid????
            // var start = "token: ";
            // var start_user = "user: ";
            if (typeof json === 'string') {
                json = JSON.parse(json); //this is more like a hack to make the mockup and the real response work together
            }
            var user_str = JSON.stringify(json.user); //json.substring(json.indexOf(start_user) + start_user.length+1, json.length-2);
            var user_avatar = '';
            // console.log('json.user = ');
            // console.log(JSON.parse(user_str));
            // debugger
            //=== save local user id (Accounts Synchronization)
            localStorage.setItem(stemcfg.dfuser, user_str);
            // localStorage.setItem(stemcfg.username, json.user.name);
            localStorage.setItem(stemcfg.username, json.user.first_name + json.user.last_name);
// console.log('localStorage.getItem(stemcfg.username set to ' + localStorage.getItem(stemcfg.username));
            // debugger;
            localStorage.setItem(stemcfg.useravatar, user_avatar);
            // console.log(user_avatar);

            //need to query the user id for the app!!!
            function printLocalUserId(data) {
                // debugger
                // localStorage.setItem(stemcfg.userid, data.id);  //TODO data.id is invalid if the duplicate exsist!
            }
            //TODO this probably should be moved to StemService
            component.getOwnerId = function(userEmail, cb) {
                var ret = -1;
                var json = {
                    "where": {
                        "name": userEmail
                    }
                };

                function printOwnerId(data) {
                    // console.log('/api/Users = ');
                    // console.log(data);
                    // console.log('owner id = ' + data[0].id);
                }
                //=== retrieve the logged in user's id
                // capi(webHost, '/api/Users?filter=' + encodeURIComponent(r), 'GET', 'model', 'method', {}, printOwnerId, null);
                capi(webHost, '/api/Users?filter=' + StemService.toExplorerFilter(json), 'GET', 'model', 'method', {}, cb, null);

                return ret;
            }
            component.getOwnerId(localStorage.getItem(stemcfg.user), printLocalUserId);
            // document.getElementById("mydata").innerHTML = "";

            var token = json.jwtToken; //json.user.session_token;  //json.substring(json.indexOf(start) + start.length+1, json.length-2);
            // console.log('json token = [' + token + ']')
            if (typeof token !== 'undefined' && token.length > 5) {
                //   document.getElementById("mydata").innerHTML = "";
                localStorage.setItem(stemcfg.jwt, token);
                // localStorage.setItem(stemcfg.username, json.user.name);
localStorage.setItem(stemcfg.username, json.user.first_name + json.user.last_name);
                localStorage.setItem(stemcfg.user, u);
            }

            component.afterCreateLocalUser = function(data) {
                // console.log("if authenticated, dfJSONResponse.obj.status should not be empty: dfJSONResponse.obj.status = ");
                // console.log(StemService.handleFetchResponse(dfJSONResponse).status);
                // debugger
                if (StemService.handleFetchResponse(dfJSONResponse).status !== '') {

                    if (jsonStr !== '') {

                        $ionicLoading.hide();
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                        $state.go('menu.wall', {
                            id: u,
                            cache: false
                        });
                    }
                    // else {
                    //     document.getElementById("mydata").innerHTML = "Invalid credentials.";
                    //     $ionicLoading.hide();
                    // } //StemService.handleFetchResponse(dfJSONResponse).status end
                } else {
                    scope.$apply(function() {
                        //Tnvalid login
                        document.getElementById("mydata").innerHTML = "Invalid credentials.";
                        $ionicLoading.hide();
                    });
                }
            } //afterCreateLocalUser end

            // debugger
            // if(StemService.handleFetchResponse(data).status !== "") {
            if (StemService.handleFetchResponse(dfJSONResponse).status !== "") {
                var name = localStorage.getItem(stemcfg.username);
                var email = u;
                // debugger
                component.createLocalUser(name, email, component.afterCreateLocalUser);
            } else {
                var scope = StemFactory.get('loginCtrl');
                scope.$apply(function() {
                    //Tnvalid login
                    document.getElementById("mydata").innerHTML = "Invalid credentials.";
                    $ionicLoading.hide();
                });
            }
        } //authenticated end

        capi(webHost, '/api/Users/login', 'POST', 'model', 'method', {userId: u, password: p}, authenticated, null, 'swagger');
        // capi(webHost, '/api/Users/login', 'POST', 'model', 'method', {userId: u, password: p}, authenticated, null);
    } //component.isAuthenticated end
});