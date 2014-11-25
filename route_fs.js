/**
 *  You can add routers from fs structure automatic
 *  @author karboom
 *  @version 1.0
 *  @todo add extension opt
 *  @todo add ignore opt
 */

var fs = require('fs');

exports.bind = function (server, directory) {
    var root_dir = directory;

    var _route_files = function (server, directory) {
        fs.readdirSync(directory).forEach(function (fileName) {

            if( fs.lstatSync(directory + '/' + fileName).isDirectory()) {

                _route_files(server, directory + '/' + fileName);

            } else {

                var tmp = fileName.split('.');

                var file = tmp[0];
                var extension = tmp[1];

                if( 'js' != extension) return;

                var file_path = directory + '/' + fileName;
                var web_path =  directory.replace(root_dir, '') + '/' + file;

                var router = require(file_path);

                Object.keys(router).forEach(function (method) {
                    server[method](web_path + '/:id', router[method]);
                });
            }
        })
    };

    _route_files(server, directory);
    console.log("all files are bound under '%s', without '%s' and '%s'", '/', '.js', root_dir);
};