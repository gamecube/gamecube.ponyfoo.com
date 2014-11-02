var npc = require('../npc');
var rookie = require('../ai/rookie');
var machinegun = require('../ai/machinegun');
var powerup = require('../powerup');

module.exports = function (you) {
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie }).node.addClass('npc-funk');
  npc(you, { ai: machinegun });
  powerup(you);
};
