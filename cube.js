var $ = require('dominus');
var mob = require('./mob');
var mobs = require('./mobs');
var npc = require('./npc');
var npcs = require('./npcs');
var pows = require('./powerups');
var bullets = require('./bullets');
var levels = require('./levels');
var emitter = require('./emitter');
var incubate = require('./incubate');
var body = $(document.body);
var yourCube;
var yourCubeInternal;
var you;
var flashing;
var keys;
var SPACE = 32;
var LEFT = 37;
var TOP = 38;
var RIGHT = 39;
var BOTTOM = 40;
var R = 82;

global.$ = $;

console.log('%cWelcome to Pony Cube! Use the arrow keys.', 'font-family: "Merriweather"; font-size: 60px; color: #e92c6c;');

incubateCube();
body.on('click', welcome);
body.on('keydown', welcoming);
body.on('keydown', specials);

function welcoming (e) {
  if (e.which === SPACE) {
    welcome();
  }
}

function specials (e) {
  if (e.which === R) {
    gameover('OK. TRY AGAIN!');
  }
}

function incubateCube () {
  yourCube = incubate();
  yourCubeInternal = yourCube.find('.pc-cube');
}

function welcome () {
  if (flashing) {
    $('#welcome-two').remove();
    body.removeClass('flashy');
    start();
    return true;
  } else {
    $('#welcome-one').remove();
    body.removeClass('welcome');
    body.addClass('flashy');
    flashing = true;
  }
}

function start () {
  keys = {};
  you = mob(yourCube, { type: 'you' });
  emitter.on('mob.leveldown', leveldown);
  yourCubeInternal.addClass('pc-show');
  body.off('click', welcome);
  body.off('keydown', welcoming);
  body.on('keydown', kd);
  body.on('keyup', ku);
  gameloop();
  levels(you);
}

function leveldown (m) {
  if (m === you) {
    you.placement();
    body.addClass('deathflash');
    setTimeout(function () {
      body.removeClass('deathflash');
    }, 400);
  }
}

function kd (e) { keys[e.which] = true; }
function ku (e) { keys[e.which] = false; }
function noPows (m) { return !m.pow; }
function onlyPows (m) { return !!m.pow; }
function usePow (m) { m.remove(); }
function gameloop () {
  var l = keys[LEFT];
  var t = keys[TOP];
  var r = keys[RIGHT];
  var b = keys[BOTTOM];
  var u = keys[SPACE];
  if (l && r) { l = r = false; }
  if (t && b) { t = b = false; }
  you.move(l ? -1 : (r ? 1 : 0), t ? -1 : (b ? 1 : 0));
  npcs.tick();
  bullets.tick();
  var cd = you.cd();
  var cdNoPows = cd.filter(noPows);
  cd.filter(onlyPows).forEach(usePow);
  if (you.kia || cdNoPows.length) {
    you.damage();
    if (you.kia) {
      gameover('YOU\'RE VERY MUCH DEAD WOW~!'); return;
    }
  }
  if (u) {
    you.fire();
  }
  requestAnimationFrame(gameloop);
}

function gameover (message) {
  $('.rt-tint').addClass('rt-show');
  cleanup();
  console.log('%c%s', 'font-family: "Comic Sans MS"; font-size: 25px; color: #d11911;', message);

  setTimeout(function () {
    body.on('keydown', restart);
  }, 500);
}

function cleanup () {
  yourCubeInternal.removeClass('pc-show');
  body.off('keyup', ku);
  body.off('keydown', kd);
  npcs.clear();
  pows.clear();
  mobs.splice(0, mobs.length);
}

function restart (e) {
  if (e.which === SPACE) {
    body.off('keydown', restart);
    yourCube.remove();
    incubateCube();
    $('.rt-tint').removeClass('rt-show');
    setTimeout(start, 1000);
  }
}
