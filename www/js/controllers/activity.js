'use strict';

/**
Useful Explorer filter:

GET /Audits
{"where": {"owner": "user1@gmail.com"}}
*/
angular.module('controller.activity', [])

.controller('questActivityCtrl', function($location, $ionicFilterBar, Users, $scope, stemcfg, StemFactory, StemService, $state, $stateParams, $ionicPopup, capi) {
    StemService.handleInvalidSession($state, $scope, StemService.getUserId(stemcfg), $ionicPopup, $stateParams.m);
    var component = this;

    $scope.$on('$ionicView.enter', function(){
        // component.id = $stateParams.id;
        // component.title = $stateParams.title;
        // component.description = $stateParams.description;
        // component.how = $stateParams.how;
        // console.log('questActivityCtrl item = ' + JSON.stringify(component));
    });

    function getUsersQuestsActivity(id) {
        // debugger
        var webHost = StemService.getRealHost($location.absUrl(), stemcfg, $stateParams);
        function afterUsersQuestsActivity(data) {
            component.items = data;
            // console.log('questActivityCtrl 1 size ' + component.items.length);
            // console.log(component.items);
        }
        var json = { 
            "where": {
                "owner": id
            }
        };
        capi(webHost, '/api/Audits?filter=' + StemService.toExplorerFilter(json), 'GET', 'model', 'method', json, afterUsersQuestsActivity, null);
    }

    getUsersQuestsActivity(StemService.getUserEmail(stemcfg));

});