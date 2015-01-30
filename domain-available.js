var request = require("request");

/**
 * Module constructor function
 * @param   {String}  apiKey  API key from freedomainapi.com
 * @return  {Object}          Instance of module
 */
var DomainAvailable = function(apiKey){
    this.HOST = "http://freedomainapi.com";
    this.API_KEY = apiKey;
}

/**
 * Construct freedomainapi URL using hostname of URL provided
 * @param   {String}  url  Url to check
 * @return  {String}       Constructed API url
 */
DomainAvailable.prototype._makeApiUrl = function(url){
    return this.HOST + "?key=" + this.API_KEY + "&domain=" + url.split("/")[0];
}

/**
 * Check if URL is available
 * @param   {String}    url  Url to check
 * @param   {Function}  cb   Callback
 */
DomainAvailable.prototype._checkUrl = function(url, cb){
    var apiUrl = this._makeApiUrl(url);
    request(apiUrl, function(err, res, body){
        body = JSON.parse(body);
        var args = [err, url, body.available || false, body];
        cb.call(this, args);
    });
}

/**
 * Check if domain(s) are available
 * @param   {Array|String}  urls    Domain name(s)
 * @param   {Function}      each    Function to be called after each domain is checked
 *                                  Passes error, domain name, availability and full API response body.
 * @param   {Function}      end     Function to be called after all urls have been checked.
 *                                  Passes array of results.
 */
DomainAvailable.prototype.check = function(urls, each, end){
    // Ensure urls is an array
    if(typeof urls === "string")
        urls = [urls];

    var results = [];

    var fn = function(args){
        // If each function has been provided, call with results
        if(each)
            each.apply(this, args);

        results.push(args[3]);

        // If all urls have now been checked, and end function provided, call with all results.
        if(results.length === urls.length && end)
            end.call(this, results);
    }

    for(var i = 0; i < urls.length; i++)
        this._checkUrl(urls[i], fn);

}

module.exports = DomainAvailable;