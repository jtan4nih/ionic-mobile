'use strict';

describe('Controller: newMessageCtrl', function () {

	var $scope, newMessageCtrl, StemFactory, capi, StemService, $ionicLoading, $stateParams, $state, Users, $ionicFilterBar, $location, stemcfg;

	beforeEach(function () {

		// module('app.controllers');
		// module('app.services');
		module('app');

		module(function ($provide) {
			// $provide.factory('StemFactory', function () {
			// 	return {
			// 		store : function(key, value) {
			// 		}
			// 	}
			// });
			// $provide.service('capi', function () {
			// 	return {
			// 	}
			// });
			// $provide.service('StemService', function () {
			// 	return {
			// 	}
			// });
			// $provide.provider('$ionicLoading', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			// $provide.provider('$stateParams', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			// $provide.provider('$state', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			// $provide.provider('Users', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			// $provide.provider('$ionicFilterBar', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			// $provide.provider('$location', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			$provide.constant('stemcfg', '');
		});

		inject(function ($controller, _StemFactory_, _capi_, _StemService_, _$ionicLoading_, _$stateParams_, _$state_, _Users_, _$ionicFilterBar_, _$location_, _stemcfg_) {
			$scope = {};
			StemFactory = _StemFactory_;
			capi = _capi_;
			StemService = _StemService_;
			$ionicLoading = _$ionicLoading_;
			$stateParams = _$stateParams_;
			$state = _$state_;
			Users = _Users_;
			$ionicFilterBar = _$ionicFilterBar_;
			$location = _$location_;
			stemcfg = _stemcfg_;

			newMessageCtrl = $controller('newMessageCtrl', {
				$scope: $scope
			});
		});

	});

	// Specs here
	it('should return a property value', function () {
		// expect($scope.foo).toBe('bar');
		var component = newMessageCtrl;
		var id = 1;
		var name = 'test';
		var email = 'user1@gmail.com';
        var json = {
            id: 0,
            fromwhoId: 'fromwhoId',
            fromwhoName: name,
            fromwhoEmail: 'fromwhoEmail',
            towhoId: id,
            towhoName: 'towhoName',
            towhoEmail: email,
            text: 'text from karma test'
        };
		component.createMessage(json);
	});
	
	/*
	it('should return a method value', function () {
		expect($scope.baz()).toBe('qux');
	});
	*/

});