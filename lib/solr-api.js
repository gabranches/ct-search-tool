var solr = require('solr-client');

// Specify core options here
var options = {
    core: 'ct-search-tool',
    solrVersion: '6.2.1'
}

var client = solr.createClient(options);

/**
 * Commits changes to the solr client.
 * 
 * @param {Client} client - A solr client created using the solr-client 
 *      package
 * @param {string} message - A console message to be logged on success
 */

function commit(client, message) {
    client.commit(function (err, res) {
        if (err) console.log(err);
        if (res) console.log(res);
        console.log(message);
    });
}

// ** PUBLIC ** //

module.exports = {

    /**
     * Adds documents to the solr client.
     * 
     * @param {Array} docs - A collection of documents to be added.
     */

    add: function (docs) {
        client.add(docs, function (err, obj) {
            if (err) {
                console.log(err);
            } else {
                commit(client, docs.length + ' documents added.');
            }
        });
    },

    /**
     * Deletes all documents
     */

    deleteAll: function () {
        client.deleteAll(function (err, obj) {
            if (err) {
                console.log(err);
            } else {
                commit(client, 'All documents deleted.');
            }
        });
    }
};