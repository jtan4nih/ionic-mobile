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
ms.app.use(cors());
sys.log('login_spec.js www path = [' + path.resolve(__dirname, '../../../www') + ']');
s.app.use(express.static(path.resolve(__dirname, '../../../www')));
ms.app.use(express.static(path.resolve(__dirname, '../../../www')));

process.on('uncaughtException',function(e) {
    sys.log("Caught unhandled exception: " + e);
    sys.log(" ---> : " + e.stack);
});

describe('login_spec.js: Ionic Web Tests', function () {
  var loginid = "test@gmail.com";
  var password = "111111";
  var lastTest;
    var resourceDir = path.resolve('.', '../protractor/swagger-client.js');
    console.log('swagger.json [' + resourceDir + ']');
    var text = fileSystem.readFileSync(resourceDir);
    // var swaggerResp = stringFormat(text);
    var swaggerResp = text;

  beforeEach(function () {
    // browser.ignoreSynchronization = true;
    // Load up a view and wait for it to be done with its rendering and epicycles.
    browser.get('/');
    browser.waitForAngular();
  });

  afterEach(function() {
    //=== KISS
    if(lastTest) {
      s.server.close();
      ms.server.close();
    }
  });

  // afterAll(function() {
  //   s.server.close();  //NB: sadly jasmine-node does not support this as at 4/1/2016 :(
  // });

  it('view login title', function () {
    var el = browser.findElement(by.css('#login-button1'));
    expect(el.isDisplayed()).toBe(true);
    expect(el.getText()).toBe('Log in');
    s.server.close();
  });

  it('view wall title - invalid login test', function () {
    var el = browser.findElement(by.css('#login-button1'));
    expect(el.isDisplayed()).toBe(true);
    element(by.css('#loginid')).sendKeys(loginid);
    element(by.css('#password')).sendKeys(password + "t");  //purposely enter a wrong password
    browser.sleep(3000);
    element(by.css('#login-button1')).click().then(function() {
      console.log('********************* IF YOU ARE RUNNING THIS THE FIRST TIME, IT MIGHT TIME DUE OUT TO SERVICE COLD START AND YOU JUST NEED TO RUN THIS TEST AGAIN AND IT SHOULD WORK! LOL ********************* ');
      browser.sleep(3000);

      browser.getCurrentUrl().then(function(url) {
        console.log('url [' + url + ']');
        expect(url).toContain('#/menu/login');
      });
    });
  });

  it('view wall title - valid login test (happy path)', function () {
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
    // s.server.close();   //<--------- DO NOT forget: move this to the last test if you need to!
    lastTest = true;  //KISS
  });
});
