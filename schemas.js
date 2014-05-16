'use strict';

var sugar = require('object-sugar');
var schema = sugar.schema();


schema(module.exports, 'Job').fields({
    title: String,
    description: String,
    summary: String,
    date: Date,
    link: String,
    company: String,
    gid: String
});
