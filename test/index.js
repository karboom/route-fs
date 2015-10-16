require('should');
var restify = require('restify');
var request = require('request');
var main, base, server, server2, server3, server4;

describe("Binder", function () {
    before(function () {
        base = __dirname + "/tmp";
        main = new (require('../index.js'))({root:base});
    });

    describe("#list_file", function () {
        it("should return all files", function () {
            var list = main.list_file();

            list.should.containEql(base + '/public/person.js');
            list.should.containEql(base + '/public/unit/computer.js');
        });
    });

    describe("#parse_uri", function () {

        it("should found the sub uri", function () {
            var uris = main.parse_uri();

            uris.should.containEql({path:base + '/public/person/pet.js', uri:  '/public/:person/pet/:id'});
            uris.should.containEql({path:base + '/public/person/pet/dog.js', uri: '/public/:person/:pet/dog/:id'});
            uris.should.containEql({path:base + '/public/person.js', uri: '/public/person/:id'});
        });

    });

    describe("#handle", function () {
        before(function (done) {
            server = restify.createServer();
            server.use(restify.queryParser());
            server.use(restify.bodyParser());

            server.get(/.+/,main.handle());
            server.post(/.+/, main.handle());
            server.listen(3200, function (err) {
                if (err) console.log(err);
                done();
            });
        });

        it('should 405', function (done) {
            request.post('http://localhost:3200/public/person/85757').on('response', function (res) {
                res.statusCode.should.equal(405);
                done();
            });
        });

        it("should 404", function (done) {
            request.get("http://localhost:3200/test").on('response', function (res) {
                res.statusCode.should.equal(404);
                done();
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

    describe('#bind', function () {
        before(function (done) {
            server2 = restify.createServer();
            server2.use(restify.queryParser());
            server2.use(restify.bodyParser());

            main.bind(server2);
            server2.listen(3100, function (err) {
                if (err) console.log(err);
                done();
            });
        });


        it("should 404", function (done) {
            request.get("http://localhost:3100/test").on('response', function (res) {
                res.statusCode.should.equal(404);
                done();
            });
        });

        it("should parse id", function (done) {
            request.get("http://localhost:3100/public/person_happy/85757").on('response', function (res) {
                res.setEncoding('utf8');
                res.on("data", function (data) {
                    JSON.parse(data).should.eql({id: "85757"});
                    done();
                });
            });
        });

        it("should parse every param", function (done) {

            request.get("http://localhost:3100/public/85757/1/dog/2").on('response', function (res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {
                    JSON.parse(data).should.eql({person:'85757',pet:'1',id:'2'});
                    done();
                });
            });
        });

    });


    describe("#prefix", function () {
        describe("should work with bind", function () {
            before(function (done) {
                server3 = restify.createServer();
                server3.use(restify.queryParser());
                server3.use(restify.bodyParser());

                new (require('../index.js'))({root:base, prefix: '/prefix'}).bind(server3);
                server3.listen(3300, function (err) {
                    if (err) console.log(err);
                    done();
                });
            });

            it("prefix should work", function (done) {

                request.get("http://localhost:3300/prefix/public/person/85757").on('response', function (res) {
                    res.setEncoding('utf8');
                    res.on("data", function (data) {
                        JSON.parse(data).should.eql({id: "85757"});
                        done();
                    });
                });
            });
        });

        describe("work with handle", function () {
            before(function (done) {
                server4 = restify.createServer();
                server4.use(restify.queryParser());
                server4.use(restify.bodyParser());

                server4.get(/.+/,new (require('../index.js'))({root:base, prefix: 'prefix'}).handle());
                server4.listen(3400, function (err) {
                    if (err) console.log(err);
                    done();
                });
            });

            it("prefix worked", function (done) {
                request.get("http://localhost:3400/prefix/public/person/85757").on('response', function (res) {
                    res.setEncoding('utf8');
                    res.on("data", function (data) {
                        JSON.parse(data).should.eql({id: "85757"});
                        done();
                    });
                });
            });
        });

    });


    after(function () {

    });
});