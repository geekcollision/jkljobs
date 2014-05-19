'use strict';

var sugar = require('object-sugar');
var schema = sugar.schema();


schema(module.exports, 'Job').fields({
    title: String,
    description: String,
    link: String,
    company: String,
    gid: String,
    contact: String,
    address: String,
    salary: String,
    experience: String,
    begins: String,
    type: String,
    duration: String,
    added: Date
});
