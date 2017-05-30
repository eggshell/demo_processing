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
      var writer = csvWriter({headers: ["map", "attacker", "victim", "weapon",
                                        "attackerHealth", "headshot",
                                        "remainingHealth", "remainingArmor",
                                        "hitgroup"]});
      writer.pipe(fs.createWriteStream(csgoDataFile));
    }
    else {
      var writer = csvWriter({sendHeaders: false});
      writer.pipe(fs.createWriteStream(csgoDataFile, {flags: 'a'}));
    }

    var demoFile = new demo.DemoFile();
    var mapName;

    demoFile.on('start', () => {
      mapName = demoFile.header.mapName;
    });

    demoFile.on('end', () => {
      writer.end();
    });

    demoFile.gameEvents.on('player_hurt', e => {
      let victim = demoFile.entities.getByUserId(e.userid);
      let attacker = demoFile.entities.getByUserId(e.attacker);

      if (e.hitgroup == 1) {
        var headshot = true
      }
      else {
        var headshot = false
      }

      var hitgroup = determineHitGroup(e.hitgroup);

      if (victim && attacker) {
        writer.write({map: mapName, attacker: attacker.name,
                      victim: victim.name, weapon: e.weapon,
                      attackerHealth: attacker.health, headshot: headshot,
                      remainingHealth: victim.health,
                      remainingArmor: victim.armor, hitgroup: hitgroup});
      }
    });

    demoFile.gameEvents.on('player_death', e => {
      let victim = demoFile.entities.getByUserId(e.userid);
      let attacker = demoFile.entities.getByUserId(e.attacker);

      if (e.headshot) {
        var hitgroup = "Head"
      }
      else {
        var hitgroup = "None"
      }

      if (victim && attacker) {
        writer.write({map: mapName, attacker: attacker.name,
                      victim: victim.name, weapon: e.weapon,
                      attackerHealth: attacker.health, headshot: e.headshot,
                      remainingHealth: victim.health,
                      remainingArmor: victim.armor, hitgroup: hitgroup});
      }
    });

    demoFile.parse(buffer);
  });
}

function determineHitGroup(hitgroup){
  var finalHitGroup = "None";

  switch(hitgroup) {
    case 1:
      finalHitGroup = "Head";
      break;
    case 2:
      finalHitGroup = "Upper Torso";
      break;
    case 3:
      finalHitGroup = "Lower Torso";
      break;
    case 4:
      finalHitGroup = "Left Arm";
      break;
    case 5:
      finalHitGroup = "Right Arm";
      break;
    case 6:
      finalHitGroup = "Left Leg";
      break;
    case 7:
      finalHitGroup = "Right Leg";
      break;
  }

  return finalHitGroup;
}

parseDemoFile(process.argv[2]);
