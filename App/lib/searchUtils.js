var fs = require('fs');
var xml2js = require('xml2js');
var StringRef = require('./StringRef');
var wordNet = require('wordnet-magic');
var util = require('util');

var wn = wordNet('../data/wordnet.db');

/* PRIVATE */

/**
 * Check if property exists and performs search.
 * If property value is an array, iterate over them and perform search.
 * 
 * @param {Object} currentObject - The object being considered
 * @param {string} query - The search string
 * @param {StringRef} ref - A StringRef of the property being checked
 * @param {Array} matches - An array with existing matches
 * @param {Integer} index - The current index
 * 
 */

function propertyCheck(currentObject, queryArr, ref, matches, index) {
        
    var currentVal = ref.getVal(currentObject);
    
    // Check if property exists
    if (currentVal) {
    
        // Check if value is a string
        if (typeof currentVal === "string") {
            
            // Perform search and add to array
            if (findMatch(queryArr, currentVal)) {
                if(matches.indexOf(index) === -1) {
                    matches.push(index);
                }
                return true;
            }
            
        } else {
            
            // Iterate of array and search each item
            for (i in currentVal) {
                if (currentVal.hasOwnProperty(i)) {
                    
                    if (typeof currentVal[i] !== "string") {
                        // throw ("Error: " + currentVal[i] + " is not a searchable string or array of strings."); 
                    }
                    
                    // Perform search and add to array
                    if (findMatch(queryArr, currentVal[i])) {
                        if(matches.indexOf(index) === -1) {
                            matches.push(index);
                        }
                        return true;
                    }
                    
                }
                
            }
        }
    }
    return false;
}

function findMatch(needleArr, haystack) {
    for (var i = 0; i < needleArr.length; i++) {
        if (haystack.indexOf(needleArr[i]) !== -1) {
            return true
        }
    }
    return false;
}

    
/* PUBLIC */

var self = module.exports = {
    
    // Converts xml to json
    xmlToJson: function(filepath, callback) {
        var parser = new xml2js.Parser();
        // Read xml file
        fs.readFile(filepath, function(err, data) {
            if (err) throw err;
            // Convert to json
            parser.parseString(data, function(err, result) {
                callback(result);
            });
        });
    },
    
    // Saves a file
    saveFile: function(filepath, data) {
        fs.writeFile(filepath, data, function(err) {
            if (err) throw err;
            console.log('Saved ' + filepath);
        });
    },
    
    
    /** 
     * Searches an array of objects, looks at the properties specified in propertyArr
     * Returns an array with the indices of matches
     *
     * @param {Array} object Arr - The data to be considered
     * @param {string} query - The query string
     * @param {Array} propertyArr - A list of properties to be searched
     * @param {Array} matches - (Optional) An array with pre-existing matches
     *                          If no array is passed, the function returns an array
     */  
    
    search: function(objectArr, queryArr, propertyArr, matches) {
        
        var returnFlag = false;
        
        // Initialize matches if not passed in
        if (!matches) {
            matches = [];
            returnFlag = true;
        }
        
        // Iterate over all objects
        for (var i in objectArr) {
            var obj = objectArr[i];
            
            // Iterate over only the properties in propertyArr
            for (var j in propertyArr) {
                if (propertyArr.hasOwnProperty(j)) {
                    var property = propertyArr[j];
                    
                    if (propertyCheck(obj, queryArr, new StringRef(property), matches, i)) {
                        break;
                    }
                }
                
            };
        }
        // Return an array of matches if no matches were passed in
        if (returnFlag === true) {
            return matches;
        }
    },
    
    
    /** 
     * Returns an object array with all matches and desired properties
     *
     * @param {Array} objectArr - The data to be considered
     * @param {Array} indexArr - An array of indices
     * @param {Object} propsToSave - The properties to be saved
     */  
    
    getResults: function(objectArr, indexArray, propsToSave) {
        var results = [];
        
        indexArray.forEach(function(index) {
            var saveObj = {};
            for (var i in propsToSave) {
                var ref = new StringRef(propsToSave[i]);
                saveObj[i] = ref.getVal(objectArr[index]);    
            }
            results.push(saveObj);
        });
        return results;
    },
    
    /**
     * Returns an array of synonyms for a word (inclusive) using wordnet
     * 
     * @param {string} word - The word to look up
     * @param {function} callback - A callback function
     */
    
    getSynonyms: function(word, callback) {
        // Initialize matches array
        var matches = [word];
        
        wn.isNoun(word, function(err, data){
            if (err) throw err;
            
            // If word is not a noun, invoke callback immediately
            if(!data) {
                callback(matches);
            }
            
            // Get synset
            wn.fetchSynset(word+".n.1", function(err, synset){
                if (err) throw err;
                
                synset.getLemmas(function(err, data){ 
                    if (err) throw err;
                    
                    // Add all lemmas to matches array
                    for (var j=0; j < data.length; j++) {
                        if(matches.indexOf(data[j].lemma) === -1) {
                            matches.push(data[j].lemma);
                        }
                    }
                    callback(matches);
                });
            });
        });
    },
    
}