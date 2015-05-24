Route-fs
========

A easy way to organize your routers.Say goodbye to writing route list by hand, just with the file system.

[![npm version](https://badge.fury.io/js/route-fs.svg)](http://badge.fury.io/js/route-fs)
[![npm depend](https://david-dm.org/karboom/route-fs.svg)](https://david-dm.org/karboom/route-fs.svg)
[![Build Status](https://travis-ci.org/karboom/route-fs.svg?branch=master)](https://travis-ci.org/karboom/route-fs)
[![Coverage Status](https://coveralls.io/repos/karboom/route-fs/badge.svg?branch=master)](https://coveralls.io/r/karboom/route-fs?branch=master)



How to use
==========

```
npm install route-fs
```

Import it to your project
```javascript
var server = require('express').createServer(); //or other express like server
var Routers = require('route-fs');
var routers = new Routers({root:YOUR_PATH_OF_ROUTERS});
server.listen(3000);
```

**you have two way to make it work**

######The way 1:As a wild router
```javascript
['get', 'post', 'delete', 'head', 'put']
	.forEach(function(method){
    	server[method](/.+/, routers.handle())
    });
```

######The way 2:Bind to your server
```javascript
routers.bind(server);
```

example
=======
①If YOUR_PATH_OF_ROUTERS contain the file

``/person/works.js``

it's the same as add route with

``/person/works/:id``

②If there have a directory and file with the same name in one directory,such as

``/person.js``

In the ①, it becomes

``/:person/works/:id``

#####For more detail, see /test directory now

