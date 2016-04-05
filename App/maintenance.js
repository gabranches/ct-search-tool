// This file should be run routinely to grab the xml data and covert it to json

var utils = require('./lib/utils');

// Converts xml output to json and saves it
utils.xmlToJson('./data/output.xml', function(jsonData) {
    utils.saveFile('./data/output.json', JSON.stringify(jsonData));
});

