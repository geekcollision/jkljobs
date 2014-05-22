'use strict';

var cheerio = require('cheerio');
var moment = require('moment');


module.exports = require('../utils/scraper')(scrape);
module.exports.scrape = scrape;

function scrape(data) {
    var $ = cheerio.load(data);
    var $data = $('.post-type-vp-job');
    var title = $data.find('h2').text();
    var company = $data.find('dd').first().text();

    $data.find('a').remove();

    return {
        title: title,
        company: company,
        gid: 'vierityspalkki' + $('article.post').attr('id').split('-').slice(1).join(''),
        description: $data.find('p').text(),
        added: moment($('.info time').text(), 'DD-MM-YYYY').utc().format()
    };
}
