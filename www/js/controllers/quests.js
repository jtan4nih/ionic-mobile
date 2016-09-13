'use strict';

/**
Useful Explorer filter:

GET /Usersquests
{"where": {"usersid": 0, "questsid": 0}}
*/
angular.module('controller.quests', [])

.controller('questActivityCtrl', function($location, $scope,StemService,stemcfg) {

})

.controller('questExitCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('questHowCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('questDetailsCtrl', function($location, $scope,StemService,stemcfg, $state, $ionicPopup, $stateParams, Usersquests, $ionicLoading, capi) {
    StemService.handleInvalidSession($state, $scope, StemService.getUserId(stemcfg), $ionicPopup, $stateParams.m);
    // console.log('questDetailsCtrl called!');
    var component = this;

    $scope.$on('$ionicView.enter', function(){
        component.id = $stateParams.id;
        component.title = $stateParams.title;
        component.description = $stateParams.description;
        component.how = $stateParams.how;
        // console.log('questDetailsCtrl item = ' + JSON.stringify(component));
        
        getUsersQuestsPowerUps(StemService.getUserId(stemcfg));
    });

component.exit = function(id) {
    $ionicLoading.show({template: 'Exiting quests ...'});
    // console.log('exit quests id ' + id);
    removeIfUsersQuestsExists(id);
}

function removeIfUsersQuestsExists(id) {
    // debugger
    var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
    var userid = StemService.getUserId(stemcfg);
    // console.log('removeIfUsersQuestsExists id = ' + id + ' userid = ' + userid);
    function afterIsUsersQuestsExists(data) {
        // debugger
        // console.log(data);
        if(data.length > 0) {
            exitUsersQuests(data[0].id);
            // console.log('afterIsUsersQuestsExists exit!');
            StemService.alert('Exit quests!');
        } else {
            StemService.alert('You never join this quests. Nothing is done.');
            // console.log('afterIsUsersQuestsExists has already exit this Quests!');
        }
        $ionicLoading.hide();
    }
    // var json1 = { 
    //         where: {
    //             usersid: userid,
    //             questsid: id
    //         }
    // };
    // capi(webHost, `/api/Usersquests`, 'GET', 'model', 'method', json1, afterIsUsersQuestsExists, null);
    Usersquests
    .find({ filter: { where: { usersid: userid, questsid: id } } })
    .$promise
    .then(function(results) {
        component.items = results;
        // debugger;
        // console.log('questDetailsCtrl 1 size ' + component.items.length);
        console.log(component.items);
        afterIsUsersQuestsExists(component.items);
    });
}

    component.join = function (id) {
        // console.log('join quests id ' + id);
        addIfNoUsersQuestsExists(id);
    }
    
    function addIfNoUsersQuestsExists(id) {
        // debugger
        var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
        var userid = StemService.getUserId(stemcfg);
        // console.log('addIfNoUsersQuestsExists id = ' + id + ' userid = ' + userid);
        function afterIsUsersQuestsExists(data) {
            // debugger
            // console.log(data);
            if(data.length == 0) {
                jointUsersQuests(id);
                // console.log('afterIsUsersQuestsExists joined!');
            } else {
                StemService.alert('You have already joined this quests.');
                // console.log('afterIsUsersQuestsExists has already joined this Quests!');
            }
        }
        // var json1 = { 
        //         where: {
        //             usersid: userid,
        //             questsid: id
        //         }
        // };
        // capi(webHost, `/api/Usersquests`, 'GET', 'model', 'method', json1, afterIsUsersQuestsExists, null);
        Usersquests
        .find({ filter: { where: { usersid: userid, questsid: id } } })
        .$promise
        .then(function(results) {
            component.items = results;
            // console.log('questDetailsCtrl 1 size ' + component.items.length);
            // console.log(component.items);
            afterIsUsersQuestsExists(component.items);
        });
    }

    function jointUsersQuests(id) {
        var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
        var userid = StemService.getUserId(stemcfg);
        // console.log('jointUsersQuests typeof id = ' + typeof id);
        $ionicLoading.show({template: 'Joining quests ...'});
        function afterJoinUsersQuests(data) {
            // debugger
            if(data.questsid == id) {
                StemService.alert('Joined! Congratulation!');
                // console.log('jointUsersQuests success!');
            }
            // else {
            //     StemService.alert('You have already joined this quests.');
            //     // console.log('jointUsersQuests failed!');
            // }
            // console.log(data);
            // var scope = StemFactory.get('questsPowerUpsCtrl');
            // scope.$apply(function () {
                // console.log(data);
            // });
        
            // component.items = data;
            $ionicLoading.hide();
        }
        var json = {
                     id: 0,
                     usersid: userid,
                     questsid: id
                   };
        capi(webHost, `/api/Usersquests`, 'POST', 'model', 'method', json, afterJoinUsersQuests, null);
    }

    function exitUsersQuests(id) {
        var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
        var userid = StemService.getUserId(stemcfg);
        // console.log('exitUsersQuests typeof id = ' + typeof id);
        function afterExitUsersQuests(data) {
            // var scope = StemFactory.get('questsPowerUpsCtrl');
            // scope.$apply(function () {
                // console.log(StemService.handleFetchResponse(data));
            // });
        
            // component.items = data.obj;
        }
        // var json = { 
        //     "where": {
        //         "usersid": userid,
        //         "questsid": id
        //     }
        // };
        capi(webHost, `/api/Usersquests/${id}`, 'DELETE', 'model', 'method', null, afterExitUsersQuests, null);
    }

    function getUsersQuestsPowerUps(id) {
        // debugger
        var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
        var userid = StemService.getUserId(stemcfg);
        // console.log('getUsersQuestsPowerUps typeof id = ' + id);
        function afterUsersQuestsPowerups(data) {
            // var scope = StemFactory.get('questsPowerUpsCtrl');
            // scope.$apply(function () {
                console.log(data);
            // });
    
            // component.items = data.obj;
            // console.log('questsPowerUpsCtrl 1 size ' + component.items.length);
            // console.log(component.items);
        }
        var json = { 
            "where": {
                "usersid": userid
            }
        };
        capi(webHost, `/api/Usersquests`, 'GET', 'model', 'method', json, afterUsersQuestsPowerups, null);
    }

    // component.selectQuest = function(item) {
    //     console.log('questDetailsCtrl: selected ' + JSON.stringify(item));
    //     $state.go('menu.questJoin', {
    //       id: item.id
    //     });
    // }

})

.controller('questsPowerUpsCtrl', function($location, $scope, $ionicPopover, $ionicLoading, StemFactory,StemService,stemcfg, $state, $stateParams, $ionicPopup, Questspowerups, capi) {
    StemService.handleInvalidSession($state, $scope, StemService.getUserId(stemcfg), $ionicPopup, $stateParams.m);
    // console.log('questCtrl called!');
    
    var component = this;

    function getQuestsPowerUps(questsid) {
        // debugger
        // console.log('getQuestsPowerUps typeof questsid = ' + typeof questsid);
        Questspowerups
            .find({ filter: { where: { questsid: questsid } } })
            .$promise
            .then(function(results) {
                component.items = results;
                // console.log('questsPowerUpsCtrl 1 size ' + component.items.length);
                // console.log(component.items);
                $ionicLoading.hide();
         });
    }

    $scope.$on('$ionicView.enter', function() {
        $ionicLoading.show({template: `Retrieving all the powerups of the quests ...`});
        component.id = $stateParams.id;
        // console.log('questsPowerUpsCtrl component = ' + JSON.stringify(component));
        getQuestsPowerUps(component.id);
    });


})

.controller('questJoinCtrl', function($location, $scope, $ionicPopover, $ionicLoading, StemFactory,StemService,stemcfg, $state, $stateParams, $ionicPopup, capi) {
    StemService.handleInvalidSession($state, $scope, StemService.getUserId(stemcfg), $ionicPopup, $stateParams.m);
    // console.log('questCtrl called!');
    
    var component = this;

    component.joinQuest = function(id, title, description, how) {
        // console.log('questJoinCtrl: joined ' + title);
        $state.go('menu.questDetails', {
            id: id,
            title: title,
            description: description,
            how: how
        });
    }

    $scope.$on('$ionicView.enter', function(){
        component.id = $stateParams.id;
        component.title = $stateParams.title;
        component.description = $stateParams.description;
        component.how = $stateParams.how;
        // console.log('questJoinCtrl component = ' + JSON.stringify(component));
        
        $ionicLoading.show({template: 'Retrieving users quests ...'});
        getUsersQuests(StemService.getUserId(stemcfg));
    });

    component.selectQuestPowerups = function(item) {
        // console.log('questJoinCtrl: selected ' + JSON.stringify(item));
        $state.go('menu.questsPowerUps', {
            id: item
        });
    }
    
    function getUsersQuests(id) {
        var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
        function afterUsersQuests(data) {
// debugger
            component.items = data.quests;
            $ionicLoading.hide();
            // console.log('questJoinCtrl 1 size ' + component.items.length);
            // console.log(component.items);
        }
        capi(webHost, '/api/Usersquests/view?userId=' + id, 'GET', 'model', 'method', null, afterUsersQuests, null);
    }
})

.controller('questHomeCtrl', function($ionicPopup, $state, $stateParams, $location, $scope,StemService,stemcfg, $resource, Quests, $ionicLoading) {
    StemService.handleInvalidSession($state, $scope, StemService.getUserId(stemcfg), $ionicPopup, $stateParams.m);
    // console.log('questHomeCtrl called!');

    var component = this;
    component.email = localStorage.getItem(stemcfg.user);
    // component.items = Quests;
    $scope.items = [];
    function getQuests() {
        // console.log('questHomeCtrl 1');
        Quests
            .find()
            .$promise
            .then(function(results) {
                component.items = results;
                // console.log('questHomeCtrl 3 size ' + component.items.length);
                $ionicLoading.hide();
            });
    }
    $scope.$on('$ionicView.enter', function(){
        $ionicLoading.show({template: `Retrieving all the quests ...`});
        // console.log('questHomeCtrl 2');
        getQuests();
    });
    
    component.selectQuest = function(item) {
        // console.log('questHomeCtrl: selected ' + JSON.stringify(item));
        $state.go('menu.questJoin', {
            id: item.id,
            title: item.title,
            description: item.description,
            how: item.how
        });
    }

});