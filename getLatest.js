// cron job - need to double check node location on server
// 0 3 * * * /usr/local/bin/node /var/www/ct-search-tool/App/getLatest.js

var fs = require('fs');
var utils = require('./lib/search-utils');
var jsonUtils = require('./lib/json-utils');
var jsonFile = JSON.stringify(require('./data/output.json'));
var data = require('./data/output.json');
var studies = data.studies.clinical_study;


// fs.rename('./data/data-drop/output.xml', './data/output.xml', function(err) {
//     if (err) throw err;
    // console.log('Moved new data file.');

    // // Converts xml output to json and saves it
    // utils.xmlToJson('./data/output.xml', function(jsonData) {
    //     utils.saveFile('./data/output.json', JSON.stringify(jsonData));
    // });
    // utils.saveFile('./data/output_flattened.json', JSON.stringify(JSON.flatten(jsonFile)));
// });

var mappings = {
    'id_info.0.nct_id.0'        : 'nct_id',
    'required_header.0.url.0'   : 'url',
    'official_title.0'          : 'official_title'
}

var studiesReduced = [];

studies.forEach(function(study) {
    studiesReduced.push(jsonUtils.reduce(study, mappings));
});

utils.saveFile('./data/output_flattened.json', JSON.stringify(studiesReduced));