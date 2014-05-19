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
    var parts = $('h3').text().split(',');

    return {
        title: parts[0],
        description: $('h3').next().text(),
        link: '',
        company: parts[1],
        gid: 'mol' + $('#ilmoitusnumero').text(),
        contact: $('#yhteystiedot').text(),
        address: $('#tyopaikanOsoite').text(),
        salary: $('#palkkausteksti').text(),
        experience: $('#tyokokemus').text(),
        begins: $('#tyoAlkaaTekstiYhdistetty').text(),
        type: $('#tyoaikatekstiYhdistetty').text(),
        duration: $('#tyonKestoTekstiYhdistetty').text(),
        added: $('#ilmoituspaivamaarateksti').text()
    };
}
