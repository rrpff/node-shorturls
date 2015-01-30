// List of available TLDS (JSON)
var TLDS = require("./tlds").tlds;

// Utility to check if domain is available
var DomainAvailable = require("domain-available"),
    // Uses freedomaiapi.com API key
    domainCheck = new DomainAvailable("nsb47icaho");

/**
 * Compare string to each TLD, to find any possible matches.
 * e.g. "actioncat" => ["action.ca/t", "action.cat", "actionc.at"...]
 * @param   {String}  keyword   Keyword to find domains with
 * @return  {Array}             Array of matches
 */
var findTLDMatches = function(keyword){
    var res = [];

    // For every known TLD
    for(var i = 0; i < TLDS.length; i++){
        // Get index (and existence) of TLD in string.
        var tld = TLDS[i],
            idx = keyword.indexOf(tld);

        // If TLD is in string, and doesn't start at the beginning.
        if(idx > 0){
            var domain = keyword.substr(0, idx),
                path = idx + tld.length !== keyword.length
                    // If the TLD is not at the end of the string, add a "path"
                    // with the rest of the keyword.
                    ? keyword.substr(idx + tld.length, keyword.length)
                    // Otherwise leave it.
                    : "";

            // Construct URL and push to results
            var url = domain + "." + tld;
            if(path.length) url += "/" + path;
            res.push(url);
        }
    }

    // Return matches
    return res;
}

/**
 * Search list of keywords for matches and compile a big list of results.
 * @param   {Array|String}  keywords    Keyword(s) to check
 * @return  {Array}                     List of results
 */
var searchKeywords = function(keywords){
    // Ensure keywords is an array.
    // If string is passed, put in array.
    if(typeof keywords === "string")
        keywords = [keywords];

    // Result array
    var urls = [];

    // For each keyword...
    for(var i = 0; i < keywords.length; i++){
        var keyword = keywords[i];
        if(keyword.indexOf(".") > -1){
            // ... if it's a domain, leave it as it is.
            urls.push(keyword);
        } else {
            // Otherwise hunt for possible domains.
            urls = urls.concat(findTLDMatches(keyword));
        }
    }

    return urls;
}

/**
 * Exported function. Searches list of keywords and
 * releases information.
 * @param   {Array|String}  keywords  Word(s) to check for possible domains.
 * @param   {Function}      each      Called after each request with availability info.
 * @param   {Function}      end       Called after all requests have been made with array of info.
 */
var findShortUrls = function(keywords, each, end){
    var urls = searchKeywords(keywords);
    domainCheck.check(urls, each, end);
}

// Export!
module.exports = findShortUrls;