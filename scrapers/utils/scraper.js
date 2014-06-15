'use strict';

var request = require('request');


module.exports = function(scrape, onResult) {
    onResult = onResult || id;

    return function(o, url, cb) {
        request.get(url, function(err, res, body) {
            if (err) {
                return cb(err);
            }
            var result = scrape(body);

            if(result) {
                result.url = url;

                cb(null, onResult(result, url));
            }
            else {
                cb(new Error('Failed to scrape ' + url));
            }
        });
    };
};

function id(a) {return a;}
