'use strict';

describe('Controller: wallCtrl', function () {

	var $scope, wallCtrl, StemFactory, capi, StemService, $stateParams, $state, $ionicPopup, $location, $ionicPopover, $ionicLoading, $ionicModal, stemcfg;

	beforeEach(function () {

		module('app');
		// module('controller.walls');

		module(function ($provide) {
			// $provide.factory('StemFactory', function () {
			
			// });
			// $provide.service('capi', function () {
			
			// });
			// $provide.service('StemService', function () {
			
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
			// $provide.provider('$ionicPopup', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			// $provide.provider('$location', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			// $provide.provider('$ionicPopover', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			// $provide.provider('$ionicLoading', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			// $provide.provider('$ionicModal', function () {
			// 	this.$get = function () {
			// 		return {};
			// 	};
			// });
			$provide.constant('stemcfg', '');
		});

		inject(function ($controller, _StemFactory_, _capi_, _StemService_, _$stateParams_, _$state_, _$ionicPopup_, _$location_, _$ionicPopover_, _$ionicLoading_, _$ionicModal_, _stemcfg_) {
			$scope = {};
			StemFactory = _StemFactory_;
			capi = _capi_;
			StemService = _StemService_;
			$stateParams = _$stateParams_;
			$state = _$state_;
			$ionicPopup = _$ionicPopup_;
			$location = _$location_;
			$ionicPopover = _$ionicPopover_;
			$ionicLoading = _$ionicLoading_;
			$ionicModal = _$ionicModal_;
			stemcfg = _stemcfg_;

			wallCtrl = $controller('wallCtrl', {
				$scope: $scope
			});
		});

	});

	// Specs here
	it('saveLike should work', function () {
		var component = wallCtrl;
		spyOn($ionicLoading, 'show');
	    // $scope.$broadcast('$ionicView.enter');
		// $scope.$apply();
		var itemIndex = 0;
		component.saveLike(component, itemIndex);

		expect($ionicLoading.show).toHaveBeenCalledWith({template: `Saving like ...`});
		// expect(myMessagesThreadsCtrl.items).toBe(undefined);
	});

});