module.exports = print;

function print(data){

	// print the tree of dependencies
	if (!data.argv.dry) console.log(data.output);

	if (data.argv.timer) console.log('Entire query', data.time);

}