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


module.exports = function(cb) {
    // avoid race condition at `getSimilar` by running these in series
    async.eachSeries([
        {
            name: 'mol',
            options: {
                feed: 'http://www.mol.fi/tyopaikat/tyopaikkatiedotus/haku/tyopaikat.rss?ilmoitettuPvm=1&hakusana=&vuokrapaikka=---&alueet=Jyv%C3%A4skyl%C3%A4%2C+&valitutAmmattialat=25&lang=fi'
            }
        },
        {
            name: 'oikotie',
            options: {
                index: 'http://tyopaikat.oikotie.fi/?toimiala[104]=104&sijainti[11]=11'
            }
        },
        {
            name: 'vierityspalkki',
            options: {
                index: 'http://vierityspalkki.fi/tyopaikat/'
            }
        },
        {
            name: 'eilakaisla',
            options: {
                index: 'http://www.eilakaisla.fi/avoimet-tyopaikat?alue=13&haku=IT'
            }
        },
        {
            name: 'duunitori',
            options: {
                index: 'http://duunitori.fi/tyopaikat/?haku=it&alue=jyv%C3%A4skyl%C3%A4'
            }
        }
    ], loadTarget, cb);
};

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
