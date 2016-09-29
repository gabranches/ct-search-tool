var jsonUtils = require('./lib/json-utils');
var data = require('./data/output.json');
var studies = data.studies.clinical_study;
var solrAPI = require('./lib/solr-api');

// Create mappings for nested objects
var mappings = {
    'id_info.0.nct_id.0': 'nct_id',
    'required_header.0.url.0': 'url',
    'official_title.0': 'official_title'
}

var studiesFlattened = [];

// Flatten each study
for (i in studies) {
    studiesFlattened.push(jsonUtils.flatten(studies[i], mappings));
}

// Index changes in solr
solrAPI.deleteAll();
solrAPI.add(studiesFlattened);