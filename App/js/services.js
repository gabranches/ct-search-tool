// SERVICES

app.service('myUtils', function() {
    return {

    	encodeURI: function(text) {
	        return encodeURIComponent(text);
	    },

	    replaceNewlines: function(text) {
	    	console.log(text);
	    	return text;
	    }
	}
});