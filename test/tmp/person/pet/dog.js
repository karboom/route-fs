exports.get = function (req, res, next) {
    res.send(req.params);
};

exports.post = function *() {
    this.body = this.params;
};