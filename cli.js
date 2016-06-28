#!/usr/bin/env node

const util = require('util');

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
	.option('strategy', {
		alias: 's',
		describe: 'Choose a strategy for handling queried dependencies',
		choices: getTree.strategies,
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

// a call would stop by now if it didn't supply the correct syntax
// start loader spinning
const loader = ora({ spinner: 'dots7', text: 'Loading dependency tree' }).start();

if (argv.timer) timer.start();

// query for tree with given/default options and print results/errors
getTree({ name: argv._[0], version: argv.version, options: { strategy: argv.strategy } })
	.then(print)
	.catch(console.error);

function print(tree){

	// stop the spinner and remove it
	loader.stop().clear();

	// take out stats, log them seperately
	const stats = tree.stats;
	delete tree.stats;

	// print the tree of dependencies
	if (!argv.dry){
		const output = argv.json ? util.inspect(tree, false, null) : topiary(tree, 'deps', { name: renamer });
		console.log(output, '\n');
	}

	if (argv.timer) console.log(`Time to resolve ${timer.end()}`);
	console.log(`# of unique dependencies: ${stats.uniquePackages}`);
	console.log(`# of requests: ${stats.requestsOverNetwork}\n`);

	// rename each item in tree to a detailed inline
	function renamer(pkg){
		return `${pkg.name}@${pkg.version}${pkg.skip ? ' - skipped' : ''}`;
	}

}
