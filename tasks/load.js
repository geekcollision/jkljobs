'use strict';

var _extend = require('util')._extend;
var path = require('path');

var async = require('async');
var changeCase = require('change-case');
var is = require('annois');
var sugar = require('object-sugar');
var spyder = require('spyder');

var getSimilar = require('../jobs/get_similar');
var Job = require('../schemas').Job;
var sources = require('../config').sources;


module.exports = function(cb) {
    // avoid race condition at `getSimilar` by running these in series
    async.eachSeries(parseSources(sources), loadTarget, cb);
};

function parseSources(sources) {
    return Object.keys(sources).map(function(k) {
        return {
            name: k,
            options: {
                index: sources[k]
            }
        };
    });
}

function loadTarget(o, cb) {
    var name = o.name;
    var options = o.options || {};

    spyder(extend(options, {
        initializer: function(o, cb) {
            console.log('Starting to update', name);

            cb();
        },
        indexer: require(path.join('../scrapers', name, 'indexer')),
        scraper: require(path.join('../scrapers', name, 'scraper')),

        onError: function(o, err) {
            cb(err);
        },
        onResult: function(o, job, cb) {
            if(!job) {
                return cb(new Error('Failed to get valid result for ' + o.name));
            }

            job.company = normalizeCompany(job.company);

            job.sources = job.sources || {};
            job.sources[name] = job.url; // XXX: pass this via spyder as param?
            delete job.url; // XXX: fix object-sugar update

            getSimilar(job, function(err, jobs) {
                if(err) {
                    return cb(err);
                }

                if(jobs.length) {
                    mergeJobs(job, jobs, cb);
                }
                else {
                    updateJob(job, cb);
                }
            });
        },
        onFinish: function() {
            console.log('Updated', name);

            cb();
        }
    }));
}

function normalizeCompany(str) {
    if(!str) {
        return;
    }

    var oyIndex = str.indexOf('Oy');

    if(oyIndex > 0) {
        str = str.slice(0, oyIndex).trim();
    }

    if(changeCase.isUpperCase(str)) {
        return changeCase.titleCase(str);
    }

    return str;
}

function mergeJobs(job, jobs, cb) {
    var mergedJob = extend({}, job);

    jobs.forEach(function(job) {
        Object.keys(job).forEach(function(k) {
            if(is.object(mergedJob[k])) {
                mergedJob[k] = extend(mergedJob[k], job[k]);
            }
            else {
                mergedJob[k] = job[k] || mergedJob[k];
            }
        });
    });

    updateJob(mergedJob, cb);
}

function updateJob(job, cb) {
    sugar.getOrCreate(Job, {
        gid: job.gid
    }, function(err, d) {
        if(err) {
            return cb(err);
        }

        sugar.update(Job, d._id, job, cb);
    });
}

function extend(a, b) {
    return _extend(_extend({}, a), b);
}
