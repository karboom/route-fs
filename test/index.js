require('should');
var restify = require('restify');
var request = require('request');
var main, base, server;

describe("Binder", function () {
    before(function () {
        base = __dirname + "/tmp";
        main = new (require('../index.js'))({root:base});
        server = restify.createServer();
        server.use(restify.queryParser());
        server.use(restify.bodyParser());
        //server.get(/.+/,main.handle());
        main.bind(server);
        server.listen(3200, function (err) {
            if (err) console.log(err);
        });
        server.on('uncaughtException', function (req,res,route,err) {
            console.log(err.stack);
        });

    });

    describe("#list_file", function () {
        it("should return all files", function () {
            var list = main.list_file();

            list.should.containEql(base + '/public/person.js');
            list.should.containEql(base + '/public/unit/computer.js');
        });
    });

    //describe("#parse_uri", function () {
    //
    //    it("should found the sub uri", function () {
    //        var uris = main.parse_uri();
    //
    //        uris.should.containEql({path:base + '/public/person/pet.js', uri:  '/public/:person/pet/:id'});
    //        uris.should.containEql({path:base + '/public/person/pet/dog.js', uri: '/public/:person/:pet/dog/:id'});
    //        uris.should.containEql({path:base + '/public/person.js', uri: '/public/person/:id'});
    //    });
    //
    //});

    describe("#handle", function () {
        it("should 404", function () {
            request.get("http://localhost:3200/test").on('response', function (res) {
                res.statusCode.should.equal(404);
            });
        });

        it("should parse id", function (done) {
            request.get("http://localhost:3200/public/person/85757").on('response', function (res) {
                res.setEncoding('utf8');
                res.on("data", function (data) {
                    JSON.parse(data).should.eql({id: "85757"});
                    done();
                });
            });
        });

        it("should parse every param", function (done) {

            request.get("http://localhost:3200/public/85757/1/dog/2").on('response', function (res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {
                    JSON.parse(data).should.eql({person:'85757',pet:'1',id:'2'});
                    done();
                });
            });
        });
    });


    after(function () {

    });
});