'use strict';

/**
Useful Explorer filter:

GET /Audits
{"where": {"owner": "user1@gmail.com"}}
*/
angular.module('controller.walls', [])

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
        var currentTotalMessageCount = StemService.handleFetchResponse(data).count;
        // console.log('capi: current message count is ' + currentTotalMessageCount);
    }
    capi(webHost, '/api/Messages/count', 'GET', 'model', 'method', {}, putCount, null);

    component.getOwnerId = function(userEmail, cb) {
        var ret = -1;
        var json = {"where": {"name": userEmail}};
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
            //   console.log(data);
            });
        }).catch(function(err) {
            // Error :(
            // console.log('wallCtrl:handleLikeCount() ' + err);
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
        // console.log("13 =====================> component.getFlagByMessageId: searching in data [");
        // console.log(data);
        // console.log(']  by msgId [' + msgId + '] ownerId [' + ownerId + ']');
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

    //=== TODO it is buggy!!! esp on loggedinuserliked
    function updateItem(data) {
        var scope = StemFactory.get('wallCtrl');
        scope.$apply(function () {
            //=== get the current item based on the items
            var newItem = data.status?data.status:data; //=== store the final saved item
            var oldItem = component.items[component.itemIndex];
//=== copy all values into data and update only the like count
oldItem.likecount = newItem.likecount;
// debugger
var currentFlag = component.itemState === 1?0:1;  //oldItem.state;  //TODO get from flag's state not this!!!
oldItem.liked = currentFlag?"true":"false";
if(currentFlag) {
    oldItem.loggedinuserliked = 1;
} else {
    oldItem.loggedinuserliked = 0;
}
            // component.items.splice(component.itemIndex, 1, data.obj);
// console.log('walls.js updateItem: newItem [');
// console.log(newItem);
// console.log('] oldItem [');
// console.log(oldItem);
// console.log(']');
            component.items.splice(component.itemIndex, 1, oldItem);
            $ionicLoading.hide();
        });
    }

    //=== TODO it is buggy!!! esp on loggedinuserliked
    component.saveLike_ = function(that, itemIndex) {
        $ionicLoading.show({template: `Saving like ...`});

        var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);

        component.itemIndex = itemIndex;
        component.itemState = component.items[component.itemIndex].liked === "true"?1:0;

        var messageId = that.item.id;
        var ownerId;
        try {
            ownerId = that.item.owner;  //localStorage.getItem(stemcfg.userid); //data[0].id;
        } catch(e) {
            console.log(data);
            throw e;
        }
        var ownerName = that.item.ownerName;  //StemService.getUserName(stemcfg);
        var json = { messageId: messageId, ownerId: ownerId, ownerName: ownerName };

        capi(webHost, '/api/Threads/saveLike', 'POST', 'model', 'method', json, updateItem, null);
    }

    //=== Notes: it is not used anymore as it is super slow! Keep this just for reference
    component.saveLike = function(that, itemIndex) {
        $ionicLoading.show({template: `Saving like ...`});

        var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
        var targetUrl = webHost + "/explorer/swagger.json";
        // var msg = "wallCtrl:saveLike() connecting to openAPI [" + targetUrl + "] ...";
        // console.log(msg);
        component.itemIndex = itemIndex;
        component.itemState = component.items[component.itemIndex].liked === "true"?1:0;

        function saveIt(data) {
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
                        // updateItem(data);
                        function updateItem(data) {
                            var scope = StemFactory.get('wallCtrl');
                            scope.$apply(function () {
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
                                $ionicLoading.hide();
                            });
                        }

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
            // console.log('REPLY: message type set to [' + $scope.messagetype + '] $scope.messageowner [' + $scope.messageowner + ']');
        } else {
            component.postlabel = stemcfg.newtopiclabel;
            $scope.messageowner = localStorage.getItem(stemcfg.userid);
            $scope.messagetype = undefined;   //has to be undefined to be treated as a POST!!!
            // console.log('POST: message type set to [' + $scope.messagetype + '] $scope.messageowner [' + $scope.messageowner + ']');
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
        // console.log('message type set to [' + $scope.messagetype + ']');
        $scope.openPopover($event, $scope.messagetype);
    }

    $scope.openPopover = function($event, id) {
        $scope.popover.show($event);
            // console.log('controller.js $scope.openPopover id = ' + id);
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
        $ionicLoading.show({template: `Posting ...`});
        var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
        // webHost = 'http://50.28.56.122:3000'; //TODO - just for test - comment this out in production!!!
        // webHost = 'http://localhost:3000'; //TODO - just for test - comment this out in production!!!
        // webHost = 'http://localhost:3064'; //TODO - just for test - comment this out in production!!!
        var targetUrl = webHost + "/explorer/swagger.json";
        // var values = component;
        // console.log('wallCtrl controller createMessage() item [' + JSON.stringify(item) + ']');
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
                            $ionicLoading.hide();

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
            // console.log('item.loggedinuserliked = ' + item.loggedinuserliked);
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

});