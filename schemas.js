'use strict';

var sugar = require('object-sugar');
var schema = sugar.schema();


schema(module.exports, 'Job').fields({
    title: String,
    company: String,
    id: Number,
    url: String
});
