var sys = require("util");
var querystring = require('querystring');
var request = require("request");
var express = require('express');
var s = require("../../server.js");
var path = require("path");
s.app.use(express.static(path.join(__dirname, '../../www')));

process.on('uncaughtException',function(e) {
    sys.log("Caught unhandled exception: " + e);
    sys.log(" ---> : " + e.stack);
});

describe('Ionic Web Tests', function () {
  'use strict';
  var loginid = "test@gmail.com";
  var password = "111111";
  var lastTest;

  beforeEach(function () {
    // Load up a view and wait for it to be done with its rendering and epicycles.
    browser.get('/');
    browser.waitForAngular();
  });

  afterEach(function() {
    if(lastTest) {
      s.server.close();
    }
  });

  it('view wall title + view loading more button + view message popover', function () {
    var el = browser.findElement(by.css('#login-button1'));
    expect(el.isDisplayed()).toBe(true);
    element(by.css('#loginid')).sendKeys(loginid);
    element(by.css('#password')).sendKeys(password
      // + webdriver.Key.RETURN
    );
    browser.sleep(3000);
    element(by.css('#login-button1')).click().then(function() {
      browser.sleep(3000);
      browser.getCurrentUrl().then(function(url) {
        console.log('url [' + url + ']');
        expect(url).toContain('#/menu/wall');
      });
    });

    expect($('#wall-button9').getText()).toBe('LOAD NEXT');

    $('ion-list:nth-child(1) > div > ion-item.item.ng-binding').click().then(function() {
        expect($('#newComment-button10').getText()).toBe('POST');
    });

    lastTest = true;  //<--------- DO NOT forget: move this to the last test if you need to!
  });

});
