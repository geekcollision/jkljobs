#!/usr/bin/env node
'use strict';

var assert = require('assert');
var fs = require('fs');

var scrape = require('../scrapers/uranus/indexer').scrape;


tests();

function tests() {
    fs.readFile('./data/uranus_index.html', {
        encoding: 'utf8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        var res = scrape(d);

        console.log(res);

        assert.equal(res.length, 6);
    });
}
