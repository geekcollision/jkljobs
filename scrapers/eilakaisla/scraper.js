'use strict';

var cheerio = require('cheerio');
var moment = require('moment');


module.exports = require('../utils/scraper')(scrape);
module.exports.scrape = scrape;

function scrape(data) {
    var $ = cheerio.load(data);
    var $data = $('#content');

    // get rid of company introductions and job application section
    $('em, .apply-for-job').remove();

    return {
        title: $data.find('h1').text().split('-').slice(0, -1).join('-').trim(),
        gid: 'eilakaisla' + $data.find('h2').first().text().split('Työpaikan numero:').join('').trim(),
        type: getP($data, 1),
        added: moment(getP($data, 2), 'DD-MM-YYYY').utc().format(),
        description: $data.find('p').eq(3).nextAll().text().trim()
    };
}

function getP($data, n) {
    return $data.find('p').eq(n).text().split(':').slice(1).join('').trim();
}
