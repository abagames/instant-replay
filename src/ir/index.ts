declare const require: any;
const LZString = require('lz-string');

export let options = {
  frameCount: 180,
};

let statuses: any[];
let events: any[];
let recordingIndex: number;
let replayingIndex: number;

export function startRecord() {
  initStatusesAndEvents();
  recordingIndex = 0;
  replayingIndex = 0;
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
  calcStartingReplayingIndex();
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

function calcStartingReplayingIndex() {
  replayingIndex = recordingIndex + 1;
  if (replayingIndex >= options.frameCount || events[replayingIndex] == null) {
    replayingIndex = 0;
  }
}

export function saveAsUrl() {
  if (events == null || events[0] == null) {
    return false;
  }
  const baseUrl = window.location.href.split('?')[0];
  calcStartingReplayingIndex();
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
    calcStartingReplayingIndex();
    statuses[replayingIndex] = data.st;
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
