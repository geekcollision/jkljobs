'use strict';

var cheerio = require('cheerio');
var request = require('request');


module.exports = main;

function main(o, cb) {
    request.post(o.index, {
        json: true,
        form: {
            'per_page': 100,
            show: 'list',
            'job_location': o.location
        },
        headers: {
            'Origin': 'http://it-ala.uranus.fi',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
        }
    }, function(err, res, data) {
        if(err) {
            return cb(err);
        }

        cb(null, scrape(data.sections['tyopaikat:luettelo:search_result_for_list']));
    });
}

main.scrape = scrape;

function scrape(d) {
    var $ = cheerio.load('<body>' + d + '</body>');
    var ret = [];

    $('td.name a').each(function(i, e) {
        var $e = $(e);

        ret.push('http://it-ala.uranus.fi' + $e.attr('href'));
    });

    return ret;
}
