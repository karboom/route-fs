exports.get = function (req, res) {
    res.send(req.params);
};

exports.post = function *() {
    this.body = this.params;
};