# Dependency Tree Cli

> Iterates through an npm package dependency tree and outputs a nice tree along with other usefulness.

## Installation

* Traverse to where you're comfortable with `$ cd /path/to/my/comfort/zone`
* `$ git clone https://github.com/panstav/dependency-tree-cli.git`
* `$ cd dependency-tree-cli`
* `$ npm install`
* Optionally you may want to link it for global use with `$ npm link`

## Usage

    Usage: npm-tree <npm-package-name> [options]

    Options:
      --version, -v   Choose the package semver
      --check, -c     Scan for vulnerability @ Snyk/vulndb  [boolean]
      --strategy, -s  Choose a strategy for handling queried dependencies
      --timer, -t     Time the query  [boolean]
      --json, -j      JSON output  [boolean]
      --dry, -d       Dry Run, won't print the tree  [boolean]
      -h, --help      Show help  [boolean]