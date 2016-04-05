var searchUtils = require('../lib/searchUtils');

searchUtils.getSynonyms("hypertension", function(matches) {
    console.log(matches);
});