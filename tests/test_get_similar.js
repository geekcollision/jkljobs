#!/usr/bin/env node
'use strict';

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
    sugar.getAll(Job, {gid: 'mol8473201'}, function(err, job) {
        if(err) {
            return console.error(err);
        }

        getSimilar(job[0], function(err, similar) {
            if(err) {
                return console.error(err);
            }

            console.log('data', similar);
        });
    });
}
