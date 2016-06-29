const util = require('util');

const topiary = require('topiary');
const ora = require('ora');
const Time = require('time-diff');
const timer = new Time();

const getTree = require('@panstav/dependency-tree');
const isOnSnykVulnDB = require('@panstav/is-on-snyk-vulndb');

module.exports = compute;

function compute(argv){

	// a call would stop by now if it didn't supply the correct syntax
	// start loader spinning
	const loader = ora({ spinner: 'dots7', text: 'Loading dependency tree' }).start();

	const options = { name: argv._[0], version: argv.version, options: { strategy: argv.strategy } };

	if (argv.timer) timer.start();

	// query for tree with given/default options and print results/errors
	return getTree(options).then(tree => {

		const timeToGetTree = argv.timer ? timer.end() : undefined;

		// stop the spinner and remove it
		loader.text = `Parsing${ argv.check ? ' and checking for vulnerabilities' : '' }`;

		return Promise.resolve(parseTree(tree, argv, timeToGetTree)).then(result => {
			loader.stop().clear();
			return result;
		});
	});

}

function parseTree(tree, argv, time){

	const flatTree = tree.flatTree;
	delete tree.flatTree;

	const result = {
		time,
		argv,
		output: argv.json
			// deep json view
			? util.inspect(tree, false, null)
			// nice tree view
			: topiary(tree, 'deps', { name: pkg => `${pkg.name}@${pkg.version}${pkg.skip ? ' - skipped' : ''}` })
	};

	return !argv.check ? result : filterToVulnerables().then(vulnDependencies => {
		result.vulnDependencies = vulnDependencies;
		return result;
	});

	function filterToVulnerables(){

		return Promise.all(appendVulnDataFromSnykDB()).then(markedFlatTree => {
			return markedFlatTree.filter(dependency => dependency.vulnarablities);
		});

		function appendVulnDataFromSnykDB(){
			return flatTree.map(dependency => {

				return isOnSnykVulnDB(dependency.name, dependency.version).then(itIs => {
					if (itIs) dependency.vulnarablities = itIs;
					return dependency;
				});

			});
		}

	}

}