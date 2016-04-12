
var searchUtils = require('../lib/search-utils');
var bodyParser = require('body-parser');


module.exports = function(app, root) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.get('/', function(req, res) {       
        res.render('index');
    });
    
    app.get('/details', function(req, res) {
        res.render('details');
    });
    
    app.get('/search-results', function(req, res) {
        res.render('search-results');
    });

    app.post('/search-results', function(req, res) {

        if(!req.body.query) {
            throw "No query";
        }

        var data = require('../data/output.json');
        var studies = data.studies.clinical_study;
        var query = req.body.query;
        

        searchUtils.getSynonyms(query, function(synArr) {
            console.log("search terms: " + synArr);
            
            var matches = searchUtils.search(studies, synArr,
                // Enter below the fields in the JSON tree to search
                [
                    'brief_title.0',
                    'official_title.0', 
                    'detailed_description.0.textblock.0',
                    'keyword'
                ]
            );
            
            console.log('matches: ' + matches.length);
            
            var results = searchUtils.getResults(studies, matches, 

                // Enter below the objects of interest in the JSON tree
                { 
                    nct_id: 'id_info.0.nct_id.0',
                    url: 'required_header.0.url.0'
                }
            );
            
            console.log('results: ' + results.length);
            
            // Render the page and pass in data
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
    
};




var fs = require('fs');




