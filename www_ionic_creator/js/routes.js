angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('menu.questJoin', {
    url: '/quest_join',
    views: {
      'side-menu21': {
        templateUrl: 'templates/questJoin.html',
        controller: 'questJoinCtrl'
      }
    }
  })

  .state('questActivity', {
    url: '/quest_activity',
    templateUrl: 'templates/questActivity.html',
    controller: 'questActivityCtrl'
  })

  .state('menu.questJoinConfirm', {
    url: '/quest_join_confirm',
    views: {
      'side-menu21': {
        templateUrl: 'templates/questJoinConfirm.html',
        controller: 'questJoinConfirmCtrl'
      }
    }
  })

  .state('menu.questExitConfirm', {
    url: '/page14',
    views: {
      'side-menu21': {
        templateUrl: 'templates/questExitConfirm.html',
        controller: 'questExitConfirmCtrl'
      }
    }
  })

  .state('menu', {
    url: '/menu',
    templateUrl: 'templates/menu.html',
    abstract:true
  })

  .state('menu.login', {
    url: '/login',
    views: {
      'side-menu21': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

  .state('menu.wall', {
    url: '/wall',
    views: {
      'side-menu21': {
        templateUrl: 'templates/wall.html',
        controller: 'wallCtrl'
      }
    }
  })

  .state('menu.myMessages', {
    url: '/inbox',
    views: {
      'side-menu21': {
        templateUrl: 'templates/myMessages.html',
        controller: 'myMessagesCtrl'
      }
    }
  })

  .state('menu.questHome', {
    url: '/quest_home',
    views: {
      'side-menu21': {
        templateUrl: 'templates/questHome.html',
        controller: 'questHomeCtrl'
      }
    }
  })

  .state('powerUpsEdit', {
    url: '/page9',
    templateUrl: 'templates/powerUpsEdit.html',
    controller: 'powerUpsEditCtrl'
  })

  .state('menu.newComment', {
    url: '/page8',
    views: {
      'side-menu21': {
        templateUrl: 'templates/newComment.html',
        controller: 'newCommentCtrl'
      }
    }
  })

  .state('menu.newMessage', {
    url: '/newmessage',
    views: {
      'side-menu21': {
        templateUrl: 'templates/newMessage.html',
        controller: 'newMessageCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/menu/wall')

  

});