#!/usr/bin/env node
'use strict';

var assert = require('assert');
var fs = require('fs');

var scrape = require('../scrapers/vierityspalkki/indexer').scrape.bind(null, {
    location: 'Jyväskylä'
});

tests();

function tests() {
    fs.readFile('./data/vierityspalkki_index.html', {
        encoding: 'utf8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        var res = scrape(d);

        console.log(res);

        assert.equal(res.length, 1);
    });
}
