'use strict';

require('array.prototype.findindex');

var cheerio = require('cheerio');
var moment = require('moment');


module.exports = require('../utils/scraper')(scrape);
module.exports.scrape = scrape;

function scrape(data) {
    var $ = cheerio.load(data);
    var h3text = $('h3').text();
    var parts = h3text.split(',');

    return {
        title: parts[0],
        description: $('h3').next().text().trim(),
        company: getCompany(h3text, parts),
        gid: 'mol' + $('#ilmoitusnumero').text(),
        contact: $('#yhteystiedot').text(),
        address: $('#tyopaikanOsoite').text(),
        salary: $('#palkkausteksti').text(),
        experience: $('#tyokokemus').text(),
        begins: $('#tyoAlkaaTekstiYhdistetty').text(),
        type: $('#tyoaikatekstiYhdistetty').text(),
        duration: $('#tyonKestoTekstiYhdistetty').text(),
        added: moment($('#ilmoituspaivamaarateksti').text(), 'DD-MM-YYYY').utc().format()
    };
}

function getCompany(text, parts) {
    var city = parts.slice(-1)[0];

    if(text.match(new RegExp(city, 'g')).length > 1) {
        var idx = parts.findIndex(function(e) {
            return e === city;
        });

        return parts[idx - 1].trim();
    }

    if(parts.length > 3) {
        return parts[2].trim();
    }

    return parts.slice(-2)[0].trim();
}
