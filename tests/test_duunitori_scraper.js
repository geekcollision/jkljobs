#!/usr/bin/env node
'use strict';

var assert = require('assert');
var fs = require('fs');

var scrape = require('../scrapers/duunitori/scraper').scrape;


tests();

function tests() {
    testNormal();
    testSkipReadMore();
}

function testNormal() {
    fs.readFile('./data/duunitori.html', {
        encoding: 'utf8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        var res = scrape(d);

        console.log(res);

        assert.equal(res.title, 'Viron kielen freelance-kouluttaja');
        assert.equal(res.company, 'Optimi Training Oy');
        assert.equal(res.type, 'muu osa-aikatyö');
        assert.equal(res.added, '2014-05-20T21:00:00+00:00');
        assert.equal(res.address, '40100 JYVÄSKYLÄ');
    });
}

function testSkipReadMore() {
    fs.readFile('./data/duunitori2.html', {
        encoding: 'utf8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        assert(!scrape(d));
    });
}
