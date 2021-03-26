/**
 * Sets up which environment the server is going to be configured for.
 */

let environments = {};

environments.develop = {
    'httpPort' : 3000,
    'httpsPort' : 3030,
    'env_name' : 'develop'
};

environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5050,
    'env_name' : 'production'
};

//Get the commandline input when node was run. Example: NODE_ENV=production node server.js
let environmentName = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : '';

//Decide which environment configuration to export
let environment = typeof(environments[environmentName]) === 'object' ? 
    environments[environmentName] : 
    environments.develop;

module.exports = environment;