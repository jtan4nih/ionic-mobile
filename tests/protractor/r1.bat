echo Launch only a single spec (excluding suffix _spec.js!!!)

:nodist use stable && 
set PORT=8080&& set MOCK_API_PORT=3064&& set DEBUG=nock.*&&protractor protractor.conf.js --specs spec/%1_spec.js
