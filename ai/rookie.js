var throttle = require('lodash.throttle');
var bullet = require('../bullet');
var audio = require('../audio');

function r () { return Math.random(); }
function rs () { return Math.sign(r() - 0.5); }

module.exports = function (npc) {
  var mob = npc.mob;
  var intelligence = 0.3;
  var goal = 700;
  var idle = 0;
  var d;
  var redirect = throttle(changeDirection, 300 + r() * 300);
  var shootrate = 1500;
  var lastShooting = Date.now() + shootrate;

  function changeDirection () {
    audio.play('npc-think');
    d = { x: rs(), y: rs() };
  }

  function think () {
    if (idle > goal) {
      redirect();
      idle = 0;
    } else {
      idle += r() * 100 * intelligence;
    }
    var perfect = mob.move(d.x, d.y);
    if (perfect === false) {
      redirect();
    }
    var now = Date.now();
    if (now - lastShooting > shootrate) {
      bullet(mob, { level: Math.floor(Math.max(1, mob.level * 0.5)) });
      lastShooting = Date.now();
    }
  }

  redirect();
  npc.think = think;
};
