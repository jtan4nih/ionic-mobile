var sys = require("util");
var querystring = require('querystring');
var request = require("request");
var express = require('express');
var s = require("../../server.js");
var ms = require("../mockApiServer.js");
var path = require("path");
var cors = require('cors');
s.app.use(express.static(path.resolve(__dirname, '../../www')));
s.app.use(cors());

process.on('uncaughtException',function(e) {
    sys.log("Caught unhandled exception: " + e);
    sys.log(" ---> : " + e.stack);
});

describe('loadMore_spec.js: Ionic Web Tests', function () {
  'use strict';
  var loginid = "test@gmail.com";
  var password = "111111";
  var lastTest;

  beforeEach(function () {
    // Load up a view and wait for it to be done with its rendering and epicycles.
    browser.get('http://127.0.0.1:3064/#/menu/login');
    browser.waitForAngular();
  });

  afterEach(function() {
    if(lastTest) {
      s.server.close();
      ms.server.close();
    }
  });

  it('verify load more items', function () {
    var el = browser.findElement(by.css('#login-button1'));
    expect(el.isDisplayed()).toBe(true);
    element(by.css('#loginid')).sendKeys(loginid);
    element(by.css('#password')).sendKeys(password
      // + protractor.Key.RETURN
    );
    // browser.sleep(3000);
    element(by.css('#login-button1')).click().then(function() {
      browser.sleep(3000);
      browser.getCurrentUrl().then(function(url) {
        console.log('url [' + url + ']');
        expect(url).toContain('#/menu/wall');
        // expect($('#newComment-button10').getText()).toBe('POST');
        console.log($('#page7').getText()); //TODO need to get wall.items.length!
      });
    });


    lastTest = true;  //<--------- DO NOT forget: move this to the last test if you need to!
  });

});
