'use strict';

var async = require('async');
var levenshtein = require('wuzzy').levenshtein;
var sugar = require('object-sugar');

var Job = require('../schemas').Job;


module.exports = function(originalJob, cb) {
    var description = originalJob.description;

    sugar.getAll(Job, {
        company: originalJob.company
    }, function(err, jobs) {
        if(err) {
            return cb(err);
        }

        async.filter(jobs, function(job, cb) {
            if(originalJob._id === job._id) {
                return cb();
            }

            if(clean(originalJob.title) !== clean(job.title)) {
                return cb();
            }

            cb(levenshtein(clean(description), clean(job.description)) >= 0.65);
        }, cb.bind(null, null));
    });

    function clean(str) {
        return str.
            replace(/\r/g, '').
            replace(/\n/g, '').
            replace(/-/g, '').
            replace(/–/g, '').
            replace(/ /g, '').
            replace(/\t/g, '').
            replace(/•/g, '').
            toLowerCase();
    }
};
