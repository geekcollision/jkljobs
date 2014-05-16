#!/usr/bin/env node
'use strict';

var fs = require('fs');

var scrape = require('../lib/scrape_oikotie').scrape;


tests();

function tests() {
    fs.readFile('data/oikotie.html', {
        encoding: 'utf8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        scrape(d, function(err, d) {
            if(err) {
                return console.error(err);
            }

            console.log(d);
        });
    });
}
