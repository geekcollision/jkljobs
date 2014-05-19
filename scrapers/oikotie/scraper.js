'use strict';

var request = require('request');
var cheerio = require('cheerio');


module.exports = main;

function main(o, url, cb) {
    request.get(url, function(err, res, body) {
        if(err) {
            return cb(err);
        }

        cb(null, scrape(body));
    });
}

main.scrape = scrape;

function scrape(data) {
    var $ = cheerio.load(data);
    var $additional = $('.job-additional-data');

    return {
        title: $('#jobTitle .n').text(),
        description: $('#jobDescription').text().trim(),
        link: '', // TODO
        company: $('#jobTitle .e').text(),
        gid: 'oikotie' + $additional.find('li').first().find('strong').text(),
        contact: '',
        address: '',
        salary: '',
        experience: '',
        begins: '',
        type: $additional.find('li').eq(2).find('strong').text(),
        duration: '',
        added: $('.time').text().split('Julkaistu').slice(-1)[0].trim() // TODO: parse
    };
}
