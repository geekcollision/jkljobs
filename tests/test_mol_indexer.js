#!/usr/bin/env node
'use strict';

var indexer = require('../scrapers/mol/indexer');


tests();

function tests() {
    var feed = 'http://www.mol.fi/tyopaikat/tyopaikkatiedotus/haku/tyopaikat.rss?ilmoitettuPvm=1&hakusana=&vuokrapaikka=---&alueet=Jyv%C3%A4skyl%C3%A4%2C+&valitutAmmattialat=25&lang=fi';

    indexer({
        feed: feed
    }, function(err, links) {
        if(err) {
            return console.error(err);
        }

        console.log(links);
    });
}
