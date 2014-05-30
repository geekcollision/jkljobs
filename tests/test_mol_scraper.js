#!/usr/bin/env node
'use strict';

var assert = require('assert');
var fs = require('fs');

var scrape = require('../scrapers/mol/scraper').scrape;


tests();

function tests() {
    test1();
    test2();
}

function test1() {
    fs.readFile('./data/mol.html', {
        encoding: 'utf8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        var res = scrape(d);

        //console.log(res);

        assert.equal(res.company, 'Kela');
    });
}

function test2() {
    fs.readFile('./data/mol2.html', {
        encoding: 'utf8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        var res = scrape(d);

        //console.log(res);

        assert.equal(res.company, 'Descom Oy');
    });
}
