Route-fs
========

A easy way to organize your routers.Say goodbye to writing route list by hand, just with the file system.

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