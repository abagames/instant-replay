import * as debug from './debug';
import * as sss from 'sss';
import * as pag from 'pag';
import * as ppe from 'ppe';

let isInGame = false;
const rotationNum = 16;
let actors = [];
let player: any = null;
let ticks = 0;
let score = 0;
let isTouched = false;
let canvas: HTMLCanvasElement;
let bloomCanvas: HTMLCanvasElement;
let overlayCanvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let bloomContext: CanvasRenderingContext2D;
let overlayContext: CanvasRenderingContext2D;
window.onload = () => {
  sss.init();
  debug.enableShowingErrors()
  debug.initSeedUi(onSeedChanged);
  canvas = <HTMLCanvasElement>document.getElementById('main');
  canvas.width = canvas.height = 128;
  ppe.options.canvas = canvas;
  context = canvas.getContext('2d');
  bloomCanvas = <HTMLCanvasElement>document.getElementById('bloom');
  bloomCanvas.width = canvas.height = 64;
  bloomContext = bloomCanvas.getContext('2d');
  overlayCanvas = <HTMLCanvasElement>document.getElementById('overlay');
  overlayCanvas.width = canvas.height = 128
  overlayContext = overlayCanvas.getContext('2d');
  pag.defaultOptions.isMirrorY = true;
  pag.defaultOptions.rotationNum = rotationNum;
  pag.defaultOptions.scale = 2;
    setPlayer();
  update();
};
function handleTouchStarted() {
  sss.playEmpty();
  if (!isInGame && ticks > 0) {
    isInGame = true;
    score = ticks = 0;
    sss.playBgm();
    actors = [];
    setPlayer();
  }
};
function handleTouchtouchMoved() {
  return false;
};
function update() {
  requestAnimationFrame(update);
  sss.update();
  context.fillStyle = '#000';
  context.fillRect(0, 0, 128, 128);
  bloomContext.clearRect(0, 0, 64, 64);
  overlayContext.clearRect(0, 0, 128, 128);
  ppe.update();
  actors.sort((a, b) => a.priority - b.priority);
  forEach(actors, a => {
    a.update();
    drawPixels(a);
  });
  for (let i = 0; i < actors.length;) {
    if (actors[i].isAlive === false) {
      actors.splice(i, 1);
    } else {
      i++;
    }
  }
  ticks++;
};
function setPlayer() {
  if (player != null) {
    player.isAlive = false;
  }
  player = {};
  player.pixels = pag.generate([
    ' x',
    'xxxx'
  ]);
  player.pos = { x: 64, y: 64 };
  player.vel = { x: 0, y: 0 };
  player.angle = -Math.PI / 2;
  player.update = function () {
    ppe.emit('j1', player.pos.x, player.pos.y, player.angle + Math.PI);
  };
  player.priority = 0;
  actors.push(player);
};
function drawPixels(actor) {
  let a = actor.angle;
  if (a < 0) {
    a = Math.PI * 2 - Math.abs(a % (Math.PI * 2));
  }
  const pxs: pag.Pixel[][] =
    actor.pixels[Math.round(a / (Math.PI * 2 / rotationNum)) % rotationNum];
  const pw = pxs.length;
  const ph = pxs[0].length;
  const sbx = Math.floor(actor.pos.x - pw / 2);
  const sby = Math.floor(actor.pos.y - ph / 2);
  for (let y = 0, sy = sby; y < ph; y++ , sy++) {
    for (let x = 0, sx = sbx; x < pw; x++ , sx++) {
      var px = pxs[x][y];
      if (!px.isEmpty) {
        context.fillStyle = px.style;
        context.fillRect(sx, sy, 1, 1);
      }
    }
  }
}
function getActors(name: string) {
  let result = [];
  forEach(actors, a => {
    if (a.name === name) {
      result.push(a);
    }
  });
  return result;
}
function forEach(array: any[], func: Function) {
  for (let i = 0; i < array.length; i++) {
    func(array[i]);
  }
}
const onSeedChanged = (seed: number) => {
  pag.setSeed(seed);
  sss.reset();
  sss.setSeed(seed);
  ppe.setSeed(seed);
  ppe.reset();
  if (isInGame) {
    sss.playBgm();
  }
}