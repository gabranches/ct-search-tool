
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
    
    app.get('/search-results/:query', function(req, res) {

        var data = require('../data/output.json');
        var studies = data.studies.clinical_study;
        var query = decodeURIComponent(req.params.query);
        

        searchUtils.getSynonyms(query, function(synArr) {

            var matches = searchUtils.search(studies, synArr,
                // Enter below the fields in the JSON tree to be searched
                [
                    'brief_title.0',
                    'official_title.0', 
                    'detailed_description.0.textblock.0',
                    'keyword'
                ]
            );
            
            var results = searchUtils.getResults(studies, matches, 

                // Enter below the objects of interest in the JSON tree
                { 
                    nct_id: 'id_info.0.nct_id.0',
                    url: 'required_header.0.url.0',
                    brief_title: 'brief_title.0',
                    phase: 'phase.0',
                    brief_summary: 'brief_summary.0.textblock.0',
                    keywords: 'keyword',
                    last_updated: 'lastchanged_date.0',
                    health: 'eligibility.0.healthy_volunteers.0',
                    minimum_age: 'eligibility.0.minimum_age.0',
                    maximum_age: 'eligibility.0.maximum_age.0'
                }
            );
            
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




