#!/usr/bin/env node

"use strict";

var fs = require("fs");
var assert = require("assert");
var csvWriter = require("csv-write-stream");
var nodePath = process.env.NODE_PATH;
var demo = require(nodePath + "/demofile/demo");
const emptyCell = "";

function determineHitGroup(hitgroup){
  var hitgroups = {
    "1": "Head",
    "2": "Upper Torso",
    "3": "Lower Torso",
    "4": "Left Arm",
    "5": "Right Arm",
    "6": "Left Leg",
    "7": "Right Leg",
    "default": "None"
  };
  return hitgroups[hitgroup] || hitgroups["default"];
}

function openDataFile(){
  var csgoDataFile = "csgo_data.csv";
  if (!fs.existsSync(csgoDataFile)) {
    var writer = csvWriter({headers: ["eventType", "map", "attacker",
                                      "victim", "weapon", "attackerHealth",
                                      "headshot", "remainingHealth",
                                      "remainingArmor", "hitgroup",
                                      "winningTeam", "winReason"]});
    writer.pipe(fs.createWriteStream(csgoDataFile));
  }
  else {
    var writer = csvWriter({sendHeaders: false});
    writer.pipe(fs.createWriteStream(csgoDataFile, {flags: "a"}));
  }
  return writer;
}

function handlePlayerHurt(demoFile, e, mapName, writer){
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
    writer.write({eventType: "player_hurt", map: mapName,
                  attacker: attacker.name, victim: victim.name,
                  weapon: e.weapon, attackerHealth: attacker.health,
                  headshot: headshot, remainingHealth: victim.health,
                  remainingArmor: victim.armor, hitgroup: hitgroup,
                  winningTeam: emptyCell, winReason: emptyCell});
  }
}

function handlePlayerDeath(demoFile, e, mapName, writer){
  let victim = demoFile.entities.getByUserId(e.userid);
  let attacker = demoFile.entities.getByUserId(e.attacker);

  if (e.headshot) {
    var hitgroup = "Head"
  }
  else {
    var hitgroup = "None"
  }

  if (victim && attacker) {
    writer.write({eventType: "player_death", map: mapName,
                  attacker: attacker.name, victim: victim.name,
                  weapon: e.weapon, attackerHealth: attacker.health,
                  headshot: e.headshot, remainingHealth: victim.health,
                  remainingArmor: victim.armor, hitgroup: hitgroup,
                  winningTeam: emptyCell, winReason: emptyCell});
  }
}

function handleRoundEnd(e, mapName, writer){
  if (e.winner == 2) {
    var winningTeam = "Terrorists"
  }
  else if (e.winner == 3) {
    var winningTeam = "Counter-Terrorists"
  }
  writer.write({eventType: "round_end", map: mapName,
                attacker: emptyCell, victim: emptyCell,
                weapon: emptyCell, attackerHealth: emptyCell,
                headshot: emptyCell, remainingHealth: emptyCell,
                remainingArmor: emptyCell, hitgroup: emptyCell,
                winningTeam: winningTeam, winReason: e.message.substring(13)});
}

function parseDemoFile(path) {
  fs.readFile(path, function (err, buffer) {
    assert.ifError(err);

    var writer = openDataFile();
    var demoFile = new demo.DemoFile();
    var mapName;

    demoFile.on("start", () => {
      mapName = demoFile.header.mapName;
    });

    demoFile.on("end", () => {
      writer.end();
    });

    demoFile.gameEvents.on("player_hurt", e => {
      handlePlayerHurt(demoFile, e, mapName, writer);
    });

    demoFile.gameEvents.on("player_death", e => {
      handlePlayerDeath(demoFile, e, mapName, writer);
    });

    demoFile.gameEvents.on("round_end", e => {
      handleRoundEnd(e, mapName, writer);
    });

    demoFile.parse(buffer);
  });
}

parseDemoFile(process.argv[2]);
