'use strict';

var async = require('async');
var sugar = require('object-sugar');
var zip = require('annozip');

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

            var d1 = trim(description);
            var d2 = trim(job.description);
            var sameChars = getSameAmount(d1, d2);

            cb(sameChars / d1.length >= 0.65);
        }, function(results) {
            cb(null, results);
        });
    });

    function trim(str) {
        return str.
            replace(/\n/g, '').
            replace(/-/g, '').
            replace(/ /g, '').
            replace(/\t/g, '').
            replace(/•/g, '');
    }
};

function getSameAmount(a, b) {
    var arr = zip(a.split(''), b.split(''));
    var i, len;

    for(i = 0, len = arr.length; i < len; i++) {
        if(arr[i][0] !== arr[i][1]) {
            break;
        }
    }

    return i;
}
