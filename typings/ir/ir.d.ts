declare module 'ir' {
  function startRecord();
  function record(status, events);
  function recordInitialStatus(status);
  function recordEvents(events);
  function startReplay(): any;
  function getEvents(): any;
  function objectToArray(object: any, propertyNames: string[]): any[];
  function arrayToObject(array: any[], propertyNames: string[], object?: any): any;
  function saveAsUrl();
  function loadFromUrl();
  function setOptions(options: Options);

  const options: Options;

  interface Options {
    frameCount?: number;
    isRecordingEventsAsString?: boolean;
    maxUrlLength?: number;
    version?: string;
  }
}
