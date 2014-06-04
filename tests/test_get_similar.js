#!/usr/bin/env node
'use strict';

var assert = require('assert');

var async = require('async');
var sugar = require('object-sugar');

var Job = require('../schemas').Job;
var getSimilar = require('../jobs/get_similar');


main();

function main() {
    sugar.connect('db', function(err) {
        if(err) {
            return console.error(err);
        }

        async.each(require('./data/jobs.json'), sugar.create.bind(null, Job),
            function(err) {
                if(err) {
                    return console.error(err);
                }

                tests();
            }
        );
    });
}

function tests() {
    test1();
    test2();
    test3();
}

function test1() {
    sugar.getAll(Job, {gid: 'mol8473201'}, function(err, job) {
        if(err) {
            return console.error(err);
        }

        getSimilar(job[0], function(err, similar) {
            if(err) {
                return console.error(err);
            }

            assert.equal(similar.length, 1);
        });
    });
}

function test2() {
    sugar.getAll(Job, {gid: 'vierityspalkki10325'}, function(err, job) {
        if(err) {
            return console.error(err);
        }

        getSimilar(job[0], function(err, similar) {
            if(err) {
                return console.error(err);
            }

            assert.equal(similar.length, 1);
        });
    });
}

function test3() {
    sugar.getAll(Job, {gid: 'mol8481303'}, function(err, job) {
        if(err) {
            return console.error(err);
        }

        getSimilar(job[0], function(err, similar) {
            if(err) {
                return console.error(err);
            }

            assert.equal(similar.length, 1);
        });
    });
}
