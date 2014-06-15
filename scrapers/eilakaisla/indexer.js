'use strict';

var url = require('url');

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
    var root = 'http://www.eilakaisla.fi/avoimet-tyopaikat/';
    var $ = cheerio.load(d);
    var ret = [];

    $('.jobs-box p').each(function(i, e) {
        var $e = $(e);
        var href = $e.find('a').first().attr('href');

        if(href) {
            ret.push(url.resolve(root, href));
        }
    });

    return ret;
}
