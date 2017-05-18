# demo_processing

node.js script utilizing [saul/demofile](https://github.com/saul/demofile) to
parse Counter-Strike: Global Offensive demo files and output data to .csv files
to be analyzed with [Watson Analytics](https://www.ibm.com/analytics/watson-analytics/us-en/).

## Requirements

* a node/npm installation
* [saul/demofile](https://github.com/saul/demofile)
* [csv-write-stream](https://www.npmjs.com/package/csv-write-stream)
* some CS:GO demo files

## Usage

```shell
$ ./demo_processing.js /path/to/demo/file.dem
```
