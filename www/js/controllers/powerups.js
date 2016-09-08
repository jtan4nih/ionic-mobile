'use strict';

angular.module('controller.powerups', [])

.controller('questsPowerupsCtrl', function($location, $scope,StemService,stemcfg) {
    StemService.handleInvalidSession($state, $scope, localStorage.getItem(stemcfg.userid), $ionicPopup, $stateParams.m);
    console.log('questsPowerupsCtrl called!');
    var component = this;

    $scope.$on('$ionicView.enter', function(){
        component.title = $stateParams.title;
        component.description = $stateParams.description;
        component.how = $stateParams.how;
        console.log('questDetailsCtrl item = ' + JSON.stringify(component));
    });

    $scope.items = [];
    function getQuestsPowerups() {
        // console.log('questHomeCtrl 1');
        Quests
            .find()
            .$promise
            .then(function(results) {
                component.items = results;
                // console.log('questHomeCtrl 3 size ' + component.items.length);
            });
    }

});