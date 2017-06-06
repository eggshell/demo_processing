# demo_processing

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

script utilizing [saul/demofile](https://github.com/saul/demofile) to parse
Counter-Strike: Global Offensive demo files and output data to `.csv` files to
be analyzed with [Watson Analytics](https://www.ibm.com/analytics/watson-analytics/us-en/).

## Requirements

* a node/npm installation
* [saul/demofile](https://github.com/saul/demofile)
* [csv-write-stream](https://www.npmjs.com/package/csv-write-stream)
* some CS:GO demo files

## Usage

Next, throw some `.dem` files into a `demos` dir located in this project's root
directory. Then `run.sh` can be used to run `demo_processing.js` on the dataset.

```shell
$ ./run.sh
```

This will generate a `csgo_data.csv` file for use with Watson Analytics.

### Environment Variables

The following environment variables are required:

  * `NODE_PATH` : corresponds to the path to the `node_modules` dir which
    contains both `demofile` and `csv-write-stream`. Can be, but is not
    limited to the global `node_modules` dir.

The following environment variables are optional:

  * `DEMOS_DIR` : path to a directory containing n number of demo files
    to be analyzed. If unset, `run.sh` will check the root directory of
    this project for a `demos` dir and use that.

### Stats Measured

Currently, `demo_processing` supports tracking the following stats on player
death events:

* map name
* attacker
* victim
* weapon used by attacker
* remaining health of attacker after kill

## Acknowledgements

Thanks to [saul](https://github.com/saul) for the MIT-licensed `demofile`
Node.js library.
