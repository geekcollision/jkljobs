'use strict';

var cheerio = require('cheerio');
var moment = require('moment');


module.exports = require('../utils/scraper')(scrape, function(res, url) {
    res.gid = 'duunitori' + url.split('-').slice(-1)[0];

    return res;
});
module.exports.scrape = scrape;

function scrape(data) {
    var $ = cheerio.load(data);
    var $data = $('.jobentry');

    return {
        title: $data.find('h1').text(),
        company: $data.find('h2 span').first().text(),
        description: $data.find('*[itemprop="description"]').text(),
        added: moment($data.find('*[itemprop="datePosted"]').text(), 'DD-MM-YYYY').utc().format(),
        type: $data.find('*[itemprop="employmentType"]').text().trim(),
        address: $data.find('*[itemprop="streetAddress"]').text()
    };
}
