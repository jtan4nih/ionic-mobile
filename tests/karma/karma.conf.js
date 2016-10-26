// Karma configuration
// Generated on Tue Oct 25 2016 19:24:51 GMT-0400 (Eastern Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
// basePath: __dirname + 'specs/',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'node_modules/whatwg-fetch/fetch.js',
        '../../www/lib/ionic/js/ionic.bundle.js',
        '../../www/lib/ionic-filter-bar/dist/ionic.filter.bar.min.js',
        // 'node_modules/angular-mocks/angular-mocks.js',
        'angular-mocks-modified.js',
        '../../www/js/moment.min.js',
        '../../www/js/moment-with-locales.min.js',
        '../../www/js/moment-timezone-with-data.min.js',
        '../../www/js/angular-moment.min.js',
        '../../www/js/angular-resource.min.js',
        '../../www/js/controllers.js',
        '../../www/js/controllers/walls.js',
        '../../www/js/controllers/quests.js',
        '../../www/js/controllers/powerups.js',
        '../../www/js/controllers/activity.js',
        '../../www/js/routes.js',
        '../../www/js/services.js',
        '../../www/js/swagger-client.js',
        '../../www/js/directives.js',
        '../../www/js/api-helper.js',
        '../../www/client/js/services/lb-services.js',
        '../../www/js/fetch.js',
        '../../www/js/app.js',
        'specs/**/*_spec.js',
        {pattern: 'specs/**/*.js', included: true, watched: true, served: true}
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
