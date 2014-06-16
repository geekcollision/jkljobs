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

            var d1 = trim(description).toLowerCase();
            var d2 = trim(job.description).toLowerCase();

            cb(levenshtein(d1, d2) >= 0.65);
        }, function(results) {
            cb(null, results);
        });
    });

    function trim(str) {
        return str.
            replace(/\r/g, '').
            replace(/\n/g, '').
            replace(/-/g, '').
            replace(/–/g, '').
            replace(/ /g, '').
            replace(/\t/g, '').
            replace(/•/g, '');
    }
};
