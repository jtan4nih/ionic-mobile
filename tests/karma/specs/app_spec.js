'use strict';

describe('Factory: serviceJWTTokenAdder', function () {

	var serviceJWTTokenAdder;

	beforeEach(function () {

		module('app');

		module(function ($provide) {
		});

		inject(function (_serviceJWTTokenAdder_) {
			serviceJWTTokenAdder = _serviceJWTTokenAdder_;
		});
	});

	// Specs here
	/*
	it('should return a property value', function () {
		expect(serviceJWTTokenAdder.foo).toBe('bar');
	});

	it('should return a method value', function () {
		expect(serviceJWTTokenAdder.baz()).toBe('qux');
	});
	*/
	it('should return a property value', function () {
		expect(true).toBe(true);
	});
});