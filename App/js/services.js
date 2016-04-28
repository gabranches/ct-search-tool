// SERVICES

app.service('encodeURI', function() {
    return function(text) {
        return encodeURIComponent(text);
    }
});
