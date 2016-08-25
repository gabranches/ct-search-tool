// cron job - need to double check node location on server
// 0 3 * * * /usr/local/bin/node /var/www/ct-search-tool/App/getLatest.js

var fs = require('fs');
var utils = require('./lib/search-utils');

fs.rename('./data/data-drop/output.xml', './data/output.xml', function(err) {
    if (err) throw err;
    console.log('Moved new data file.');

    // Converts xml output to json and saves it
    utils.xmlToJson('./data/output.xml', function(jsonData) {
        utils.saveFile('./data/output.json', JSON.stringify(jsonData));
    });
});





