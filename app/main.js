const log = require("./logger")
const os = require("os")

// Using deconstructing format
var {freemem, totalmem} = os

log("This is short version of console.log");

log(`This is the templating, \t Free Mem ${freemem}\tTotal Mem ${totalmem}`);