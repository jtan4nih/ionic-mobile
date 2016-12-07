echo Launch only a single spec (excluding suffix _spec.js!!!)

:set PORT=8080&& set MOCK_API_PORT=3064&& set DEBUG=nock.*&&node ..\node_modules\protractor\bin\protractor protractor_single_run.conf.js --specs spec/%1_spec.js
set PORT=8080&& set MOCK_API_PORT=3064&& set DEBUG=nock.*&&node ..\node_modules\protractor\bin\protractor protractor_single_run.conf.js
