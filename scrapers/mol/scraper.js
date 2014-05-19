'use strict';

var request = require('request');
var cheerio = require('cheerio');


module.exports = main;

function main(o, url, cb) {
    request.get(url, function(err, res, body) {
        if(err) {
            return cb(err);
        }

        var d = scrape(body);

        d.link = url;

        cb(null, d);
    });
}

main.scrape = scrape;

function scrape(data) {
    var $ = cheerio.load(data);
    var parts = $('h3').text().split(',');

    return {
        title: parts[0],
        description: $('h3').next().text().trim(),
        company: getCompany(parts),
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

function getCompany(parts) {
    if(parts.slice(-1)[0] === parts.slice(-2)[0]) {
        return parts.slice(-3)[0].trim();
    }

    if(parts.length > 3) {
        return parts[2].trim();
    }

    return parts.slice(-2)[0].trim();
}
