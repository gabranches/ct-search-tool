var jsonUtils = require('./lib/json-utils');
var data = require('./data/output.json');
var studies = data.studies.clinical_study;
var solrAPI = require('./lib/solr-api');

// Create map for nested objects
var map = {
    'id_info.0.nct_id.0'                        : 'nct_id',
    'required_header.0.url.0'                   : 'url',
    'official_title.0'                          : 'official_title',
    'phase.0'                                   : 'phase',
    'brief_summary.0.textblock.0'               : 'brief_summary',
    'eligibility.0.healthy_volunteers.0'        : 'healthy_volunteers',
    'eligibility.0.gender.0'                    : 'gender',
    'eligibility.0.criteria.0.textblock.0'      : 'inclusion_criteria',
    'eligibility.0.minimum_age.0'               : 'minimum_age',
    'eligibility.0.maximum_age.0'               : 'maximum_age',
    'keyword'                                   : 'keywords',
    'lastchanged_date.0'                        : 'last_updated',
    'overall_contact.0'                         : 'contact',
    'detailed_description.0.textblock.0'        : 'detailed_description',
    'brief_title.0'                             : 'brief_title',
    'overall_official'                          : 'overall_officials',
    'primary_outcome'                           : 'primary_outcome',
    'secondary_outcome'                         : 'secondary_outcome'
}


var dynamicFields = ['overall_officials', 'primary_outcome', 'secondary_outcome'];
var studiesFlattened = [];

// Flatten each study
for (study in studies) {
    studiesFlattened.push(jsonUtils.flatten(studies[study], map, dynamicFields));
}

// Index changes in solr
solrAPI.deleteAll();
solrAPI.add(studiesFlattened);