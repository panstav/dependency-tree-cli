#!/usr/bin/env node

const topiary = require('topiary');
const ora = require('ora');
const Time = require('time-diff');
const timer = new Time();

const getTree = require('@panstav/dependency-tree');

const argv = require('yargs')
	.usage('Usage: $0 <npm-package-name> [options]')
	.demand(1, 'Package name missing.')
	.option('version', {
		alias: 'v',
		describe: 'Choose the package semver',
		default: 'latest'
	})
	.option('timer', {
		alias: 't',
		describe: 'Time the query',
		default: false,
		type: 'boolean'
	})
	.help('h')
	.alias('h', 'help')
	.argv;

// a call would stop by now if it didn't supply the correct syntax
// start loader spinning
const loader = ora({ spinner: 'dots7', text: 'Loading dependency tree' }).start();

if (argv.timer) timer.start();

// query for tree with given/default options and print results/errors
getTree({ name: argv._[0], version: argv.version })
	.then(print)
	.catch(console.error);

function print(tree){

	// stop the spinner and remove it
	loader.stop().clear();

	// print the tree of dependencies
	console.log(topiary(tree, 'deps', { name: renamer }));

	if (argv.timer) console.log('Entire query', timer.end());

	// rename each item in tree to a detailed inline
	function renamer(pkg){
		return `${pkg.name}@${pkg.version}${pkg.skip ? ' - skipped' : ''}`;
	}

}
