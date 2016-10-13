var searchUtils = require('../lib/search-utils');
var bodyParser = require('body-parser');
var data = require('../data/output.json');
var studies = data.studies.clinical_study;
var util = require('util');


module.exports = function (app, root) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // ** MAIN PAGE ** //

    app.get('/', function (req, res) {
        res.render('index');
    });

    // ** DETAILS PAGE **//

    app.get('/details/:nct', function (req, res) {

        var nct = decodeURIComponent(req.params.nct);

        searchUtils.detailsQuery(nct, function (results) {
            res.render('details', {
                data: results
            });
        });
    });

    // ** DETAILS JSON **//

    app.get('/details/:nct/.json', function (req, res) {

        var nct = decodeURIComponent(req.params.nct);

        searchUtils.detailsQuery(nct, function (results) {
            res.json(results);
        });
    });

    // ** SEARCH RESULTS PAGE ** //

    app.get('/search-results/:query', function (req, res) {

        var query = decodeURIComponent(req.params.query);

        searchUtils.clinicalTrialSearch(query, function (results, synArr) {
            res.render('search-results', {
                data: {
                    query: query,
                    related: synArr,
                    numMatches: results.length,
                    results: results
                }
            });
        });
    });

    // ** SEARCH RESULTS JSON ** //

    app.get('/search-results/:query/.json', function (req, res) {

        var query = decodeURIComponent(req.params.query);

        searchUtils.clinicalTrialSearch(query, function (results, synArr) {
            res.json(results);
        });
    });

    
};


var fs = require('fs');