#!/usr/bin/env node
'use strict';

var assert = require('assert');
var fs = require('fs');

var scrape = require('../scrapers/eilakaisla/scraper').scrape;


tests();

function tests() {
    test1();
    test2();
}

function test1() {
    fs.readFile('./data/eilakaisla.html', {
        encoding: 'utf8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        var res = scrape(d);

        console.log(res);

        assert.equal(res.gid, 'eilakaisla6170');
        assert.equal(res.title, 'Ohjelmistosuunnittelija/ -testaaja');
        assert.equal(res.type, 'Toistaiseksi voimassa oleva');
        assert.equal(res.added, '2014-05-19T21:00:00+00:00');
        assert(res.description.length > 0);
    });
}

function test2() {
    fs.readFile('./data/eilakaisla2.html', {
        encoding: 'utf8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        var res = scrape(d);

        console.log(res);

        assert.equal(res.gid, 'eilakaisla6179');
        assert.equal(res.title, 'Automaatio-ohjelmistosuunnittelija');
        assert.equal(res.type, 'Toistaiseksi voimassa oleva');
        assert.equal(res.added, '2014-05-22T21:00:00+00:00');
        assert(res.description.length > 0);
    });
}
