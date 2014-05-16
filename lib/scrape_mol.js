'use strict';

var request = require('request');

var FeedParser = require('feedparser');


module.exports = function(cb) {
    var feed = 'http://www.mol.fi/tyopaikat/tyopaikkatiedotus/haku/tyopaikat.rss?ilmoitettuPvm=1&hakusana=&vuokrapaikka=---&alueet=Jyv%C3%A4skyl%C3%A4%2C+&valitutAmmattialat=25&lang=fi';

    var req = request(feed, {timeout: 10000, pool: false});
    req.setMaxListeners(50);
    req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
       .setHeader('accept', 'text/html,application/xhtml+xml');

    var feedparser = new FeedParser();

    req.on('error', cb);
    req.on('response', function (res) {
        if(res.statusCode !== 200) {
            return this.emit('error', new Error('Bad status code'));
        }

        this.pipe(feedparser);
    });

    var data = [];

    feedparser.on('error', cb);
    feedparser.on('readable', function() {
        var post;

        while(post = this.read()) {
            var d = getFields(post,
                ['title', 'description', 'summary', 'date', 'link']
            );

            d.link = d.link.split('?')[0];
            d.id = extractId(d.link);

            data.push(d);
        }
    });
    feedparser.on('finish', function() {
        cb(null, data);
    });
};

function getFields(o, fields) {
    var ret = {};

    fields.forEach(function(field) {
        ret[field] = o[field];
    });

    return ret;
}

function extractId(str) {
    var parts = str.split('/');

    return 'mol' + parts.slice(-1)[0].split('_')[0];
}
