
var utils = require('../lib/utils');

module.exports = function(app, root) {
    
    app.get('/', function(req, res) {       
        res.render('index');
    });
    
    app.get('/details', function(req, res) {
        res.render('details');
    });
    
    app.get('/search-results', function(req, res) {
        res.render('search-results');
    });
    
};