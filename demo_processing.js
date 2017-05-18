#!/usr/bin/env node

'use strict';

var fs = require('fs');
var assert = require('assert');
var csvWriter = require('csv-write-stream');
var nodePath = process.env.NODE_PATH;
var demo = require(nodePath + '/demofile/demo');

function parseDemoFile(path) {
  fs.readFile(path, function (err, buffer) {
    assert.ifError(err);
    var csgoDataFile = 'csgo_data.csv';

    if (!fs.existsSync(csgoDataFile)) {
      var writer = csvWriter({headers: ["map", "attacker", "victim", "weapon", "attackerHealth"]});
      writer.pipe(fs.createWriteStream(csgoDataFile));
    }
    else {
      var writer = csvWriter({sendHeaders: false});
      writer.pipe(fs.createWriteStream(csgoDataFile, {flags: 'a'}));
    }

/*
    var writer = csvWriter({headers: ["map", "attacker", "victim", "weapon", "attackerHealth"]});
    writer.pipe(fs.createWriteStream(csgoDataFile, {flags: 'a'}));
*/

    var demoFile = new demo.DemoFile();
    var mapName;

    demoFile.on('start', () => {
      mapName = demoFile.header.mapName;
    });

    demoFile.on('end', () => {
      writer.end();
    });

    demoFile.gameEvents.on('player_death', e => {
      let victim = demoFile.entities.getByUserId(e.userid);
      let attacker = demoFile.entities.getByUserId(e.attacker);
      if (victim && attacker) {
        writer.write({map: mapName, attacker: attacker.name, victim: victim.name, weapon: e.weapon, attackerHealth: attacker.health});
      }
    });

    demoFile.parse(buffer);
  });
}

parseDemoFile(process.argv[2]);

/*
for (var i = 2; i < process.argv.length; i++) {
  parseDemoFile(process.argv[i]);
}
*/
