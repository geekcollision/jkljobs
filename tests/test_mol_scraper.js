#!/usr/bin/env node
'use strict';

var fs = require('fs');

var scrape = require('../scrapers/mol/scraper').scrape;


tests();

function tests() {
    fs.readFile('./data/mol.html', {
        encoding: 'utf8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        var res = scrape(d);

        console.log(res);
    });
}
