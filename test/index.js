require('should');
var RS = require('../index.js');

var restify = require('restify').createServer();
var koa = require('koa')();
var express = require('express')();

var request = require('request');

var rs, root, prefix;

describe("RS", function () {
    before(function () {
        root = __dirname + "/tmp";
        prefix = '/public';

        rs = new RS({
            root,
            prefix
        });
    });

    describe("#list_file", function () {
        it("should return all files", function () {
            var list = rs.list_file();

            list.should.containEql(root + '/person.js');
            list.should.containEql(root + '/unit/computer.js');
        });
    });

    describe("#parse_uri", function () {

        it("should found the sub uri", function () {
            var uris = rs.parse_uri();

            uris.should.containEql({path:root + '/person/pet.js', uri:  '/public/person/:person/pet/:pet?'});
            uris.should.containEql({path:root + '/person/pet/dog.js', uri: '/public/person/:person/pet/:pet/dog/:dog?'});
            uris.should.containEql({path:root + '/person.js', uri: '/public/person/:person?'});
        });

    });

    describe('#middleware', function () {
        var service = {
            'koa' : '3200',
            'express' : '3300',
            'restify' : '3100'
        };

        function not_found (name) {
            return function (done) {
                request.get("http://localhost:"+ service[name] +"/test").on('response', function (res) {
                    res.statusCode.should.equal(404);
                    done();
                });
            }
        }
        function params(name) {
            return function (done) {
                var method = name == 'koa' ? 'post' : 'get';

                request[method]("http://localhost:"+ service[name] + "/public/person/85757/pet/1/dog/2").on('response', function (res) {
                    res.setEncoding('utf-8');
                    res.on('data', function (data) {
                        JSON.parse(data).should.eql({person:'85757',pet:'1',dog:'2'});
                        done();
                    });
                });
            }
        }
        function parse_id(name) {
            return function (done) {
                var method = name == 'koa' ? 'post' : 'get';

                request[method]("http://localhost:"+ service[name] + "/public/person_happy/85757").on('response', function (res) {
                    res.setEncoding('utf-8');
                    res.on("data", function (data) {
                        JSON.parse(data).should.eql({person_happy: "85757"});
                        done();
                    });
                });
            }
        }

        function suite(service) {
            return function () {
                it('should 404', not_found(service));
                it('should parse id', parse_id(service));
                it('should parse every param', params(service));
            }
        }

        before(function () {
            restify.pre(rs.restify());
            restify.use(require('restify').queryParser());
            restify.use(require('restify').bodyParser());

            restify.listen(service['restify']);

            koa.use(rs.koa());
            koa.listen(service['koa']);

            express.use(rs.express());
            express.listen(service['express']);
        });


        Object.keys(service).forEach(function (service) {
            describe(service, suite(service));
        });

    });
});