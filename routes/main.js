var searchUtils = require('../lib/search-utils');
var bodyParser = require('body-parser');
var data = require('../data/output.json');
var studies = data.studies.clinical_study;
var util = require('util');

// Specify core options here
var options = {
    core: 'ct-search-tool',
    solrVersion: '6.2.1'
}

// Initiate solr client
var solr = require('solr-client');
var client = solr.createClient(options);

module.exports = function(app, root) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // ** MAIN PAGE ** //

    app.get('/', function(req, res) {       
        res.render('index');
    });

    // ** DETAILS PAGE **//

    app.get('/details/:nct', function(req, res) {

        var nct = decodeURIComponent(req.params.nct);

        detailsQuery(nct, function(results) {
            res.render('details', {
                    data: results
            });
        });
    });

    // ** DETAILS JSON **//

    app.get('/details/:nct/.json', function(req, res) {

        var nct = decodeURIComponent(req.params.nct);

        detailsQuery(nct, function(results) {
            res.json(results);
        });
    });

    // ** SEARCH RESULTS PAGE ** //
    
    app.get('/search-results/:query', function(req, res) {

        console.time('query');

        var query = decodeURIComponent(req.params.query);

        searchResultQuery(query, function(results, synArr) {
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

    app.get('/search-results/:query/.json', function(req, res) {

        console.time('query');

        var query = decodeURIComponent(req.params.query);
        
        searchResultQuery(query, function(results, synArr) {
            res.json(results);
        });
    });

    /**
     * Finds a study using the nct ID
     * 
     * @param {term} nct - The nct ID
     * @param {function} callback - A callback function that takes the 
     *      results of the query as an argument
     */

    function detailsQuery(nct, callback) {

        var query = client.createQuery()
            .q({ nct_id: nct })
            .start(0)
            .rows(1);

        client.search(query, function (err, obj) {
            if (err) {
                console.log(err);
            } else {
                callback(obj.response.docs)
            }
        });
    }

    /**
     * Performs a search using a search term
     * 
     * @param {term} string - A search term
     * @param {function} callback - A callback function that takes the 
     *      results of the query as an argument
     */

    function searchResultQuery(term, callback) {

        var query = client.createQuery()
              .q('*' + term + '*')
              .edismax()
              .start(0)
              .rows(1000)
              .qf({
                  keywords : 5,
                  brief_title : 10,
                  official_title : 5,
                  brief_summary : 3,
                  detailed_description : 2
                });

        client.search(query, function (err,obj) {
            if (err) {
                console.log(err);
            } else {
                callback(obj.response.docs)
            }
        });
    } 
};

var fs = require('fs');