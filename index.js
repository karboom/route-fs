/**
 *  You can add routers from fs structure automatic
 *  @author karboom
 *  @version 3.0
 */

var fs = require('fs');

function RS (config) {
    this.root = config.root;
    this.prefix = 'undefined' == typeof config.prefix ? '' : config.prefix.replace(/(^[^/].+)/, "/$1");
}

RS.prototype.list_file = function () {
    var path,
        list=[],
        now = this.root,
        dirs = [now];

    while ('undefined' != typeof (now=dirs.pop())) {
        fs.readdirSync(now).forEach(function (fileName) {
            if (fs.lstatSync((path = now + '/' + fileName)).isDirectory()) {
                dirs.push(path);
            } else {
                list.push(path);
            }
        });
    }

    return list;
};

RS.prototype.parse_uri = function () {
    var list = this.list_file(),
        uris = [],
        self = this;

    list.sort(function (a, b) {
        return a.split('/').length < b.split('/').length;
    });

    list.forEach(function (file) {
        var uri_obj = {path:file, uri: self.prefix + file.replace('.js','').concat('/:id?').replace(self.root,'')};

        for (var i in list) {
            var sub = list[i].replace('.js','').replace(self.root, '');

            if (list[i] != file && -1 != file.indexOf(sub + '/')) {
                uri_obj.uri = uri_obj.uri.replace(sub, sub.replace(/\/(\w+)$/, "/$1/:$1"));
            }
        }

        uris.push(uri_obj);
    });

    return uris;
};

RS.prototype._bind = bind = function (routes, server) {
    var file;

    routes.forEach(function (route) {
        file = require(route['path']);

        Object.keys(file).forEach(function (method) {
            server[method](route.uri, file[method]);
        })
    });

    return server;
};


RS.prototype.koa= function () {
    var self = this;

    return function* (next) {
        var server = this.app;

        if (!server.RS_MOUNTED) {
            var koa_router = require('koa-router')();
            var koa_routes = self._bind(self.parse_uri(), koa_router).routes();

            server.use(koa_routes);
            server.RS_MOUNTED = true;
        }
        yield next;
    };
};

RS.prototype.express = function () {
    var self = this;

    return function (req, res, next) {
        var server = req.app;

        if (!server.RS_MOUNTED) {
            self._bind(self.parse_uri(), server);
            server.RS_MOUNTED = true;
        }

        next();
    };
};

RS.prototype.restify = function () {
    var self = this;

    return function (req, res, next) {
        var server = this;

        if (!server.RS_MOUNTED) {
            self._bind(self.parse_uri(), server);
            server.RS_MOUNTED = true;
        }

        next();
    };
};

module.exports = RS;

