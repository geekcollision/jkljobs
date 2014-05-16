'use strict';

var cheerio = require('cheerio');



module.exports = function(d, cb) {
    var $ = cheerio.load(d);
    var ret = [];

    $('.joblisting').each(function(i, e) {
        var $e = $(e);

        var link = $e.parent().attr('href');

        ret.push({
            title: $e.find('.job-title').text(),
            company: $e.find('*[property="schema:name"]').text(),
            date: $e.find('*[property="schema:datePosted"]').attr('content'),
            link: link,
            id: 'oikotie' + link.split('/').slice(-1)[0]
        });
    });

    cb(null, ret);
};
