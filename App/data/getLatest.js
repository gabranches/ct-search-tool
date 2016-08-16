// cron job - need to double check node location on server
// 0 3 * * * /usr/local/bin/node /var/www/ct-search-tool/App/data/getLatest.js

fs = require('fs');

fs.rename('data-drop/data.xml', 'data.xml', function(err) {
    if (err) throw err;
    console.log('Moved new data file.');
});