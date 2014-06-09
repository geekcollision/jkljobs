#!/usr/bin/env node
'use strict';

var assert = require('assert');
var fs = require('fs');

var scrape = require('../scrapers/uranus/scraper').scrape;


tests();

function tests() {
    test1();
    test2();
}

function test1() {
    fs.readFile('./data/uranus.html', {
        encoding: 'utf8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        var res = scrape(d);

        console.log(res);

        assert.equal(res.company, 'HeadPower Oy');
        assert.equal(res.type, 'Kokopäiväinen');
        assert.equal(res.duration, 'Vakituinen');
        assert.equal(res.title, 'Tekninen arkkitehti');
        assert.equal(res.contact, 'Matti Sysmäläinen');
    });
}

function test2() {
    fs.readFile('./data/uranus2.html', {
        encoding: 'utf8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        var res = scrape(d);

        console.log(res);

        assert.equal(res.company, 'Kela');
        assert.equal(res.type, 'Kokopäiväinen');
        assert.equal(res.duration, 'Vakituinen');
        assert.equal(res.title, 'IT-asiantuntija');
        assert.equal(res.contact, 'Riku Sarlin');
    });
}