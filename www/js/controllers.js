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
{"where": {"name": "user1@gmail.com"}}
GET /Quests
{"include": "powerups"}
GET /Powerups
{"where": {"point": 11}}
GET /Flags
{"where": {"messages": 45, "owner": 28}}

References:

https://github.com/urish/angular-moment
*/
angular.module('app.controllers', ['controller.quests','controller.powerups'])

.controller('newMessageCtrl', function($location, $ionicFilterBar, Users, $scope, stemcfg, StemFactory, StemService, $state, $stateParams, capi) {
    StemFactory.store('newMessagesCtrl', $scope);
    var component = this;
    var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);

    //=== retrieve id selected by toMessage (i.e. private message recipient!)
    component.recipientId = $stateParams.id;
    component.recipientName = $stateParams.name;
    component.recipientEmail = $stateParams.email;

    component.sendMessage = function(id, name, email) {
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
            // debugger
            // if(StemService.hasError(data)) {
                console.log(JSON.stringify(data));
                // StemService.alert(JSON.stringify(data));
            // } else {
                StemService.alert('Message sent to ' + component.recipientName + '!');
            // }
            // console.log('/api/UsersThreads sent!');
        }
        console.log('json = ' + json);
        capi(webHost, '/api/UsersThreads/sendmessage', 'POST', 'model', 'method', json, afterPrivateMessageCreate, null);
    }


})

.controller('myMessagesThreadsCtrl', function($ionicFilterBar, Usersthreads, Users, Threads, $scope, StemFactory, StemService, $state, stemcfg, $ionicLoading) {
    StemFactory.store('myMessagesThreadsCtrl', $scope);
    var component = this;
    // console.log($stateParams.id);
    // console.log($stateParams.towho);
    console.log($state.params.id);
    console.log($state.params.towho);
    component.id = $state.params.towho;

    $scope.$on('$ionicView.enter', function(){
        $ionicLoading.show({template: `Retrieving all the private messages sent to ${component.id}...`});
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
    // console.log($stateParams.towho);
    // console.log($state.params);

    $scope.$on('$ionicView.enter', function(){
        $ionicLoading.show({template: `Retrieving all the private messages sent to ${component.id}...`});
        getItems();
    });

    function populateItems(results) {
        console.log(results);
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

.controller('toMessageCtrl', function($location, $ionicFilterBar, Users, $scope, StemFactory, StemService, $state) {

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
        });
    }
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

.controller('questCtrl', function($ionicPopup, $state, $stateParams, $location, $scope,StemService,stemcfg, $resource, Quests) {
    StemService.handleInvalidSession($state, $scope, localStorage.getItem(stemcfg.userid), $ionicPopup, $stateParams.m);
    console.log('questCtrl called!');

    var component = this;
    // component.items = Quests;
    $scope.items = [];
    function getQuests() {
console.log('questCtrl 1');
      Quests
        .find()
        .$promise
        .then(function(results) {
          component.items = results;
console.log('questCtrl 3 size ' + component.items.length);
        });
    }
    $scope.$on('$ionicView.enter', function(){
console.log('questCtrl 2');
        getQuests();
    });

})

.controller('questActivityCtrl', function($location, $scope,StemService,stemcfg) {

})

.controller('loginCtrl', function($ionicPopup, $location, $scope,$state,$stateParams,StemFactory,$ionicLoading,StemService,stemcfg, $ionicHistory, capi) {
    // console.log($stateParams.m);
    // alert($stateParams.m);

    StemFactory.store('loginCtrl', $scope);

    // StemService.handleInvalidSession($state, $scope, localStorage.getItem(stemcfg.userid), $ionicPopup, $stateParams.m);
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
    }
    $scope.$on('$ionicView.enter', function(){
        purgeUsersData();
    });
    var that = this;
    var component = this;

    component.createLocalUser = function(name, userEmail, cb) {
        function createNow(data) {
            function afterCreateNow(data) {
                console.log('handleResuls():');
                console.log(data);
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
            console.log('handleExistingUser data: ');
            console.log(data);
            // debugger
            if(typeof data.email !== 'undefined' && data.email === userEmail) {
                //TODO need to upcate the localstorage user with the local user id for ionic!!!
                localStorage.setItem(stemcfg.userid, data.id);  //TODO data.id is invalid if the duplicate exsist!??????
                //NOTES: we will never reach here as the fetch throws error if the user is not found!
                //do npthing!
                console.log(userEmail + ' exists locally!');
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
        console.log('controllers.js:isAuthenticated webHost [' + webHost + ']');
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
        console.log(msg);
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
console.log('localStorage.getItem(stemcfg.username set to ' + localStorage.getItem(stemcfg.username));
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
                    console.log('/api/Users = ');
                    console.log(data);
                    console.log('owner id = ' + data[0].id);
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
                console.log("if authenticated, dfJSONResponse.obj.status should not be empty: dfJSONResponse.obj.status = ");
                console.log(StemService.handleFetchResponse(dfJSONResponse).status);
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
})


.controller('wallCtrl', function($location, $scope, $ionicPopover, $ionicPopup, $ionicModal, $ionicLoading, StemFactory,StemService,stemcfg, $state, $stateParams, capi) {
    StemService.handleInvalidSession($state, $scope, localStorage.getItem(stemcfg.userid), $ionicPopup, $stateParams.m);
    StemFactory.store('wallCtrl', $scope);
    var component = this;
    // debugger
    component.email = localStorage.getItem(stemcfg.user);
    component.postlabel = "What's Happening?";

//TODO need to query the real db!
// component.activeavatar = localStorage.getItem(stemcfg.useravatar);
component.getOwnerAvatar = function(ownerName) {
    // debugger
    if(typeof ownerName !== 'undefined') {
        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };
        var ret = 'http://tipstech.org/sites/all/themes/savita/images/unknown-avatar.png';
        if(typeof ownerName !== 'undefined') {
            if(ownerName.toLowerCase().replaceAll(' ','') === 'ShiaLaBeouf'.toLowerCase()) {
                ret = 'http://avatarfiles.alphacoders.com/451/45172.jpg';
            } else
            if(ownerName.toLowerCase().replaceAll(' ','') === 'EmmaWatson'.toLowerCase()) {
                ret = 'http://avatarfiles.alphacoders.com/296/2961.jpg';
            } else
            if(ownerName.toLowerCase().replaceAll(' ','') === 'MrT'.toLowerCase()) {
                ret = 'http://avatarfiles.alphacoders.com/422/42208.png';
            }
        }
    }

    // console.log('wall: component.getOwnerAvatar = ' + ret);
    return ret;
}

    // console.log(StemService.getCurrentTime());

    //just a test
    var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
    function putCount(data) {
        var currentTotalMessageCount = data.obj.count;
        console.log('capi: current message count is ' + currentTotalMessageCount);
    }
    capi(webHost, '/api/Messages/count', 'GET', 'model', 'method', {}, putCount, null, 'swagger');

    component.getOwnerId = function(userEmail, cb) {
        var ret = -1;
        var json = {"where": {"name": userEmail}};
        function printOwnerId(data) {
            console.log('/api/Users = ');
            console.log(data);
            console.log('owner id = ' + data[0].id);
        }
        //=== retrieve the logged in user's id
        // capi(webHost, '/api/Users?filter=' + encodeURIComponent(r), 'GET', 'model', 'method', {}, printOwnerId, null);
        capi(webHost, '/api/Users?filter=' + StemService.toExplorerFilter(json), 'GET', 'model', 'method', {}, cb, null);

        return ret;
    }

    component.handleLikeCount = function(that) {
        var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
        var targetUrl = webHost + "/api/Flags";
        var request = new Request(targetUrl, {
            headers: new Headers({
                'Accept': 'application/json'
            })
        });
        // var msg = "wallCtrl:handleLikeCount() connecting to openAPI [" + targetUrl + "] ...";
        // console.log(msg);
        fetch(request, {
            method: 'get'
        }).then(function(response) {
            response.json().then(function(data) {
              console.log(data);
            });
        }).catch(function(err) {
            // Error :(
            console.log('wallCtrl:handleLikeCount() ' + err);
        });
    }

    component.getFlagByMessageId = function(data, msgId) {
        var ret;
        // debugger
        // console.log("12b =====================> component.getFlagByMessageId: searching in data [");
        // console.log(data);
        // console.log('] by msgId [' + msgId + ']');
        for(var i=0; i<data.length; i++) {
            if(data[i].messages == msgId) {
                ret = data[i];
                // console.log("component.getFlagByMessageId() found: ret.messages [" + ret.messages + ']');
                break;
            }
        }
        // console.log("component.getFlagByMessageId(): ret [" + ret + ']');
        return ret;
    }

    component.getOwner = function(text) {
        var ret;
        if(text.indexOf('by') > -1) {
            var s1 = text.indexOf('by');
            ret = text.substring(s1, text.length);
        }
        // console.log("component.getOwner() ret [" + ret + ']');
        return ret;
    }

    component.getFlagByMessageIdAndOwner = function(data, msgId, ownerId) {
        var ret;
        // debugger
        console.log("13 =====================> component.getFlagByMessageId: searching in data [");
        console.log(data);
        console.log(']  by msgId [' + msgId + '] ownerId [' + ownerId + ']');
        var f1, f2;
        for(var i=0; i<data.length; i++) {  //TODO why is data.length is null here????
            if(data[i].messages == msgId) f1 = true;
            if(data[i].subject.indexOf(ownerId) > -1) f2 = true;  //TODO this has to be owner's id!
            // debugger
            if(f1 && f2) {
                ret = data[i];
                // console.log("component.getFlagByMessageIdAndOwner() found: ret.messages [" + ret.messages + ']');
                break;
            }
            f1 = f2 = false;
        }
        // console.log("component.getFlagByMessageIdAndOwner(): ret [" + ret + ']');
        return ret;
    }

    component.saveLike = function(that, itemIndex) {

        var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
        var targetUrl = webHost + "/explorer/swagger.json";
        // var msg = "wallCtrl:saveLike() connecting to openAPI [" + targetUrl + "] ...";
        // console.log(msg);

        function saveIt(data) {
            // console.log('saveIt(): data = ');
            // console.log(data);
            // console.log('saveIt(): owner id = ' + data[0].id);
            //swagger find existing flag based on a message/user begin
            //TODO the owner type need to be updated!
            var messageId = that.item.id;
            var ownerId;
            try {
                ownerId = localStorage.getItem(stemcfg.userid); //data[0].id;
            } catch(e) {
                console.log(data);
                throw e;
            }
            var json3 = {
                data: {
                    "subject": "Like by " + StemService.getUserName(stemcfg),
                    "description": "favourite of a message",
                    "messages": messageId,
                    "owner": ownerId
                }
            };
            // console.log('saveIt(): json3.data = ');
            // console.log(json3.data);
            // debugger
            var oldFlag;
            function updateUserFlags(data) {
                data.obj = data;  //support fetch
                // document.getElementById("mydata").innerHTML = JSON.stringify(data.obj);
                var ownerName = StemService.getUserName(stemcfg);
                oldFlag = component.getFlagByMessageIdAndOwner(data.obj, that.item.id, ownerName);  //TODO for now, only the first one!
                if(typeof oldFlag !== 'undefined' && typeof oldFlag.id !== 'undefined') {
                    if(json3.data.messages == oldFlag.messages) {
                        json3.data = oldFlag;
                    }
                    else {
                        json3.data.id = 0;
                        //=== musy be a new flag!
                    }
                } else {
                    json3.data.id = 0;
                    //=== musy be a new flag!
                }
                json3.data.state = !json3.data.state;
json3 = json3.data;  //support fetch

                function updateLikeUI(data) {
                    var scope = StemFactory.get('wallCtrl');
                    var oldFlag;
                    function updateMessageLikeCount(data) {
                        // console.log("capi: 12c =====================> after Messages.Messages_find: data.obj.messages");
                        // document.getElementById("mydata").innerHTML = JSON.stringify(data.obj);
                        // console.log(data.obj);
                        var json4 = { data: '' };
// var currentFlag = json3.data.state;
var currentFlag = json3.state;  //support http fetch

// var oldMessage = data.obj;
var oldMessage = data;  //support http fetch
                        oldMessage.liked = currentFlag?"true":"false";
                        json4.data = oldMessage;
                        if(currentFlag) {
                            json4.data.likecount = json4.data.likecount + 1;
                        } else {
                            json4.data.likecount = json4.data.likecount - 1;
                        }
json4 = json4.data;  //support fetch
                        // msg = "wallCtrl:saveLike() Messages_findById state";
                        // console.log(msg);
                        // console.log(json4.data.state);
                        function updateItem(data) {
                            // msg = "capi: wallCtrl:saveLike() after Messages_upsert";
                            // console.log(msg);
                            // console.log(data);
                            var scope = StemFactory.get('wallCtrl');
                            scope.$apply(function () {
// debugger
                                //copy all values into data and update only the like count
                                var temp = data.likecount;
                                data = component.items[itemIndex];
                                data.likecount = temp;
                                if(currentFlag) {
                                    data.loggedinuserliked = 1;
                                } else {
                                    data.loggedinuserliked = 0;
                                }
                                // component.items.splice(itemIndex, 1, data.obj);
                                component.items.splice(itemIndex, 1, data);  //support fetch
                            });
                        }
                        capi(webHost, '/api/Messages', 'PUT', 'model', 'method', json4, updateItem, null);
                    }
                    capi(webHost, `/api/Messages/${messageId}`, 'GET', 'model', 'method', {"id": messageId}, updateMessageLikeCount, null);
                }
                capi(webHost, '/api/Flags', 'PUT', 'model', 'method', json3, updateLikeUI, null);
            } //updateFlags end
            // capi(webHost, '/api/Flags', 'GET', 'model', 'method', json3, updateUserFlags, null, 'swagger');
            capi(webHost, '/api/Flags', 'GET', 'model', 'method', json3, updateUserFlags, null);
        } //saveIt end

        component.getOwnerId(localStorage.getItem(stemcfg.user), saveIt);
    } //component.saveLike end

    // component.processingMessage = "Retrieving the messages ...";
    $ionicLoading.show({template: 'Retrieving the messages ...'});
    var currentStart = 0;
    var loadItemsLimit = 20;
    component.items = [];


    $scope.showPopup = function() {
      $scope.data = {}

    var myPopup = $ionicPopup.show({
      template: '<textarea></textarea>',
      title: 'Post Comment',
      subTitle: 'Please use normal things',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Reply</b>',
          type: 'button-energized',
          onTap: function(e) {
            if (!$scope.data.wifi) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data.wifi;
            }
          }
        }
      ]
    });

}


    // .fromTemplate() method
    var template = `
    <ion-popover-view>
    <ion-header-bar>
        <h1 class="title">My Popover Title</h1>
    </ion-header-bar>
    <ion-content>
        Hello!
    </ion-content>
    </ion-popover-view>`;

// === Topic Modal

//   $ionicModal.fromTemplateUrl('templates/newTopic.html', {
//   scope: $scope,
//   animation: 'slide-in-up'
// }).then(function(modal) {
//   $scope.modal = modal;
// });
// $scope.openModal = function() {
//   $scope.modal.show();
// };
// $scope.closeModal = function() {
// //   debugger
//   $scope.modal.hide();
// };
// Cleanup the modal when we're done with it!
// $scope.$on('$destroy', function() {
//   $scope.modal.remove();
// });
// // Execute action on hide modal
// $scope.$on('modal.hidden', function() {
//   // Execute action
// });
// // Execute action on remove modal
// $scope.$on('modal.removed', function() {
//   // Execute action
// });



    //=== popover textarea field
    // component.item1 = '';
    // console.log('wallCtrl: component.item1 reset to [' + component.item1 + '] component.item1:');
    // console.log(component.item1);
    $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
    });

    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('templates/wallModalComment.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPostSettings = function($event) {
      //  $scope.messageowner = localStorage.getItem(stemcfg.user);
        // $scope.messagetype = stemcfg.messagetype1 + id;  //TODO need to concatenate owner + timestamp
        // console.log('message type set to [' + $scope.messagetype + ']');
        $scope.openPopover($event);
    }

    $scope.openPostComment = function($event) {
        $scope.messageowner = localStorage.getItem(stemcfg.user);
        // $scope.messagetype = stemcfg.messagetype1 + id;  //TODO need to concatenate owner + timestamp
        // console.log('message type set to [' + $scope.messagetype + ']');
        $scope.openPopover($event);
        // debugger
    }

    $ionicModal.fromTemplateUrl('templates/wallModalPost.html', function(modal) {
            $scope.modal = modal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
    });
    $scope.openModal = function(item) {
        component.item1 = ''; //clear the textarea
        // debugger
        if(typeof item !== 'undefined') {
            component.postlabel = stemcfg.replytopiclabel;
            $scope.messageowner = item.owner;
            $scope.messagetype = stemcfg.messagetype1 + component.getTopicId(item);  //TODO need to get the type of the (thread) topic over here
            console.log('REPLY: message type set to [' + $scope.messagetype + '] $scope.messageowner [' + $scope.messageowner + ']');
        } else {
            component.postlabel = stemcfg.newtopiclabel;
            $scope.messageowner = localStorage.getItem(stemcfg.userid);
            $scope.messagetype = undefined;   //has to be undefined to be treated as a POST!!!
            console.log('POST: message type set to [' + $scope.messagetype + '] $scope.messageowner [' + $scope.messageowner + ']');
        }
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        // debugger
        $scope.modal.hide();
    };

    $scope.openReplyTo = function($event, item) {
        $scope.messageowner = item.owner;
        $scope.messagetype = stemcfg.messagetype1 + component.getTopicId(item);  //TODO need to get the type of the (thread) topic over here
        console.log('message type set to [' + $scope.messagetype + ']');
        $scope.openPopover($event, $scope.messagetype);
    }

    $scope.openPopover = function($event, id) {
        $scope.popover.show($event);
            console.log('controller.js $scope.openPopover id = ' + id);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
        // component.popover.hide();  //Warning: do not need to call this again! It will throw "app.js angular exception: Maximum call stack size exceeded (caused by undefined) after hiding the popover"!!!
        // Do only any cleanup if needed in here
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
        // Execute action
    });

    component.getTopicId = function(item) {
        var ret = item.threadid;

        return ret;
    };

    component.getStyle = function(item) {
        var ret = {height: '300px'};

        if(component.isTopicOwner(item)) {
            ret = {height: '300px'};
        }

        // console.log('controllers.js:component.getItemCSSClass [' + ret + '] item.type [' + item.type + "]");
    //   return ret;  //Notes: @mayowa uncomment this to see the gap
    };

    component.isTopicOwner = function(item) {
        var ret = false;
        if(typeof item !== 'undefined' && item.type.indexOf('topic') > -1 && item.type.indexOf('owner') > -1) {
            ret = true;
        }

        // console.log('controllers.js:component.isTopicOwner [' + ret + '] item.type [' + item.type + "]");
        return ret;
    };

    //***Notes: This function is not for "pull to refresh" as it does not reload the items, it just add a new item to it!
    //*** It is designed for "infinite scrolling"!
    component.loadMoreItems = function() {
        $scope.hasMoreData = false;
        var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
        // console.log('controllers.js:loadMoreItems webHost [' + webHost + ']');
        // var webHost = stemcfg.webhost;
        // webHost = 'http://50.28.56.122:3000'; //TODO - just for test - comment this out in production!!!
        // webHost = 'http://localhost:3000'; //TODO - just for test - comment this out in production!!!
        // webHost = 'http://localhost:3064'; //TODO - just for test - comment this out in production!!!

        var targetUrl = webHost + "/explorer/swagger.json";
        var msg = "wallCtrl:loadMoreItems() connecting to openAPI [" + targetUrl + "] ...";
        // document.getElementById("mydata").innerHTML = msg;
        // console.log(msg);

        function wallLoaded(data) {
            //   console.log(data);
            //   document.getElementById("mydata").innerHTML = JSON.stringify(data.obj.wall);
            data.obj = data.obj && data.obj.wall || data.wall; //support fetch
            var scope = StemFactory.get('wallCtrl');
            // debugger
            if (typeof scope !== 'undefined') {
            scope.$apply(function () {
              component.addItems = function () {
                if (currentStart < loadItemsLimit && currentStart < data.obj.length) {
                  for (var i = currentStart; i < loadItemsLimit; i++) {

                    var w = 100 + Math.floor(Math.random() * 200);
                    w -= w % 5;

                    var h = 100 + Math.floor(Math.random() * 200);
                    h -= h % 5;


                    if (i < data.obj.length) {
                        component.items.push(

                          // {height: h},

                          data.obj[i]);
                        currentStart += 1;
                      // console.log('wallCtrl pushed item ' + i);
                    }
                  }
                }

                // $scope.$broadcast('scroll.infiniteScrollComplete');   //NB: this is required!!!
                // console.log('wallCtrl scroll.infiniteScrollComplete: list size [' + component.items.length + '] currentStart [' + currentStart + ']');
              }

              component.addItems();
              // component.items = data.obj;
              //console.log('wallCtrl Messages_ size ' + component.items.length);
              // gitems = component.items;
              // component.processingMessage = "";   //done!
              $ionicLoading.hide();
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasMoreData = true;
            });
            }
        }
        //=== retrieve all wall messages
        var loggedinuser = localStorage.getItem(stemcfg.userid);
        // capi(webHost, '/api/Threads/wall', 'GET', 'model', 'method', {}, wallLoaded, null, 'swagger');
        capi(webHost, `/api/Threads/wall?loggedinuser=${loggedinuser}`, 'GET', 'model', 'method', {}, wallLoaded, null);
    } //end of component.loadMoreItems

    component.loadMoreItems();

    //=== TODO currently not used
    component.postMessage = function() {
        component.createMessage();
    };

    component.replyMessage = function(item) {
        component.createMessage(item);
    };
    //=== TODO currently not used


    // component.testload = function() {
    //     $scope.messagetype = undefined;
    //     currentStart = 0;
    //     loadItemsLimit = 1;
    //     component.items1 = [];
    //     // for (var i = 0; i < 1; i++) {
    //     var i = 0;
    //         component.items1.push(component.items[i]);
    //     // }
    //     console.log(component.items1);
    //     component.items = [];
    //     component.items = component.items1;
    //     // component.loadMoreItems();
    //     $scope.$broadcast('scroll.refreshComplete');
    // };

    component.reload = function() {
        $scope.messagetype = undefined;
        currentStart = 0;
        loadItemsLimit = 20;
        component.items = [];
        component.loadMoreItems();
        $scope.$broadcast('scroll.refreshComplete');
    };

    component.createMessage = function(item) {
        var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
        // webHost = 'http://50.28.56.122:3000'; //TODO - just for test - comment this out in production!!!
        // webHost = 'http://localhost:3000'; //TODO - just for test - comment this out in production!!!
        // webHost = 'http://localhost:3064'; //TODO - just for test - comment this out in production!!!
        var targetUrl = webHost + "/explorer/swagger.json";
        // var values = component;
        console.log('wallCtrl controller createMessage() item [' + JSON.stringify(item) + ']');
// console.log('1.1 <----------------------------------------------');

        //swagge2 begin
        // console.log('controllers.js createMessage(): message type is [' + $scope.messagetype + ']');
        //TODO 2-23 owner has to be mapped to the user's name
        //TODO create date has to be the current date!
        var json2 = {
            data: {
              "id": 0,
              "subject": "Message by " + StemService.getUserName(stemcfg),
              "text": item,
              "liked": "false",
              "state": "Public",
              "type": $scope.messagetype||"NA",
              "owner": localStorage.getItem(stemcfg.userid),
              "likecount": 0
            }
        };

        function afterMessageCreate(data) {
// console.log('1.2 <---------------------------------------------- data:');
// console.log(data);
// console.log('1.3 <---------------------------------------------- item:');
// console.log(item);
            if(data.obj.text == item) {  //TODO need a proper status code to indicate it's a success!!!?
                var oldMessage = data.obj;
// console.log('1.4 <---------------------------------------------- data.obj.id:');
// console.log(data.obj.id);
                var msgId = data.obj.id;
                var json1 = {
                    data: {
                      "id": 0,
                      "messages": data.obj.id
                    }
                };
                function afterThreadCreate(data) {
// console.log("2.1 =====================> after Messages.Messages_create: data.obj.messages");
// console.log('2.2 <---------------------------------------------- data:');
// console.log(data);
// console.log('2.3 <---------------------------------------------- msgId:');
// console.log(msgId);
                    if(data.obj.messages == msgId) {  //TODO need a proper status code to indicate it's a success!!!?
                        var newType;
                        var threadId = data.obj.id;
                        if(typeof $scope.messagetype === 'undefined') {
                            newType = 'topic' + threadId + '-owner';
                            oldMessage.type = newType;
                        } else {
                            newType = $scope.messagetype;
                            oldMessage.type = newType;
                        }

                        // console.log("2 =====================> before Messages.Messages_upsert: oldMessage");
                        // console.log(oldMessage);
// json2.data = oldMessage;
json2 = oldMessage;
                        function updateChangedMessage(data) {
                            // document.getElementById("mydata").innerHTML = JSON.stringify(data.obj);
// console.log("3.1 =====================> after Messages.Messages_upsert: data.obj.text");
// console.log(data.obj.text);
// console.log('3.2 <---------------------------------------------- item:');
// console.log(item);
// debugger
                            // if(data.obj.text == item) {  //TODO need a proper status code to indicate it's a success!!!?
                            if(data.text == item) {  //TODO need a proper status code to indicate it's a success!!!?
                            // console.log("4 =====================> after Threads.Threads_create: Thread");
                            // console.log(data.obj);
                            // return
                            // console.log('controllers.js: closing popover ...');
                            // component.item1 = '';
                            // console.log('wallCtrl: 2 component.item1 reset to [' + component.item1 + '] component.item1:');
                            // console.log(component.item1);
                            //$scope.$broadcast('popover.hidden');
                            // $scope.closePopover();
                            $scope.closeModal();
                            // console.log('popover should be closed!');
                            component.reload();  //TODO do we really need to reload????
                            // component.loadMoreItems();  //TODO buggy
                            } //end of data.obj.text == item
                        }
                        capi(webHost, '/api/Messages', 'PUT', 'model', 'method', json2, updateChangedMessage, null);
                    } //end of data.obj.messages == msgId
                } //afterThreadCreate end
                capi(webHost, '/api/Threads', 'POST', 'model', 'method', json1, afterThreadCreate, null, 'swagger');
            } //data.obj.text == item end
        } //afterMessageCreate end
        capi(webHost, '/api/Messages', 'POST', 'model', 'method', json2, afterMessageCreate, null, 'swagger');
    } //component.createMessage end

    //Notes: @mayowa
    component.getStyleByFlagState = function(item, index) {
        var ret;
        // console.log('controller.js likeStyleByFlagState: item (Message)');
        // console.log(item);
        // debugger
        // if(item.likecount > 0) {
        if(item.loggedinuserliked == 1) {
            console.log('item.loggedinuserliked = ' + item.loggedinuserliked);
            ret = 'button button-icon icon ion-ios-heart energized icon-left';
            // console.log('controllers.js component.likeStyleByFlagState state 1');
        } else {
            ret = 'button button-icon icon energized ion-ios-heart-outline icon-left';
            // console.log('controllers.js component.likeStyleByFlagState state 0');
        }
        return ret;
    };


    component.messageStyleByMessageType = function(item) {
        var ret;
        // debugger
        // console.log(item);
        if(typeof item !== 'undefined' && typeof item.type !== 'undefined' && item.type.indexOf('owner') > -1) {
            ret = 'wall-new-message';
            // console.log('controllers.js component.messageStyleByMessageType type topic');
        } else {
            ret = 'wall-replied-message';
            // console.log('controllers.js component.messageStyleByMessageType type comment');
        }
        return ret;
    };

    component.buttonStyleByMessageType = function(item) {
        var ret;
        // debugger
        // console.log(item);
        if(item.type === 'comment') {
            ret = 'wall-reply-to-button';
            // console.log('controllers.js component.buttonStyleByMessageType type comment');
        } else {
            ret = '';
            // console.log('controllers.js component.buttonStyleByMessageType type topic');
        }
        return ret;
    };

})
