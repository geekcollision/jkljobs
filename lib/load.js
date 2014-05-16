'use strict';

var async = require('async');
var sugar = require('object-sugar');

var Job = require('../schemas').Job;


module.exports = function(scrape, name) {
    return function(cb) {
        scrape(function(err, jobs) {
            if(err) {
                return cb(err);
            }

            console.log('Starting to update ' + name);

            async.each(jobs, function(job, cb) {
                sugar.getOrCreate(Job, {
                    gid: job.gid
                }, function(err, d) {
                    if(err) {
                        return cb(err);
                    }

                    sugar.update(Job, d._id, job, cb);
                });
            }, function(err) {
                if(err) {
                    return cb(err);
                }

                console.log('Updated ' + name);

                cb();
            });
        });
    };
};
