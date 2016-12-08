import * as LZString from 'lz-string';

export let options = {
  frameCount: 180,
  isRecordingEventsAsString: false,
  maxUrlLength: 2000
};

let statuses: any[];
let events: any[];
let recordingIndex: number;
let replayingIndex: number;

export function setOptions(_options) {
  options = _options;
}

export function startRecord() {
  initStatusesAndEvents();
  recordingIndex = replayingIndex = 0;
}

function initStatusesAndEvents() {
  statuses = [];
  events = [];
  if (options.frameCount > 0) {
    for (let i = 0; i < options.frameCount; i++) {
      statuses.push(null);
      events.push(null);
    }
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

export function recordInitialStatus(status) {
  statuses.push(status);
}

export function recordEvents(_events) {
  events.push(_events);
}

export function startReplay() {
  if (events == null || events[0] == null) {
    return false;
  }
  calcStartingReplayIndex();
  return statuses[replayingIndex];
}

function calcStartingReplayIndex() {
  if (options.frameCount > 0) {
    replayingIndex = recordingIndex + 1;
    if (replayingIndex >= options.frameCount || events[replayingIndex] == null) {
      replayingIndex = 0;
    }
  } else {
    replayingIndex = 0;
  }
}

export function getEvents() {
  return options.frameCount > 0 ? getEventsFrameCount() : getEventsAllFrames();
}

function getEventsFrameCount() {
  if (replayingIndex === recordingIndex) {
    return false;
  }
  const e = events[replayingIndex];
  replayingIndex++;
  if (replayingIndex >= options.frameCount) {
    replayingIndex = 0;
  }
  return e;
}

function getEventsAllFrames() {
  if (replayingIndex >= events.length) {
    return false;
  }
  const e = events[replayingIndex];
  replayingIndex++;
  return e;
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
        if (o[ps[j]] == null) {
          o[ps[j]] = {};
        }
        o = o[ps[j]];
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
  const data: any = { st: statuses[replayingIndex] };
  if (options.frameCount > 0) {
    data.idx = recordingIndex;
  }
  if (!options.isRecordingEventsAsString) {
    data.ev = events;
  } else {
    data.esl = events[0].length;
  }
  const encDataStr = LZString.compressToEncodedURIComponent(JSON.stringify(data));
  let url = `${baseUrl}?d=${encDataStr}`;
  if (options.isRecordingEventsAsString) {
    const eventsDataStr = LZString.compressToEncodedURIComponent(events.join(''));
    url += `&e=${eventsDataStr}`;
  }
  if (url.length > options.maxUrlLength) {
    console.log('too long to record. url length: ' + url.length);
    return false;
  }
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
  let eventsDataStr: string;
  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    const pair = param.split('=');
    if (pair[0] === 'd') {
      encDataStr = pair[1];
    }
    if (pair[0] === 'e') {
      eventsDataStr = pair[1];
    }
  }
  if (encDataStr == null) {
    return false;
  }
  try {
    const data = JSON.parse(LZString.decompressFromEncodedURIComponent(encDataStr));
    initStatusesAndEvents();
    if (options.frameCount > 0) {
      recordingIndex = data.idx;
    }
    if (data.ev != null) {
      events = data.ev;
    }
    if (eventsDataStr != null) {
      const eventsStr = LZString.decompressFromEncodedURIComponent(eventsDataStr);
      events = eventsStr.match(new RegExp(`.{1,${data.esl}}`, 'g'));
    }
    calcStartingReplayIndex();
    statuses[replayingIndex] = data.st;
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
