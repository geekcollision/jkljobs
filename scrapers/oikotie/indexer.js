'use strict';

var cheerio = require('cheerio');


module.exports = main;

function main(o, cb) {

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
