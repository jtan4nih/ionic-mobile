angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('menu.home', {
    url: '/home',
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('menu.powerUps', {
    url: '/powerups',
    views: {
      'side-menu21': {
        templateUrl: 'templates/powerUps.html',
        controller: 'powerUpsCtrl'
      }
    }
  })

  .state('menu', {
    url: '/menu',
    templateUrl: 'templates/menu.html',
    abstract:true
  })

  .state('menu.login', {
    url: '/login?m',
    views: {
      'side-menu21': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl as login'
      }
    }
  })

  .state('menu.wall', {
    url: '/wall',
    views: {
      'side-menu21': {
        templateUrl: 'templates/wall.html',
        controller: 'wallCtrl as wall'
      }
    }
  })

    .state('menu.myMessages', {
      url: '/inbox/:fromwho/:towho/:text',
      views: {
        'side-menu21': {
          templateUrl: 'templates/myMessages.html',
          controller: 'myMessagesCtrl as inbox'
        }
      }
    })

    .state('menu.myMessagesThreads', {
      url: '/inbox/threads/:towho/:id',
      views: {
        'side-menu21': {
          templateUrl: 'templates/myMessagesThreads.html',
          controller: 'myMessagesThreadsCtrl as inboxthreads'
        }
      }
    })

    .state('menu.quest', {
      url: '/quest',
      views: {
        'side-menu21': {
          templateUrl: 'templates/questHome.html',
          controller: 'questCtrl as quest'
        }
      }
    })

    .state('menu.questJoin', {
      url: '/questJoin',
      views: {
        'side-menu21': {
          templateUrl: 'templates/questJoin.html',
          controller: 'questCtrl as questJoin'
        }
      }
    })

    .state('menu.questActivity', {
      url: '/questActivity',
      views: {
        'side-menu21': {
          templateUrl: 'templates/questActivity.html',
          controller: 'questActivityCtrl as questAct'
        }
      }
    })

  .state('menu.powerUpsEdit', {
    url: '/page4',
    views: {
      'side-menu21': {
        templateUrl: 'templates/powerUpsEdit.html',
        controller: 'powerUpsEditCtrl'
      }
    }
  })

  .state('menu.toMessage', {
    url: '/tomessage',
    views: {
      'side-menu21': {
        templateUrl: 'templates/toMessage.html',
        controller: 'toMessageCtrl as to'
      }
    }
  })

    .state('menu.newMessage', {
      url: '/newmessage/:id/:name/:email',
      views: {
        'side-menu21': {
          templateUrl: 'templates/newMessage.html',
          controller: 'newMessageCtrl as msg'
        }
      }
    })

$urlRouterProvider.otherwise('/menu/login')



});
