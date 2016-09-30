declare const require: any;
const LZString = require('lz-string');

export let options = {
  frameCount: 180,
};

let statusAndEvents: any[];
let recordingIndex: number;
let replayingIndex: number;

export function startRecord() {
  statusAndEvents = [];
  for (let i = 0; i < options.frameCount; i++) {
    statusAndEvents.push(null);
  }
  recordingIndex = 0;
  replayingIndex = 0;
}

export function record(status, events) {
  statusAndEvents[recordingIndex] = { status, events };
  recordingIndex++;
  if (recordingIndex >= options.frameCount) {
    recordingIndex = 0;
  }
}

export function startReplay() {
  if (statusAndEvents == null || statusAndEvents[0] == null) {
    return false;
  }
  replayingIndex = recordingIndex + 1;
  if (replayingIndex >= options.frameCount || statusAndEvents[replayingIndex] == null) {
    replayingIndex = 0;
  }
  return statusAndEvents[replayingIndex].status;
}

export function getEvents() {
  if (replayingIndex === recordingIndex) {
    return false;
  }
  let e = statusAndEvents[replayingIndex].events;
  replayingIndex++;
  if (replayingIndex >= options.frameCount) {
    replayingIndex = 0;
  }
  return e;
}

export function saveAsUrl() {
  if (statusAndEvents == null || statusAndEvents[0] == null) {
    return false;
  }
  const baseUrl = window.location.href.split('?')[0];
  const encDataStr = LZString.compressToEncodedURIComponent(JSON.stringify(
    { rec: statusAndEvents, idx: recordingIndex }
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
    statusAndEvents = data.rec;
    recordingIndex = data.idx;
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
