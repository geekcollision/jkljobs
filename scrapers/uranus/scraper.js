'use strict';

var cheerio = require('cheerio');


module.exports = require('../utils/scraper')(scrape, function(res, url) {
    res.gid = 'uranus' + url.split('/').slice(-1)[0];

    return res;
});
module.exports.scrape = scrape;

function scrape(data) {
    var $ = cheerio.load(data);
    var title = $('#main_column .content.subject h1').text().trim();

    $('.content.subject, #image, #advertiser_presentation').remove();

    return {
        title: title,
        description: $('#main_column .content').first().text().trim(),
        company: $('h3:contains("Työnantaja")').next().text().trim(),
        contact: $('h3:contains("Tiedusteluihin vastaa")').next().text().trim(),
        address: '',
        salary: '',
        experience: '',
        begins: '',
        type: $('h3:contains("Työaika")').next().text().trim(),
        duration: $('h3:contains("Työsuhteen tyyppi")').next().text().trim(),
        added: ''
    };
}
