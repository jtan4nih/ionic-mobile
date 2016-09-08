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

.controller('loginCtrl', function($ionicPopup, $location, $scope,$state,$stateParams,StemFactory,$ionicLoading,StemService,stemcfg, capi) {
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
        localStorage.removeItem(stemcfg.dfuser);
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
                             "transplantdate": StemService.getCurrentTime(),
                             "startdate": StemService.getCurrentTime(),
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
            if(data.email === userEmail) {
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
            // console.log('json.user = ');
            // console.log(JSON.parse(user_str));
            // debugger
            //=== save local user id (Accounts Synchronization)
            localStorage.setItem(stemcfg.dfuser, user_str);
            localStorage.setItem(stemcfg.username, json.user.name);
        
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
                localStorage.setItem(stemcfg.username, json.user.name);
                localStorage.setItem(stemcfg.user, u);
            }
        
            component.afterCreateLocalUser = function(data) {
                console.log("if authenticated, dfJSONResponse.obj.status should not be empty: dfJSONResponse.obj.status = ");
                console.log(StemService.handleFetchResponse(dfJSONResponse).status);
                // debugger
                if (StemService.handleFetchResponse(dfJSONResponse).status !== '') {
    
                    if (jsonStr !== '') {

                        $ionicLoading.hide();
                        $state.go('menu.wall', {
                            id: u
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


.controller('wallCtrl', function($location, $scope, $ionicPopover, $ionicLoading, StemFactory,StemService,stemcfg, $state, $stateParams, $ionicPopup, capi) {
    StemFactory.store('wallCtrl', $scope);
    StemService.handleInvalidSession($state, $scope, localStorage.getItem(stemcfg.userid), $ionicPopup, $stateParams.m);
    var component = this;
    
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
                
                function updateLikeUI(data) {
                    var scope = StemFactory.get('wallCtrl');
                    var oldFlag;
                    function updateMessageLikeCount(data) {
                        // console.log("capi: 12c =====================> after Messages.Messages_find: data.obj.messages");
                        // document.getElementById("mydata").innerHTML = JSON.stringify(data.obj);
                        // console.log(data.obj);
                        var json4 = { data: '' };
                        var currentFlag = json3.data.state;
                        var oldMessage = data.obj;
                        oldMessage.liked = currentFlag?"true":"false";
                        json4.data = oldMessage;
                        if(currentFlag) {
                            json4.data.likecount = json4.data.likecount + 1;
                        } else {
                            json4.data.likecount = json4.data.likecount - 1;
                        }
                        // msg = "wallCtrl:saveLike() Messages_findById state";
                        // console.log(msg);
                        // console.log(json4.data.state);
                        function updateItem(data) {
                            // msg = "capi: wallCtrl:saveLike() after Messages_upsert";
                            // console.log(msg);
                            // console.log(data);
                            var scope = StemFactory.get('wallCtrl');
                            scope.$apply(function () {
                                component.items.splice(itemIndex, 1, data.obj);
                            });
                        }
                        capi(webHost, '/api/Messages', 'PUT', 'model', 'method', json4, updateItem, null, 'swagger');
                    }
                    capi(webHost, '/api/Messages/id', 'GET', 'model', 'method', {"id": messageId}, updateMessageLikeCount, null, 'swagger');
                }
                capi(webHost, '/api/Flags', 'PUT', 'model', 'method', json3, updateLikeUI, null, 'swagger');
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
    
    //=== popover textarea field
    component.item1 = '';
    $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
    });
    
    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('templates/newComment.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    
    $scope.openPostComment = function($event) {
        $scope.messageowner = localStorage.getItem(stemcfg.user);
        // $scope.messagetype = stemcfg.messagetype1 + id;  //TODO need to concatenate owner + timestamp
        // console.log('message type set to [' + $scope.messagetype + ']');
        $scope.openPopover($event);
    }
    
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
    
    component.isTopicOwner = function(item) {
        var ret = false;
        if(item.type.indexOf('topic') > -1 && item.type.indexOf('owner') > -1) {
            ret = true;
        }
        
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
                    if (i < data.obj.length) {
                    //   debugger
                      component.items.push(data.obj[i]);
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
        // capi(webHost, '/api/Threads/wall', 'GET', 'model', 'method', {}, wallLoaded, null, 'swagger');
        capi(webHost, '/api/Threads/wall', 'GET', 'model', 'method', {}, wallLoaded, null);
    } //end of component.loadMoreItems

    component.loadMoreItems();

    //=== TODO currently not used
    component.postMessage = function() {
        component.createMessage();
    };

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

        //swagge2 begin   
        console.log('controllers.js createMessage(): message type is [' + $scope.messagetype + ']');
        //TODO 2-23 owner has to be mapped to the user's name
        //TODO create date has to be the current date!
        var json2 = {
            data: {
              "id": 0,
              "subject": "Message by " + StemService.getUserName(stemcfg),
              "text": item,
              "createdat": StemService.getCurrentTime(),
              "updatedat": StemService.getCurrentTime(),
              "liked": "false",
              "state": "Public",
              "type": $scope.messagetype||"NA",
              "owner": localStorage.getItem(stemcfg.userid),
              "likecount": 0
            }
        };

        function afterMessageCreate(data) {
            if(data.obj.text == item) {  //TODO need a proper status code to indicate it's a success!!!?
                var oldMessage = data.obj;
                var msgId = data.obj.id;
                var json1 = {
                    data: {
                      "id": 0,
                      "messages": data.obj.id
                    }
                };
                function afterThreadCreate(data) {
                    // console.log("2 =====================> after Messages.Messages_create: data.obj.messages");
                    // console.log(data.obj.messages);
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
                        json2.data = oldMessage;
                        function updateChangedMessage(data) {
                            // document.getElementById("mydata").innerHTML = JSON.stringify(data.obj);
                            // console.log("3 =====================> after Messages.Messages_upsert: data.obj.messages");
                            // console.log(data.obj);
                            if(data.obj.text == item) {  //TODO need a proper status code to indicate it's a success!!!?
                            // console.log("4 =====================> after Threads.Threads_create: Thread");
                            // console.log(data.obj);
                            // return
                            // console.log('controllers.js: closing popover ...');
                            component.item1 = '';
                            //$scope.$broadcast('popover.hidden');
                            $scope.closePopover();
                            // console.log('popover should be closed!');
                            component.reload();  //TODO do we really need to reload????
                            // component.loadMoreItems();  //TODO buggy
                            } //end of data.obj.text == item
                        }
                        capi(webHost, '/api/Messages', 'PUT', 'model', 'method', json2, updateChangedMessage, null, 'swagger');
                    } //end of data.obj.messages == msgId
                } //afterThreadCreate end
                capi(webHost, '/api/Threads', 'POST', 'model', 'method', json1, afterThreadCreate, null, 'swagger');
            } //data.obj.text == item end
        } //afterMessageCreate end
        capi(webHost, '/api/Messages', 'POST', 'model', 'method', json2, afterMessageCreate, null, 'swagger');
    } //component.createMessage end

    component.likeStyleByFlagState = function(item) {
        var ret;
        // console.log('controller.js likeStyleByFlagState: item (Message)');
        // console.log(item);
        if(item.likecount == 0) {
        // if(item.state === "false") {
            ret = 'button button-icon icon ion-android-favorite-outline icon-right';
            // console.log('controllers.js component.likeStyleByFlagState state 0');
        } else {
            ret = 'button button-icon icon ion-heart icon-right';
            // console.log('controllers.js component.likeStyleByFlagState state 1');
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