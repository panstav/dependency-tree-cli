#!/usr/bin/env node

const compute = require('./lib/compute-argv');
const print = require('./lib/print');

const strategies = require('@panstav/dependency-tree').strategies;

const argv = require('yargs')
	.usage('Usage: $0 <npm-package-name> [options]')
	.demand(1, 'Package name missing.')
	.option('version', {
		alias: 'v',
		describe: 'Choose the package semver',
		default: 'latest'
	})
	.option('check', {
		alias: 'c',
		describe: 'Scan for vulnerability @ Snyk/vulndb',
		default: false,
		type: 'boolean'
	})
	.option('strategy', {
		alias: 's',
		describe: 'Choose a strategy for handling queried dependencies',
		choices: strategies,
		default: 'cache_after_iteration'
	})
	.option('timer', {
		alias: 't',
		describe: 'Time the query',
		default: false,
		type: 'boolean'
	})
	.option('json', {
		alias: 'j',
		describe: 'JSON output',
		default: false,
		type: 'boolean'
	})
	.option('dry', {
		alias: 'd',
		describe: 'Dry Run, won\'t print the tree',
		default: false,
		type: 'boolean'
	})
	.help('h')
	.alias('h', 'help')
	.argv;

compute(argv)
	.then(print)
	.catch(err => {
		console.error(err);
		console.log(err.stack);
	});