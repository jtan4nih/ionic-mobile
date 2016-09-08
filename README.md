Stempowerment II
=====================

All sorts of goodies in tow.

## Prerequisites

1. Git  

2. Install Node.js for your platform so that you have the npm command.  


### Notes for Windows Command Lines
The commands below are for Macs. The only necessary change for Windows should be to not use "sudo" at the front of commands (which is necessary on Macs to run certain command as a superuser). In this case
```
sudo npm install -g ionic
```
becomes
```
npm install -g ionic
```
## Ionic framework
This project uses ionic framework. Notes for installation: http://ionicframework.com/docs/guide/installation.html

1. Install Node.js for your platform so that you have the npm command.  

2. Install Ionic

```bash
npm install -g ionic
```


## Building the App
Installing dependencies
Windows
```bash
$ cd /stem2-mobile
$ i
```

Mac
```bash
$ cd /stem2-mobile
$ ./i
```

```bash
$ cd /stem2-mobile
$ npm install
```



## Running the App
Windows
```bash
$ r
```

Mac
```bash
$ ./r
```

If successful, you should see something like this

```
set PORT=8080
set NODE_PATH=.
watching: set NODIST_PREFIX=C:\Nodist\bin
ionic serve
```

If this is the first ever instance on the machine go to [http://localhost:8100/#/menu/login?m=1](http://localhost:8100/#/menu/login?m=1)
The ?m=1 is critical.


Subsequent instances [http://localhost:8100](http://localhost:8100)

Sign in with provided credentials

user1@gmail.com
111111

## Notes
Ionic serve will automatically watch for updated files and auto refresh your browser.
## Troubleshooting
If you're able to see the login Page but not sucessfully signin, open Applications Menu in Chrome developer tools. Under Local Storage, ensure that http://localhost:8100/ has an apihost key of http://50.28.56.122:3000 if it does not, point your browser to [http://localhost:8100/#/menu/login?m=1](http://localhost:8100/#/menu/login?m=1)

When all else fails, PM @jemtan :)
