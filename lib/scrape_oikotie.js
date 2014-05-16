'use strict';

var request = require('request');
var cheerio = require('cheerio');


module.exports = main;

function main(cb) {
    var url = 'http://tyopaikat.oikotie.fi/?toimiala[104]=104&sijainti[11]=11';

    request.get(url, function(err, res, body) {
        if(err) {
            return cb(err);
        }

        scrape(body, cb);
    });
}

function scrape(d, cb) {
    var $ = cheerio.load(d);
    var ret = [];

    $('.joblisting').each(function(i, e) {
        var $e = $(e);

        var link = $e.parent().attr('href');

        // TODO: parse more data from entry page
        ret.push({
            title: $e.find('.job-title').text(),
            company: $e.find('*[property="schema:name"]').text(),
            date: $e.find('*[property="schema:datePosted"]').attr('content'),
            link: link,
            gid: 'oikotie' + link.split('/').slice(-1)[0]
        });
    });

    cb(null, ret);
}
main.scrape = scrape;
