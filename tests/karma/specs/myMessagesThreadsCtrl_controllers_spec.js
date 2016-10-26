'use strict';

describe('Controller: myMessagesThreadsCtrl', function () {

	var $scope, myMessagesThreadsCtrl, StemFactory, StemService, $ionicLoading, $state, Threads, Users, Usersthreads, $ionicFilterBar, stemcfg;
	var $rootScope;

	beforeEach(function () {

		module('app');

		module(function ($provide) {
			// $provide.factory('StemFactory', function () {
			
			// });
			// $provide.service('StemService', function () {
			
			// });
			// $provide.provider('$ionicLoading', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			// $provide.provider('$state', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			// $provide.provider('Threads', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			// $provide.provider('Users', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			// $provide.provider('Usersthreads', function () {
			// 	this.$get = function () {
			// 		return {
			// 			then: function (callback) {
		                //     return callback({'foo' : "bar"});
		                // }
			// 		};
			// 	};
			// });
			// $provide.provider('$ionicFilterBar', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			$provide.constant('stemcfg', '');
		});

		inject(function ($controller, _StemFactory_, _StemService_, _$ionicLoading_, _$state_, _Threads_, _Users_, _Usersthreads_, _$ionicFilterBar_, _stemcfg_, _$rootScope_) {
			$rootScope = _$rootScope_;
			// $scope = {};
			$scope = $rootScope;
			StemFactory = _StemFactory_;
			StemService = _StemService_;
			$ionicLoading = _$ionicLoading_;
			$state = _$state_;
			Threads = _Threads_;
			Users = _Users_;
			Usersthreads = _Usersthreads_;
			$ionicFilterBar = _$ionicFilterBar_;
			stemcfg = _stemcfg_;

			myMessagesThreadsCtrl = $controller('myMessagesThreadsCtrl', {
				$scope: $scope
			});
		});

	});

	// Specs here
	it('items should have some values', function () {
		// expect($scope.foo).toBe('bar');
		// window.getInbox();

		spyOn($rootScope, '$broadcast');
		// spyOn(Usersthreads, 'inbox');
	    $scope.$broadcast('$ionicView.enter');
		$scope.$apply();

		expect($rootScope.$broadcast).toHaveBeenCalledWith('$ionicView.enter');
	    // expect(Usersthreads.inbox).toHaveBeenCalled();
		expect(myMessagesThreadsCtrl.items).toBe(undefined);
	});

});