declare const require: any;
const LZString = require('lz-string');

export let options = {
  frameCount: 180
};

let statuses: any[];
let events: any[];
let recordingIndex: number;
let replayingIndex: number;

export function startRecord() {
  initStatusesAndEvents();
  recordingIndex = replayingIndex = 0;
}

function initStatusesAndEvents() {
  statuses = [];
  events = [];
  for (let i = 0; i < options.frameCount; i++) {
    statuses.push(null);
    events.push(null);
  }
}

export function record(status, _events) {
  statuses[recordingIndex] = status;
  events[recordingIndex] = _events;
  recordingIndex++;
  if (recordingIndex >= options.frameCount) {
    recordingIndex = 0;
  }
}

export function startReplay() {
  if (events == null || events[0] == null) {
    return false;
  }
  calcStartingReplayIndex();
  return statuses[replayingIndex];
}

export function getEvents() {
  if (replayingIndex === recordingIndex) {
    return false;
  }
  let e = events[replayingIndex];
  replayingIndex++;
  if (replayingIndex >= options.frameCount) {
    replayingIndex = 0;
  }
  return e;
}

function calcStartingReplayIndex() {
  replayingIndex = recordingIndex + 1;
  if (replayingIndex >= options.frameCount || events[replayingIndex] == null) {
    replayingIndex = 0;
  }
}

export function objectToArray(object: any, propertyNames: string[]) {
  let array = [];
  for (let i = 0; i < propertyNames.length; i++) {
    const ps = propertyNames[i].split('.');
    let o = object;
    for (let j = 0; j < ps.length; j++) {
      o = o[ps[j]];
    }
    array.push(o);
  }
  return array;
}

export function arrayToObject(array: any[], propertyNames: string[], object: any = {}) {
  for (let i = 0; i < propertyNames.length; i++) {
    const ps = propertyNames[i].split('.');
    let o = object;
    for (let j = 0; j < ps.length; j++) {
      if (j < ps.length - 1) {
        o = o[ps[j]] = {};
      } else {
        o[ps[j]] = array[i];
      }
    }
  }
  return object;
}

export function saveAsUrl() {
  if (events == null || events[0] == null) {
    return false;
  }
  const baseUrl = window.location.href.split('?')[0];
  calcStartingReplayIndex();
  const encDataStr = LZString.compressToEncodedURIComponent(JSON.stringify(
    { st: statuses[replayingIndex], ev: events, idx: recordingIndex }
  ));
  const url = `${baseUrl}?d=${encDataStr}`;
  try {
    window.history.replaceState({}, '', url);
  } catch (e) {
    console.log(e);
    return false;
  }
}

export function loadFromUrl() {
  const query = window.location.search.substring(1);
  if (query == null) {
    return false;
  }
  let params = query.split('&');
  let encDataStr: string;
  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    const pair = param.split('=');
    if (pair[0] === 'd') {
      encDataStr = pair[1];
    }
  }
  if (encDataStr == null) {
    return false;
  }
  try {
    const data = JSON.parse(LZString.decompressFromEncodedURIComponent(encDataStr));
    initStatusesAndEvents();
    recordingIndex = data.idx;
    events = data.ev;
    calcStartingReplayIndex();
    statuses[replayingIndex] = data.st;
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
