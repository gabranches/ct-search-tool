/* PUBLIC */

/**
 * Combines an object key string so that it can be used as a key
 * e.g. prop1.0.example.property will point to Object[prop1][0][example][property]
 */

module.exports = StringRef;

/**
 * Splits a StringRef string into a refArr
 * 
 * @param {string} textRef - The string with the location of the key
 */

function StringRef(textRef) {
        
    // Convert indexes to properties, e.g. [example] to .example
    textRef = textRef.replace(/\[(\w+)\]/g, '.$1'); 
    // Strip a leading dot
    textRef = textRef.replace(/^\./, '');
                
    this.refArr = textRef.split('.');
    
}

//** PUBLIC **//

/**
 * Gets a value specified by a StringRef
 * 
 * @param {object} obj - The object in which to find the value
 */

StringRef.prototype.getVal = function(obj) {
     
    for (var i = 0, n = this.refArr.length; i < n; ++i) {
        var k = this.refArr[i];
        if (k in obj) {
            obj = obj[k];
        } else {
            return;
        }
    }
    return obj;
} 