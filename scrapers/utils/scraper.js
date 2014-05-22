'use strict';

var request = require('request');


module.exports = function(scrape) {
    return function(o, url, cb) {
        request.get(url, function(err, res, body) {
            if (err) {
                return cb(err);
            }
            var result = scrape(body);
            result.url = url;
            cb(null, result);
        });
    };
};
