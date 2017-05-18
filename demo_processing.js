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

    var writer = csvWriter({headers: ["map", "attacker", "victim", "weapon", "attackerHealth"]});
    writer.pipe(fs.createWriteStream('csgo_data.csv'));
    var demoFile = new demo.DemoFile();
    var mapName;

    demoFile.on('start', () => {
      mapName = demoFile.header.mapName;
    });

    demoFile.on('end', () => {
    });

    demoFile.gameEvents.on('player_death', e => {
      let victim = demoFile.entities.getByUserId(e.userid);
      let attacker = demoFile.entities.getByUserId(e.attacker);
      if (victim && attacker) {
        writer.write([mapName, attacker.name, victim.name, e.weapon, attacker.health]);
      }
    });

    demoFile.parse(buffer);
  });
}

parseDemoFile(process.argv[2]);
