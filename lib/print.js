const chalk = require('chalk');

module.exports = print;

function print(data){

	// print the tree of dependencies
	if (!data.argv.dry) console.log(data.output);

	if (data.argv.check){
		if (!data.vulnDependencies.length){
			console.log('No vulnerabilities found.');
		
		} else {

			data.vulnDependencies.forEach(vulnDep => {
				vulnDep.vulnarablities.forEach(vuln => {
					const severityCode = vuln.severity.substr(0,1).toUpperCase();
					const vulnStr = `${severityCode}: ${vulnDep.name}@${vulnDep.version} - ${vuln.title}`;

					if (severityCode === 'H') return console.log(chalk.bold.black.bgRed(vulnStr));
					console.log(chalk.bold.red(vulnStr));
				});
			});

		}
	}

	if (data.argv.timer) console.log('Entire query', data.time);

}