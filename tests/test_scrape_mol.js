#!/usr/bin/env node
'use strict';

var scrape = require('../lib/scrape_mol');


tests();

function tests() {
    scrape(function(err, d) {
        if(err) {
            return console.error(err);
        }

        console.log(d);
    });
}
