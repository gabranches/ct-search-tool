var StringRef = require('./StringRef');

module.exports = {

    /**
     * Flattens a nested object
     * 
     * @params {object} obj - An object with other nested objects
     * @params {object} mappings - Nested to flat mappings using 
     *      the StringRef notation
     * 
     * @return {object} result - The flattened object
     */

    flatten: function(obj, mappings, dynamicFields) {
        var result = {};

        for (i in mappings) {
            // Create StringRef for the mapping
            var ref = new StringRef(i);

            // Add to result if the corresponding object is found
            if (ref.getVal(obj)) {

                // Convert to string if dynamic field
                if (dynamicFields.indexOf(mappings[i]) != -1) {
                    
                    // Ignore if longer than max size for solr 
                    if (JSON.stringify(ref.getVal(obj)).length < 32766) {
                        result[mappings[i]] = JSON.stringify(ref.getVal(obj));
                    } else {
                        result[mappings[i]] = '';
                    }
                    
                } else {
                    result[mappings[i]] = ref.getVal(obj);
                }
            } else {
                result[mappings[i]] = '';
            }
        }
        return result;
    }

}
