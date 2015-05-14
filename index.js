/**
 *  You can add routers from fs structure automatic
 *  @author karboom
 *  @version 2.0
 */

var fs = require('fs');
var Route = require('route-parser');

function Binder (config) {
    this.root = config.root;
}

Binder.prototype.list_file = function () {
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

Binder.prototype.parse_uri = function () {
    var list = this.list_file(),
        uris = [],
        self = this;

    list.sort(function (a, b) {
        return a.split('/').length < b.split('/').length;
    });

    list.forEach(function (file) {
        var uri_obj = {path:file, uri: file.replace('.js','').concat('/:id').replace(self.root,'')};

        for (var i in list) {
            var sub = list[i].replace('.js','').replace(self.root, '');
            if (list[i] != file && -1 != file.indexOf(sub)) {
                uri_obj.uri = uri_obj.uri.replace(sub, sub.replace(/\/(\w+)$/, "/:$1"));
            }
        }

        uris.push(uri_obj);
    });

    return uris;
};

Binder.prototype.handle = function () {
    var self = this;

    return function (req, res, next) {
        var routes = self.parse_uri(), i, route, params;
        //error master

       for(i in routes) {
           route = new Route(routes[i].uri);

           if ((params = route.match(req.url))) {
               req.params = params;

               var func = require(routes[i].path);
               func[req.method.toLowerCase()](req, res, next);

               return;
           }
       }

        res.status(404);
        res.send({asd:123});
    };
};

module.exports = Binder;