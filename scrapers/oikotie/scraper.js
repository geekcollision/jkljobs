'use strict';

var cheerio = require('cheerio');
var moment = require('moment');


module.exports = require('../utils/scraper')(scrape);
module.exports.scrape = scrape;

function scrape(data) {
    var $ = cheerio.load(data);
    var $additional = $('.job-additional-data');

    return {
        title: $('#jobTitle .n').text() || '',
        description: $('#jobDescription').text().trim() || '',
        company: $('#jobTitle .e').text() || '',
        gid: 'oikotie' + $additional.find('li').first().find('strong').text(),
        contact: '',
        address: '',
        salary: '',
        experience: '',
        begins: '',
        type: $additional.find('li').eq(2).find('strong').text(),
        duration: '',
        added: moment($('.time').text().split('Julkaistu').slice(-1)[0].trim(), 'DD-MM-YYYY').utc().format()
    };
}
