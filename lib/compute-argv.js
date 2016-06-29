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

		const time = argv.timer ? timer.end() : undefined;

		// stop the spinner and remove it
		loader.stop().clear();

		const flatTree = tree.flatTree;
		delete tree.flatTree;

		const result = {
			time,
			argv,
			output: argv.json
				// deep json view
				? util.inspect(tree, false, null)
				// nice tree view
				: topiary(tree, 'deps', { name: renamer })
		};

		return !argv.check ? result : filterToVulnerables(flatTree).then(vulnDependencies => {
			result.vulnDependencies = vulnDependencies;
			return result;
		});

	});

	function filterToVulnerables(flatTree){

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

	// rename each item in tree to a detailed inline
	function renamer(pkg){
		return `${pkg.name}@${pkg.version}${pkg.skip ? ' - skipped' : ''}`;
	}

}