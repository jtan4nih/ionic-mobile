Setup
-----

For the login test to pass, please create the following account (with only read only/limited access if required):

Account name: test@gmail.com
Password: 111111

For the wall tests to pass, there should be at least one message on the wall.

You need to run the API services locally for the tests to fully pass. Please launch the API services and wait for the following message before starting the tests:

Web server listening at: http://localhost:3000
Browse your REST API at http://localhost:3000/explorer

Check https://github.com/radiantexp/stem2-middle for details.

How to Run It?
--------------

cd tests/ (if you are at the project root, otherwise you are already in this directory and there is nothing for you to do aka no need to cd to get here)

To run, just:

./r

To run a single spec, use ./r1 e.g.

./r1 wall

Troubleshooting
---------------

If your tests fail, try something like the following:

pkill node

Run it with sudo or administrative account

Good luck!
