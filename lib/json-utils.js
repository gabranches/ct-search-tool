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

    flatten: function(obj, mappings) {
        var result = {};

        for (i in mappings) {
            // Create StringRef for the mapping
            var ref = new StringRef(i);

            // Add to result if the corresponding object is found
            if (ref.getVal(obj)) {
                result[mappings[i]] = ref.getVal(obj);
            } else {
                result[mappings[i]] = '';
            }
        }
        return result;
    }

}
