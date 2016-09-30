import * as sss from 'sss';
import * as pag from 'pag';
import * as ppe from 'ppe';
import * as ir from '../ir/index';
import * as debug from './debug';
import * as text from './text';

let isInGame = false;
let titleTicks = 0;
let gameoverTicks = 0;
const rotationNum = 16;
const pixelWidth = 128;
const titleDuration = 120;
let actors = [];
let player: any = null;
let ticks = 0;
let score = 0;
let canvas: HTMLCanvasElement;
let bloomCanvas: HTMLCanvasElement;
let overlayCanvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let bloomContext: CanvasRenderingContext2D;
let overlayContext: CanvasRenderingContext2D;
let cursorPos = { x: pixelWidth / 2, y: pixelWidth / 2 };
let frameCursorPos = { x: pixelWidth / 2, y: pixelWidth / 2 };
let random: Random;

window.onload = () => {
  sss.init();
  debug.enableShowingErrors()
  debug.initSeedUi(onSeedChanged);
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
  pag.defaultOptions.isMirrorY = true;
  pag.defaultOptions.rotationNum = rotationNum;
  pag.defaultOptions.scale = 2;
  random = new Random();
  overlayContext.fillStyle = 'white';
  text.init(overlayContext);
  setPlayer();
  player.isAlive = false;
  beginTitle();
  if (ir.loadFromUrl() === true) {
    beginReplay();
  }
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
  update();
};

function onMouseTouchDown(x, y) {
  setCursorPos(x, y);
  handleTouchStarted();
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

function handleTouchStarted() {
  sss.playEmpty();
  if (!isInGame && ticks > 0) {
    beginGame();
  }
}

function beginGame() {
  isInGame = true;
  titleTicks = gameoverTicks = 0;
  score = ticks = 0;
  sss.playBgm();
  ir.startRecord();
  actors = [];
  setPlayer();
}

function endGame() {
  if (!isInGame) {
    return;
  }
  isInGame = false;
  gameoverTicks = 60;
  sss.stopBgm();
}

function beginTitle() {
  ir.saveAsUrl();
  titleTicks = 1;
  ticks = 0;
}

function beginReplay() {
  titleTicks = titleDuration;
}

function update() {
  requestAnimationFrame(update);
  frameCursorPos.x = cursorPos.x;
  frameCursorPos.y = cursorPos.y;
  if (isInGame || gameoverTicks > 0) {
    ir.record(getStatus(), [frameCursorPos.x, frameCursorPos.y]);
  }
  context.clearRect(0, 0, 128, 128);
  bloomContext.clearRect(0, 0, 64, 64);
  overlayContext.clearRect(0, 0, 128, 128);
  if (titleTicks > 0) {
    if (titleTicks < 120) {
      text.draw('INSTANT REPLAY', 30, 50);
      text.draw('SAMPLE GAME', 40, 80);
    } else if (titleTicks === titleDuration) {
      const status = ir.startReplay();
      if (status !== false) {
        setStatus(status);
      } else {
        beginTitle();
      }
    }
    if (titleTicks >= titleDuration) {
      text.draw('REPLAY', 50, 70);
      const events = ir.getEvents();
      if (events !== false) {
        frameCursorPos.x = events[0];
        frameCursorPos.y = events[1];
      } else {
        beginTitle();
      }
    }
    titleTicks++;
  }
  sss.update();
  if (random.get01() < 0.01 * Math.sqrt(ticks * 0.01 + 1)) {
    setLaser();
  }
  ppe.update();
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
  text.draw(`${score}`, 1, 1);
  if (gameoverTicks > 0) {
    text.draw('GAME OVER', 40, 60);
    gameoverTicks--;
    if (gameoverTicks <= 0) {
      beginTitle();
    }
  }
  ticks++;
};

function setPlayer(status = null) {
  player = {};
  player.pixels = pag.generate([
    ' x',
    'xxxx'
  ]);
  if (status == null) {
    player.pos = { x: pixelWidth / 2, y: pixelWidth / 2 };
    player.ppos = { x: pixelWidth / 2, y: pixelWidth / 2 };
    player.angle = -Math.PI / 2;
  } else {
    player.pos = { x: status[1], y: status[2] };
    player.ppos = { x: status[3], y: status[4] };
    player.angle = status[5];
  }
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
    sss.play('u1', 5);
    player.isAlive = false;
    endGame();
  };
  player.getStatus = function () {
    return ['p', this.pos.x, this.pos.y, this.ppos.x, this.ppos.y, this.angle];
  };
  player.priority = 0;
  actors.push(player);
};

function setLaser(status = null) {
  const laser: any = {};
  if (status == null) {
    laser.isVertical = random.get01() > 0.5;
    laser.pos = Math.floor(random.get01() * pixelWidth);
    laser.ticks = 0;
  } else {
    laser.isVertical = status[1];
    laser.pos = status[2];
    laser.ticks = status[3];
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
      if (isInGame) {
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
      if (player.isAlive !== false) {
        let pp = this.isVertical ? player.pos.x : player.pos.y;
        if (Math.abs(this.pos - pp) < 10) {
          player.destroy();
        }
      }
    }
    laser.ticks++;
    if (laser.ticks > 30) {
      laser.isAlive = false;
    }
  };
  laser.getStatus = function () {
    return ['l', this.isVertical, this.pos, this.ticks];
  };
  laser.priority = 1;
  actors.push(laser);
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
  if (isInGame) {
    sss.playBgm();
  }
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

function wrap(v, min, max) {
  const w = max - min;
  const o = v - min;
  if (o >= 0) {
    return o % w + min;
  } else {
    return w + o % w + min;
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

  getStatus() {
    return [this.x, this.y, this.z, this.w];
  }

  setStatus(status) {
    this.x = status[0];
    this.y = status[1];
    this.z = status[2];
    this.w = status[3];
  }
}
