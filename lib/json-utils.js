var StringRef = require('./StringRef');

module.exports = {

    // * PUBLIC * //

    /**
     * function: flatten
     * Flattens a nested object
     * 
     * @params {object} obj         - An object with other nested objects
     * @params {object} mappings    - Nested to flat mappings using the StringRef notation
     */

    flatten: function(obj, mappings) {
        var result = {};

        for (i in mappings) {
            // Create StringRef for the mapping
            var ref = new StringRef(i);

            // Add to result if the corresponding object is found
            if (ref.getVal(obj)) {
                result[mappings[i]] = ref.getVal(obj);
            }
        }
        return result;
    }

}
