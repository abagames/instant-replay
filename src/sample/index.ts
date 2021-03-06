import * as sss from 'sss';
import * as pag from 'pag';
import * as ppe from 'ppe';
import * as ir from '../ir/index';
import * as text from './text';
import * as debug from './debug';

const rotationNum = 16;
const pixelWidth = 128;
let actors = [];
let player: any = null;
let ticks = 0;
let score = 0;
let scene: Scene;
let random: Random;
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let bloomCanvas: HTMLCanvasElement;
let bloomContext: CanvasRenderingContext2D;
let overlayCanvas: HTMLCanvasElement;
let overlayContext: CanvasRenderingContext2D;
let cursorPos = { x: pixelWidth / 2, y: pixelWidth / 2 };
let frameCursorPos = { x: pixelWidth / 2, y: pixelWidth / 2 };
let isClicked = false;

enum Scene {
  title, game, gameover, replay
};

window.onload = () => {
  //debug.enableShowingErrors()
  //debug.initSeedUi(onSeedChanged);
  initCanvases();
  random = new Random();
  sss.init();
  pag.defaultOptions.isMirrorY = true;
  pag.defaultOptions.rotationNum = rotationNum;
  pag.defaultOptions.scale = 2;
  ppe.options.canvas = canvas;
  overlayContext.fillStyle = 'white';
  text.init(overlayContext);
  onSeedChanged(6008729);
  initCursorEvents();
  /*ir.setOptions({
    frameCount: -1,
    isRecordingEventsAsString: true
  });*/
  if (ir.loadFromUrl() === true) {
    beginReplay();
  } else {
    beginTitle();
  }
  update();
};

function beginGame() {
  scene = Scene.game;
  sss.playBgm();
  ir.startRecord();
  if (ir.options.frameCount <= 0) {
    ir.recordInitialStatus(random.getStatus());
  }
  initGameStatus();
}

function initGameStatus() {
  score = ticks = 0;
  actors = [];
  setPlayer();
}

function endGame() {
  if (scene === Scene.gameover || scene === Scene.replay) {
    return;
  }
  scene = Scene.gameover;
  ticks = 0;
  sss.stopBgm();
  ir.saveAsUrl();
}

function beginTitle() {
  scene = Scene.title;
  ticks = 0;
}

function beginReplay() {
  const status = ir.startReplay();
  if (status !== false) {
    if (ir.options.frameCount > 0) {
      setStatus(status);
    } else {
      random.setStatus(status);
      initGameStatus();
    }
    scene = Scene.replay;
  } else {
    beginTitle();
  }
}

function update() {
  requestAnimationFrame(update);
  frameCursorPos.x = cursorPos.x;
  frameCursorPos.y = cursorPos.y;
  context.clearRect(0, 0, 128, 128);
  bloomContext.clearRect(0, 0, 64, 64);
  overlayContext.clearRect(0, 0, 128, 128);
  handleScene();
  sss.update();
  if (random.get01() < 0.015 * Math.sqrt(ticks * 0.01 + 1)) {
    setLaser();
    addScore();
  }
  ppe.update();
  drawBloomParticles();
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
  text.draw(`${score}`, 1, 1);
  ticks++;
}

function handleScene() {
  if (scene !== Scene.game && isClicked) {
    beginGame();
  }
  isClicked = false;
  if (scene === Scene.game) {
    const events = ir.options.isRecordingEventsAsString ?
      ('00' + frameCursorPos.x).slice(-3) + ('00' + frameCursorPos.y).slice(-3) :
      [frameCursorPos.x, frameCursorPos.y];
    if (ir.options.frameCount > 0) {
      ir.record(getStatus(), events);
    } else {
      ir.recordEvents(events);
    }
  }
  if (scene === Scene.gameover) {
    text.draw('GAME OVER', 40, 60);
    if (ticks >= 60) {
      beginTitle();
    }
  }
  if (scene === Scene.title) {
    text.draw('INSTANT REPLAY', 30, 50);
    text.draw('SAMPLE GAME', 40, 80);
    if (ticks >= 120) {
      beginReplay();
    }
  }
  if (scene === Scene.replay) {
    text.draw('REPLAY', 50, 70);
    const events = ir.getEvents();
    if (events !== false) {
      if (ir.options.isRecordingEventsAsString) {
        frameCursorPos.x = Number(events.substr(0, 3));
        frameCursorPos.y = Number(events.substr(3, 3));
      } else {
        frameCursorPos.x = events[0];
        frameCursorPos.y = events[1];
      }
    } else {
      beginTitle();
    }
  }
}

function drawBloomParticles() {
  const pts = ppe.getParticles();
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const r = Math.floor(Math.sqrt(p.color.r) * 255);
    const g = Math.floor(Math.sqrt(p.color.g) * 255);
    const b = Math.floor(Math.sqrt(p.color.b) * 255);
    const a = Math.max(p.color.r, p.color.g, p.color.b) / 3;
    bloomContext.fillStyle = `rgba(${r},${g},${b}, ${a})`;
    bloomContext.fillRect((p.pos.x - p.size) / 2, (p.pos.y - p.size) / 2, p.size, p.size);
  }
}

function setPlayer(status = null) {
  const propNames = ['type', 'pos.x', 'pos.y', 'ppos.x', 'ppos.y', 'angle'];
  if (status == null) {
    player = { type: 'p' };
    player.pos = { x: pixelWidth / 2, y: pixelWidth / 2 };
    player.ppos = { x: pixelWidth / 2, y: pixelWidth / 2 };
    player.angle = -Math.PI / 2;
  } else {
    player = ir.arrayToObject(status, propNames);
  }
  player.pixels = pag.generate([
    ' x',
    'xxxx'
  ]);
  player.update = function () {
    this.pos.x = frameCursorPos.x;
    this.pos.y = frameCursorPos.y;
    const ox = this.pos.x - this.ppos.x;
    const oy = this.pos.y - this.ppos.y;
    if (Math.sqrt(ox * ox + oy * oy) > 1) {
      this.angle = Math.atan2(oy, ox);
    }
    this.ppos.x = this.pos.x;
    this.ppos.y = this.pos.y;
    ppe.emit('j1', this.pos.x, this.pos.y, this.angle + Math.PI);
  };
  player.destroy = function () {
    ppe.emit('e1', this.pos.x, this.pos.y, 0, 3, 3);
    if (scene === Scene.game) {
      sss.play('u1', 4);
    }
    player.isAlive = false;
    endGame();
  };
  player.getStatus = function () {
    return ir.objectToArray(this, propNames);
  };
  actors.push(player);
};

function setLaser(status = null) {
  const propNames = ['type', 'isVertical', 'pos', 'ticks'];
  let laser: any;
  if (status == null) {
    laser = { type: 'l' };
    laser.isVertical = random.get01() > 0.5;
    laser.pos = Math.floor(random.get01() * pixelWidth);
    laser.ticks = 0;
  } else {
    laser = ir.arrayToObject(status, propNames);
  }
  laser.update = function () {
    let w = 0;
    let br = 0;
    if (this.ticks < 20) {
      w = 2 + laser.ticks * 0.2;
      br = this.ticks / 50;
    } else if (this.ticks < 30) {
      w = 20 - (this.ticks - 20);
      br = 1 - (this.ticks - 20) / 20;
    }
    const rg = Math.floor(50 + br * 200);
    const b = Math.floor(200 + br * 50)
    context.fillStyle = `rgb(${rg},${rg},${b})`;
    if (this.isVertical) {
      context.fillRect(this.pos - w / 2, 0, w, pixelWidth);
    } else {
      context.fillRect(0, this.pos - w / 2, pixelWidth, w);
    }
    if (this.ticks === 20) {
      if (scene === Scene.game) {
        sss.play('l1');
        sss.play('s1');
      }
      let a = Math.floor(Math.random() * 2) * Math.PI;
      if (this.isVertical) {
        a += Math.PI / 2;
      }
      for (let i = 0; i < 18; i++) {
        let x, y;
        if (this.isVertical) {
          x = this.pos;
          y = (i - 1) * pixelWidth / 16;
        } else {
          x = (i - 1) * pixelWidth / 16;
          y = this.pos;
        }
        ppe.emit('m1', x, y, a, 1, 0.5, 0.7);
      }
    }
    if (player != null && player.isAlive !== false) {
      let pp = this.isVertical ? player.pos.x : player.pos.y;
      const lw = this.ticks === 20 ? w * 0.4 : w * 1.5;
      if (Math.abs(this.pos - pp) < lw) {
        if (this.ticks === 20) {
          player.destroy();
        } else {
          addScore();
        }
      }
    }
    laser.ticks++;
    if (laser.ticks > 30) {
      laser.isAlive = false;
    }
  };
  laser.getStatus = function () {
    return ir.objectToArray(this, propNames);
  };
  actors.push(laser);
}

function addScore() {
  if (scene === Scene.game || scene === Scene.replay) {
    score++;
  }
}

function drawPixels(actor) {
  if (!actor.hasOwnProperty('pixels')) {
    return;
  }
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

function getStatus() {
  return [ticks, score, random.getStatus(), getActorsStatus()];
}

function setStatus(status) {
  ticks = status[0];
  score = status[1];
  random.setStatus(status[2]);
  setActorsStatus(status[3]);
}

function getActorsStatus() {
  let state = [];
  forEach(actors, a => {
    state.push(a.getStatus());
  });
  return state;
}

function setActorsStatus(state) {
  actors = [];
  forEach(state, s => {
    if (s[0] === 'p') {
      setPlayer(s);
    } else {
      setLaser(s);
    }
  });
}

function onSeedChanged(seed: number) {
  pag.setSeed(seed);
  sss.reset();
  sss.setSeed(seed);
  ppe.setSeed(seed);
  ppe.reset();
  if (scene === Scene.game) {
    sss.playBgm();
  }
}

function initCanvases() {
  canvas = <HTMLCanvasElement>document.getElementById('main');
  canvas.width = canvas.height = pixelWidth;
  ppe.options.canvas = canvas;
  context = canvas.getContext('2d');
  bloomCanvas = <HTMLCanvasElement>document.getElementById('bloom');
  bloomCanvas.width = bloomCanvas.height = pixelWidth / 2;
  bloomContext = bloomCanvas.getContext('2d');
  overlayCanvas = <HTMLCanvasElement>document.getElementById('overlay');
  overlayCanvas.width = canvas.height = pixelWidth;
  overlayContext = overlayCanvas.getContext('2d');
}

function initCursorEvents() {
  document.onmousedown = (e) => {
    onMouseTouchDown(e.pageX, e.pageY);
  };
  document.ontouchstart = (e) => {
    onMouseTouchDown(e.touches[0].pageX, e.touches[0].pageY);
  };
  document.onmousemove = (e) => {
    onMouseTouchMove(e.pageX, e.pageY);
  };
  document.ontouchmove = (e) => {
    e.preventDefault();
    onMouseTouchMove(e.touches[0].pageX, e.touches[0].pageY);
  };
  document.onmouseup = (e) => {
    onMouseTouchUp(e);
  };
  document.ontouchend = (e) => {
    onMouseTouchUp(e);
  };
}

function onMouseTouchDown(x, y) {
  setCursorPos(x, y);
  sss.playEmpty();
  isClicked = true;
}

function onMouseTouchMove(x, y) {
  setCursorPos(x, y);
}

function setCursorPos(x, y) {
  cursorPos.x = clamp(Math.round
    (((x - canvas.offsetLeft) / canvas.clientWidth + 0.5) * pixelWidth),
    0, pixelWidth - 1);
  cursorPos.y = clamp(Math.round
    (((y - canvas.offsetTop) / canvas.clientHeight + 0.5) * pixelWidth),
    0, pixelWidth - 1);
}

function onMouseTouchUp(e) {
}

function forEach(array: any[], func: Function) {
  for (let i = 0; i < array.length; i++) {
    func(array[i]);
  }
}

function clamp(v, min, max) {
  if (v < min) {
    return min;
  } else if (v > max) {
    return max;
  } else {
    return v;
  }
}

class Random {
  x: number;
  y: number;
  z: number;
  w: number;

  setSeed(v: number = -0x7fffffff) {
    if (v === -0x7fffffff) {
      v = Math.floor(Math.random() * 0x7fffffff);
    }
    this.x = v = 1812433253 * (v ^ (v >> 30))
    this.y = v = 1812433253 * (v ^ (v >> 30)) + 1
    this.z = v = 1812433253 * (v ^ (v >> 30)) + 2
    this.w = v = 1812433253 * (v ^ (v >> 30)) + 3;
    return this;
  }

  getInt() {
    var t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    this.w = (this.w ^ (this.w >> 19)) ^ (t ^ (t >> 8));
    return this.w;
  }

  get01() {
    return this.getInt() / 0x7fffffff;
  }

  constructor() {
    this.setSeed();
    this.get01 = this.get01.bind(this);
  }

  propNames = ['x', 'y', 'z', 'w'];

  getStatus() {
    return ir.objectToArray(this, this.propNames);
  }

  setStatus(status) {
    ir.arrayToObject(status, this.propNames, this);
  }
}
