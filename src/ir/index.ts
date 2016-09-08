export let options = {
  frameCount: 180,
};

let statusAndEvents = times(options.frameCount, () => null);
let recordingIndex = 0;
let replayingIndex = 0;

export function record(status, events) {
  statusAndEvents[recordingIndex] = { status, events };
  recordingIndex++;
  if (recordingIndex >= options.frameCount) {
    recordingIndex = 0;
  }
}

export function startReplay() {
  replayingIndex = recordingIndex + 1;
  if (replayingIndex >= options.frameCount || statusAndEvents[replayingIndex] == null) {
    replayingIndex = 0;
  }
  return statusAndEvents[replayingIndex].status;
}

export function getEvents() {
  if (replayingIndex === recordingIndex) {
    return null;
  }
  let e = statusAndEvents[replayingIndex].events;
  replayingIndex++;
  if (replayingIndex >= options.frameCount) {
    replayingIndex = 0;
  }
  return e;
}

function times(n, fn) {
  const v = [];
  for (let i = 0; i < n; i++) {
    v.push(fn());
  }
  return v;
}