:nodist use 5 && set PORT=8080&&set MOCK_API_PORT=3064&&protractor protractor.conf.js

:nodist use stable
set PORT=8080&& set MOCK_API_PORT=3064&& set DEBUG=nock.*&&protractor protractor.conf.js
