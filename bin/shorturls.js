#!/usr/bin/env node

var chalk = require("chalk"),
    argv = require("yargs")
        .default("ignore", false)
        .alias("i", "ignore")
        .argv;

// Import module
var shorturls = require("../");

process.title = "shorturls";

shorturls(argv._, function(err, url, available){

    if(available)
        console.log(chalk.green(url + " is available!"));
    else if(!argv.ignore)
        console.log(chalk.red(url + " is not available."));

}, function(results){

    var numAvailable = results.reduce(function(num, result){
        return result.available ? num + 1 : num;
    }, 0);

    if(numAvailable > 0)
        console.log(chalk.white.bgGreen(numAvailable + " domains available"));

});