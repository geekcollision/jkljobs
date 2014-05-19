/* jshint boss:true */
'use strict';

var request = require('request');

var FeedParser = require('feedparser');


module.exports = function(o, cb) {
    var req = request(o.feed, {timeout: 10000, pool: false});
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
            data.push(post.link.split('?')[0]);
        }
    });
    feedparser.on('finish', function() {
        cb(null, data);
    });
};
