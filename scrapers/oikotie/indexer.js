'use strict';

var cheerio = require('cheerio');
var request = require('request');


module.exports = main;

function main(o, cb) {
    request.get(o.index, function(err, res, body) {
        if(err) {
            return cb(err);
        }

        cb(null, scrape(body));
    });
}

main.scrape = scrape;

function scrape(d) {
    var $ = cheerio.load(d);
    var ret = [];

    $('.joblisting').each(function(i, e) {
        var $e = $(e);

        ret.push($e.parent().attr('href'));
    });

    return ret;
}
