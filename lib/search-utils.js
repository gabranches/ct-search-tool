var fs = require('fs');
var xml2js = require('xml2js');
var StringRef = require('./StringRef');
var util = require('util');

//** SOLR SETUP **//

// Specify core options here
var options = {
    core: 'ct-search-tool',
    solrVersion: '6.2.1'
}

// Initiate solr client
var solr = require('solr-client');
var client = solr.createClient(options);

/*** PRIVATE ***/
/**
 * Iterates over search terms and returns true once one is found
 * 
 * @params {Array} needleArr - An array of search strings
 * @params {string} haystack - The text to be searched
 */

function findMatch(needleArr, haystack) {

    for (var i = 0; i < needleArr.length; i++) {
        var regex = new RegExp(needleArr[i], "i");
        if (haystack.match(regex)) {
            return true
        }
    }
    return false;
}

/*** PUBLIC ***/

var self = module.exports = {

    /**
     * Returns an array of synonyms for a word (inclusive) using wordnet
     *  
     * @param {string} word - The word to look up
     * @param {function} callback - A callback function
     */

    getSynonyms: function (word, callback) {
        var wordNet = require('wordnet-magic');
        var wn = wordNet('./data/wordnet.db');
        var matches = [word];
        var word = new wn.Word(word, 'n');

        // Get synset
        word.getSynsets(function (err, data) {
            if (err) throw err;

            if (data.length === 0) {
                // No matches
                callback(matches);
            } else {
                data = data[0].words;
                // Add all lemmas to matches array
                for (var j = 0; j < data.length; j++) {
                    if (matches.indexOf(data[j].lemma) === -1) {
                        matches.push(data[j].lemma);
                    }
                }
                callback(matches);
            }
        });
    },

    /**
     * Converts xml to json
     * 
     * @param {string} filepath - The file location
     * @param {function} callback - A callback function
     */

    xmlToJson: function (filepath, callback) {
        var parser = new xml2js.Parser();
        // Read xml file
        fs.readFile(filepath, function (err, data) {
            if (err) throw err;
            // Convert to json
            parser.parseString(data, function (err, result) {
                callback(result);
            });
        });
    },

    /**
     * Saves a file to the file system
     * 
     * @params {string} filepath - The location of the file
     * @params {function} callback - A callback function
     */

    saveFile: function (filepath, data) {
        fs.writeFile(filepath, data, function (err) {
            if (err) throw err;
            console.log('Saved ' + filepath);
        });
    },

    /**
     * Finds a study using the nct ID
     * 
     * @param {string} nct - The nct ID
     * @param {function} callback - A callback function that takes the 
     *      results of the query as an argument
     */

    detailsQuery: function (nct, callback) {

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
    },

    /**
     * Main interface function
     * Finds synonyms and performs search
     */

    clinicalTrialSearch: function (query, callback) {
        self.getSynonyms(query, function (synArr) {
            self.searchResultQuery(synArr, callback);
        });
    },

    /**
     * Performs a search using a search term
     * 
     * @param {term} string - A search term results of the query as an argument
     */

    searchResultQuery: function (termArr, callback) {

        var searchString = self.buildSearchString(termArr);

        var query = client.createQuery()
            .q(searchString)
            .edismax()
            .start(0)
            .rows(1000)
            .qf({
                keywords: 5,
                brief_title: 10,
                official_title: 5,
                brief_summary: 3,
                detailed_description: 2
            });

        client.search(query, function (err, obj) {
            if (err) {
                console.log(err);
            } else {
                callback(obj.response.docs);
            }
        });
    },

    /**
     * Builds a search string to be used in the solr query using OR joins.
     * 
     * @param {termArr} Array - An array of search terms
     */

    buildSearchString: function (termArr) {
        var search = '"' + termArr[0] + '"';
        for (i = 1; i < termArr.length; i++) {
            search += ' OR "' + termArr[i] + '"';
        }
        console.log(search);
        return (search);
    }
}