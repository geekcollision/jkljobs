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
    var root = 'http://duunitori.fi/tyopaikat/tyo/';
    var $ = cheerio.load(d);
    var ret = [];

    $('#jobentry-list header a').each(function(i, e) {
        var $e = $(e);

        ret.push(url.resolve(root, $e.attr('href')));
    });

    return ret;
}
