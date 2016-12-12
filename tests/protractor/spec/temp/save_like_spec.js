'use strict';
var sys = require("util");
var fileSystem = require('node-fs');
var querystring = require('querystring');
var request = require("request");
var express = require('express');
var s = require(__dirname + "/../../../server.js");
var ms = require(__dirname + "/../../mockApiServer.js");
var path = require("path");
var cors = require('cors');
s.app.use(cors());
sys.log('login_spec.js www path = [' + path.resolve(__dirname, '../../../www') + ']');
s.app.use(express.static(path.resolve(__dirname, '../../../www')));
ms.app.use(express.static(path.resolve(__dirname, '../../../www')));

process.on('uncaughtException',function(e) {
    sys.log("Caught unhandled exception: " + e);
    sys.log(" ---> : " + e.stack);
});

describe('save_like_spec.js: Ionic Web Tests', function () {
  'use strict';
  var EXPECTED_POST_BUTTON = "What's Happening?";
  var EXPECTED_TEXTAREA_SELECTOR = "body > div.modal-backdrop.active > div.modal-wrapper > ion-modal-view > ion-content > div.scroll > div.scroll > div > textarea";
  var EXPECTED_DISMISS_BUTTON_SELECTOR = 'body > div.modal-backdrop.active > div.modal-wrapper > ion-modal-view > ion-header-bar > button';
  var loginid = "test@gmail.com";
  var password = "111111";
  var lastTest;

  beforeEach(function () {
    // var apiServer = s.mockApiService.listen(mockApiService.get('port'), function () {
    //     console.log('Mock API Server listening on port ' + s.mockApiService.get('port'));
    // });

    // Load up a view and wait for it to be done with its rendering and epicycles.
    browser.get('/#/menu/login');
    browser.waitForAngular();
  });

  afterEach(function() {
    if(lastTest) {
      s.server.close();
      ms.server.close();
    }
  });

  it('view wall title + view save like icon', function () {
    var el = browser.findElement(by.css('#login-button1'));
    expect(el.isDisplayed()).toBe(true);
    element(by.css('#loginid')).sendKeys(loginid);
    element(by.css('#password')).sendKeys(password
       + protractor.Key.ENTER
    );
    console.log('********************* IF YOU ARE RUNNING THIS THE FIRST TIME, IT MIGHT TIME OUT DUE TO SERVICE COLD START AND YOU JUST NEED TO RUN THIS TEST AGAIN AND IT SHOULD WORK! LOL ********************* ');
    browser.sleep(3000);
// browser.pause();
    //=== pick the first topic like icon
    var likeSelector = '.savelike1:nth-child(1)';
    // var likeSelector = "#page7 > ion-content > div.scroll.padding > div.collection-repeat-container > div:nth-child(1) > div > ion-item:nth-child(2) > i";
    element(by.css(likeSelector)).click().then(function() {
        browser.sleep(800);
        expect($(likeSelector).getText()).toBe('1 like');
        element(by.css(likeSelector)).click().then(function() {
            browser.sleep(800);
            expect($(likeSelector).getText()).toBe('2 likes');
        });
    });

    lastTest = true;  //<--------- DO NOT forget: move this to the last test if you need to!
  });

});
