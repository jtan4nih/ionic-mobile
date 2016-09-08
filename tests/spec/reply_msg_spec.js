var sys = require("util");
var querystring = require('querystring');
var request = require("request");
var express = require('express');
var s = require("../../server.js");
var ms = require("../mockApiServer.js");
var path = require("path");
s.app.use(express.static(path.join(__dirname, '../../www')));

process.on('uncaughtException',function(e) {
    sys.log("Caught unhandled exception: " + e);
    sys.log(" ---> : " + e.stack);
});

describe('reply_msg_spec.js: Ionic Web Tests', function () {
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
    browser.get('http://127.0.0.1:3064/#/menu/login');
    browser.waitForAngular();
  });

  afterEach(function() {
    if(lastTest) {
      s.server.close();
      ms.server.close();
    }
  });

  it('view wall title + view loading more button + view message popover', function () {
    var el = browser.findElement(by.css('#login-button1'));
    expect(el.isDisplayed()).toBe(true);
    element(by.css('#loginid')).sendKeys(loginid);
    element(by.css('#password')).sendKeys(password
      // + webdriver.Key.RETURN
    );
    console.log('********************* IF YOU ARE RUNNING THIS THE FIRST TIME, IT MIGHT TIME OUT DUE TO SERVICE COLD START AND YOU JUST NEED TO RUN THIS TEST AGAIN AND IT SHOULD WORK! LOL ********************* ');
    browser.sleep(3000);
    element(by.css('#login-button1')).click().then(function() {
      browser.sleep(3000);
      browser.getCurrentUrl().then(function(url) {
        console.log('url [' + url + ']');
        expect(url).toContain('#/menu/wall');
        
        browser.sleep(3000);
        expect($('#wall-button11').getText()).toBe(EXPECTED_POST_BUTTON);
        // expect($('#wall-button10').getText()).toContain('Reply to');
        expect(element.all(by.css('.wall-reply')).get(0).isDisplayed()).toBeTruthy();
        expect(element.all(by.css('.wall-reply')).get(1).isDisplayed()).toBeTruthy();
        // expect(element.all(by.css('.wall-reply')).get(2).isDisplayed()).toBeTruthy();
        //TODO the above are incorrect, the following should work but didn't
        // expect($$('.wall-reply').length).toEqual(3);
    
        // var reply1selector = 'ion-content > div > ion-list:nth-child(3) > div > ion-item.item.ng-binding';  //pick the first reply to button
        var reply1 = element.all(by.css('.wall-reply')).get(0);

        //=== clicking the Reply to first time with the first message
        reply1.click().then(function() {
            browser.sleep(3000);
            // return
            var textAreaSelector = EXPECTED_TEXTAREA_SELECTOR;
            expect($(textAreaSelector).getAttribute('value')).toBe('');
            element(by.css(textAreaSelector)).sendKeys('a new message');
            browser.sleep(2000);
            element(by.css(EXPECTED_DISMISS_BUTTON_SELECTOR)).click().then(function() {
                browser.sleep(800);
                //=== click again and make sure the textarea is cleared!
                reply1.click().then(function() {
                    browser.sleep(800);
                    expect($(textAreaSelector).getAttribute('value')).toBe('');
                });
            });
        });
      });
    });

    lastTest = true;  //<--------- DO NOT forget: move this to the last test if you need to!
  });

});
