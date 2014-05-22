'use strict';

var _extend = require('util')._extend;
var path = require('path');

var async = require('async');
var changeCase = require('change-case');
var sugar = require('object-sugar');
var spyder = require('spyder');

var Job = require('../schemas').Job;


module.exports = function(cb) {
    async.each([
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
            job.company = normalizeCompany(job.company);

            sugar.getOrCreate(Job, {
                gid: job.gid
            }, function(err, d) {
                if(err) {
                    return cb(err);
                }

                job.sources = job.sources || {};

                job.sources[name] = job.url; // XXX: pass this via spyder as param?

                delete job.url;

                sugar.update(Job, d._id, job, cb);
            });
        },
        onFinish: function() {
            console.log('Updated', name);

            cb();
        }
    }));
}

function normalizeCompany(str) {
    var oyIndex = str.indexOf('Oy');

    if(oyIndex > 0) {
        str = str.slice(0, oyIndex).trim();
    }

    if(changeCase.isUpperCase(str)) {
        return changeCase.titleCase(str);
    }

    return str;
}

function extend(a, b) {
    return _extend(_extend({}, a), b);
}
