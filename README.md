route-fs
========

Add route with fs structure and restful style.

usage
=====
```
npm install route-fs
```
```
var server = require('express').createServer(); //or other express like server
var route_fs = require('route-fs');

// use your middleware here

route_fs.bind(server, './routes'); //see project below

server.listen(3000);

```

project
=======
```
|-index.js
|-routes
	|-hello.js
	|-user
    	|-student.js

```
route-flis
==========
hello.js
```
exports.get = function (req, res) {
	res.send('hello,' + req.params.name + '!');
}
```
user/student.js
```
exports.put = function (req, res) {
	res.send('good evening,'+ req.params.name +'!');
}
```
results
=======
| req | res |
|--------|--------|
| GET:/hello/everyone 		|   hello,everyone!     |
| PUT:/user/student/karboom |   good evening,karboom!     |

