var sys = require("util");
var querystring = require('querystring');
var request = require("request");
var express = require('express');
var s = require(__dirname + "/../../../server.js");
var ms = require(__dirname + "/../../mockApiServer.js");
var path = require("path");
s.app.use(express.static(path.join(__dirname, 'www')));

process.on('uncaughtException',function(e) {
    sys.log("Caught unhandled exception: " + e);
    sys.log(" ---> : " + e.stack);
});

describe('wall_spec.js: Ionic Web Tests', function () {
  'use strict';
  var EXPECTED_POST_BUTTON = "What's Happening?";
  var EXPECTED_POST_BUTTON_SELECTOR = "#wall-button11";
  var EXPECTED_POST_SUBMIT_SELECTOR = "body > div.modal-backdrop.active > div.modal-wrapper > ion-modal-view > ion-content > div.scroll > div.scroll > button";
  var EXPECTED_POST_SUBMIT_LABEL = 'Post';
  var EXPECTED_TEXTAREA_SELECTOR = "body > div.modal-backdrop.active > div.modal-wrapper > ion-modal-view > ion-content > div.scroll > div.scroll > div > textarea";
  var EXPECTED_DISMISS_BUTTON_SELECTOR = 'body > div.modal-backdrop.active > div.modal-wrapper > ion-modal-view > ion-header-bar > button';
  var loginid = "test@gmail.com";
//   var loginid = "user1@gmail.com";
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
        //=== ensuring sorted orders are correct
var tempSel;
var textSel = '#page7 > ion-content > div.scroll.padding > div.collection-repeat-container > div:nth-child({{}}) > div > ion-item.item-avatar.item-icon-right.item-text-wrap.item > p.ng-binding';
// var textSel = 'body > div.modal-backdrop.active > div.modal-wrapper > ion-modal-view > ion-content > div.scroll > div.scroll > div > textarea';
// browser.pause();

// tempSel = textSel.replace('{{}}', '1');
tempSel = '.walltopicitemtext.ng-binding';
expect($(tempSel).getText()).toContain('first topic - 1 comment');
// tempSel = textSel.replace('{{}}', '2');
tempSel = '.wallcommentitemtext.ng-binding';
expect($(tempSel).getText()).toContain('comment 1');
        // tempSel = textSel.replace('{{}}', '3');
        // expect($(tempSel).getText()).toContain('second topic - two comments');
        // tempSel = textSel.replace('{{}}', '4');
        // expect($(tempSel).getText()).toContain('comment 2');
        // tempSel = textSel.replace('{{}}', '5');
        // expect($(tempSel).getText()).toContain('second topic - two comments');
        // tempSel = textSel.replace('{{}}', '6');
        // expect($(tempSel).getText()).toContain('comment 2');
        
        // tempSel = textSel.replace('{{}}', '5');
        // expect($(tempSel).getText()).toContain('');
        // tempSel = textSel.replace('{{}}', '6');
        // expect($(tempSel).getText()).toContain('comment 2');
        // tempSel = textSel.replace('{{}}', '7');
        // expect($(tempSel).getText()).toContain('comment 3');
        // tempSel = textSel.replace('{{}}', '8');
        // expect($(tempSel).getText()).toContain('third topic - zero comment');

        //=== ensuring the refresh button
        // expect($('#wall-button9').getText()).toBe('LOAD NEXT');
// return

var reply1selector = ".ion-reply";
var reply1 = element.all(by.css('.ion-reply')).get(0);

        //=== clicking the Reply to first time with the first message
        reply1.click().then(function() {
            browser.sleep(3000);
            expect($(EXPECTED_POST_SUBMIT_SELECTOR).getText()).toBe(EXPECTED_POST_SUBMIT_LABEL);
// return
            //=== clicking the POST message
            $(EXPECTED_POST_SUBMIT_SELECTOR).click().then(function() { //after this, the POST dialog should appear
                browser.sleep(3000);
                // expect($(EXPECTED_POST_BUTTON_SELECTOR).isDisplayed()).toBeTruthy();
                // browser.sleep(1800);
                return

//TODO Failed: element not visible after this line!!!
browser.pause();
reply1 = $$('.ion-reply').get(0);
reply1.click().then(function() {
browser.sleep(800);
return

  $(EXPECTED_DISMISS_BUTTON_SELECTOR).click().then(function() {
  // browser.sleep(30000);return
  
                //=== clicking the Reply to the second time
                $(reply1selector).click().then(function() { //after this, the POST dialog should appear
                    browser.sleep(1500);
                    expect($('#newComment-button10').isDisplayed()).toBeTruthy();
      
  $(EXPECTED_DISMISS_BUTTON_SELECTOR).click().then(function() {
                browser.sleep(800);
                      $(reply1selector).click().then(function() {
                    browser.sleep(1500);
                    $('#newComment-button10').click().then(function() {
                      browser.sleep(800);
                      expect($('#newComment-button10').isDisplayed()).toBeFalsy();

// return
                          browser.sleep(1000);
                          $('#newComment-button10').getAttribute("innerText").then(function (value) {
                            console.log(value);
                            expect(value).toEqual('POST');
                          });
                      });
                    // });
                      });
  }); //end of clicking the EXPECTED_DISMISS_BUTTON_SELECTOR button in the popover card!
                });
  }); //end of clicking the EXPECTED_DISMISS_BUTTON_SELECTOR button in the popover card!

});

            });
        });

      });
    });

    lastTest = true;  //<--------- DO NOT forget: move this to the last test if you need to!
  });

});
