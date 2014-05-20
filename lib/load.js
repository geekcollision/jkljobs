'use strict';

var _extend = require('util')._extend;
var path = require('path');

var changeCase = require('change-case');
var sugar = require('object-sugar');
var spyder = require('spyder');

var Job = require('../schemas').Job;


module.exports = function(name, o) {
    o = o || {};

    return function(cb) {
        spyder(extend(o, {
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

                    sugar.update(Job, d._id, job, cb);
                });
            },
            onFinish: function() {
                console.log('Updated', name);

                cb();
            }
        }));
    };
};

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
