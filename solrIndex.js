var jsonUtils = require('./lib/json-utils');
var data = require('./data/output.json');
var studies = data.studies.clinical_study;
var solrAPI = require('./lib/solr-api');

var mappings = [
    {
        tag: 'id_info.0.nct_id.0',
        mapping: 'nct_id',
        dynamic: false
    },
    {
        tag: 'required_header.0.url.0' ,
        mapping: 'url',
        dynamic: false
    },
    {
        tag: 'official_title.0',
        mapping: 'official_title',
        dynamic: false
    },
    {
        tag: 'phase.0',
        mapping: 'phase',
        dynamic: false
    },
    {
        tag: 'brief_summary.0.textblock.0',
        mapping: 'brief_summary',
        dynamic: false
    },
    {
        tag: 'eligibility.0.healthy_volunteers.0' ,
        mapping: 'healthy_volunteers',
        dynamic: false
    },
    {
        tag: 'eligibility.0.gender.0',
        mapping: 'gender',
        dynamic: false
    },
    {
        tag: 'eligibility.0.criteria.0.textblock.0',
        mapping: 'inclusion_criteria',
        dynamic: false
    },
    {
        tag: 'eligibility.0.minimum_age.0',
        mapping: 'minimum_age',
        dynamic: false
    },
    {
        tag: 'eligibility.0.maximum_age.0',
        mapping: 'maximum_age',
        dynamic: false
    },
    {
        tag: 'keyword',
        mapping: 'keywords',
        dynamic: false
    },
    {
        tag: 'lastchanged_date.0',
        mapping: 'last_updated',
        dynamic: false
    },
    {
        tag: 'overall_contact.0',
        mapping: 'contact',
        dynamic: false
    },
    {
        tag: 'detailed_description.0.textblock.0',
        mapping: 'detailed_description',
        dynamic: false
    },
    {
        tag: 'brief_title.0',
        mapping: 'brief_title',
        dynamic: false
    },
    {
        tag: 'overall_official',
        mapping: 'overall_officials',
        dynamic: true
    },
    {
        tag: 'primary_outcome',
        mapping: 'primary_outcome',
        dynamic: true
    },
    {
        tag: 'secondary_outcome',
        mapping: 'secondary_outcome',
        dynamic: true
    }
];

var studiesFlattened = [];

// Flatten each study and add to studiesFlattened
for (study in studies) {
    var flattenedStudy = jsonUtils.flatten(studies[study], mappings);
    studiesFlattened.push(flattenedStudy);
}

// Index changes in solr
solrAPI.deleteAll();
solrAPI.add(studiesFlattened);