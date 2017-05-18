# demo_processing

node.js script utilizing [saul/demofile](https://github.com/saul/demofile) to
parse Counter-Strike: Global Offensive demo files and output data to `.csv`
files to be analyzed with [Watson Analytics](https://www.ibm.com/analytics/watson-analytics/us-en/).

## Requirements

* a node/npm installation
* [saul/demofile](https://github.com/saul/demofile)
* [csv-write-stream](https://www.npmjs.com/package/csv-write-stream)
* some CS:GO demo files

## Usage

First ensure that you have set the `$NODE_PATH` environment variable and that
this path corresponds to the `node_modules` dir in which `demofile` and
`csv-write-stream` are located. I have them installed globally, but you can
opt to not do that.

```shell
$ ./demo_processing.js /path/to/demo/file.dem
```

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
