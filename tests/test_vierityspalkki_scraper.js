#!/usr/bin/env node
'use strict';

var assert = require('assert');
var fs = require('fs');

var scrape = require('../scrapers/vierityspalkki/scraper').scrape;


tests();

function tests() {
    test1();
    test2();
}

function test1() {
    fs.readFile('./data/vierityspalkki.html', {
        encoding: 'utf8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        var res = scrape(d);

        console.log(res);

        assert.equal(res.gid, 'vierityspalkki10130');
        assert.equal(res.title, 'Web Developer x 2');
        assert.equal(res.company, 'Media Cabinet Oy');
        assert.equal(res.added, '2014-05-06T21:00:00+00:00');
    });
}

function test2() {
    fs.readFile('./data/vierityspalkki2.html', {
        encoding: 'utf8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        var res = scrape(d);

        console.log(res);

        assert.equal(res.gid, 'vierityspalkki10325');
        assert.equal(res.title, 'Verkkokauppakehittäjä');
        assert.equal(res.company, 'Descom Oy');
        assert.equal(res.added, '2014-05-26T21:00:00+00:00');
    });
}
