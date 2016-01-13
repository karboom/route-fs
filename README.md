Route-fs
========

A easy way to organize your routers.Say goodbye to writing route list by hand, just proxy to file system.

[![Travis](https://img.shields.io/travis/karboom/route-fs/master.svg?style=flat-square)](https://travis-ci.org/karboom/route-fs)
[![Coveralls branch](https://img.shields.io/coveralls/karboom/route-fs/master.svg?style=flat-square)](https://coveralls.io/r/karboom/route-fs)


How to use
==========

##### Step 1

```text
npm install route-fs --save
```

##### Step 2

Create a floder named `routers` in your project, for example

```text

|-app.js

|-public/

|-routers/

  |-person.js

  |-person/

    |-works.js

```

##### Step 3

Add middleware on your server in `app.js`. Support koa, express 4, restify now.

```javascript
var koa = require('koa')();
var express = require('express')();
var restify = require('restify').createServer();

var RS = require('route-fs');

var rs = new RS({
	root: __dirname + '/routers', 	// path of `routers` directory
	prefix: 'public' 				// optional, default a empty string
});

koa.use(rs.koa());
express.use(rs.express());
restify.pre(rs.restify());

```

It will generate routes matcher like
```text
/public/person/:person?

/public/person/:person/work/:work?

```

##### Step 4

Exports the method handler in the file, if you are use `koa`, export generate function instead.

`work.js`

```javascript
exports.get = function(req, res, next) {
	res.send("We are works belongs to person No." + req.params.person);
};

exports.put = function(req, res, next) {
	var id = addWork(req.params.person);
	res.send("The work added to " + req.params.person + ", id is " + id)
};
```

`person.js`

```javascript
exports.get = function(req, res, next) {
	res.send("I am No." + req.params.person);
};

exports['delete'] = function() {
	res.send("No." + req.params.person + " was deleted.")
}
```

It will call the function named by http method when the request coming.


##### Step 5

It just finished! Let's experience with curl

```curl
curl -X GET 'http://localhost/public/person/1/work/'	->	"We are works belongs to person No.1"
curl -X PUT 'http://localhost/public/person/2/work/'	->	"The work added to 2, id is 1"
curl -X GET 'http://localhost/public/person/100'		->	"I am No.100"
curl -X DELETE 'http://localhost/public/person/1'		->	"No.1 was deleted."

```


###For more detail, see /test directory now

