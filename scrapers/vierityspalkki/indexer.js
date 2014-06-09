'use strict';

var cheerio = require('cheerio');
var request = require('request');


module.exports = main;

function main(o, cb) {
    request.get(o.index, function(err, res, body) {
        if(err) {
            return cb(err);
        }

        cb(null, scrape(o, body));
    });
}

main.scrape = scrape;

function scrape(o, d) {
    var $ = cheerio.load(d);
    var ret = [];

    $('.post-type-vp-job').each(function(i, e) {
        var $e = $(e);

        if($e.find('dd:contains("' + o.location + '")').length) {
            ret.push($e.find('h2 a').attr('href'));
        }
    });

    return ret;
}
