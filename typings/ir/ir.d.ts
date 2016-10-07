declare module 'ir' {
  function startRecord();
  function record(status, events);
  function startReplay(): any;
  function getEvents(): any;
  function objectToArray(object: any, propertyNames: string[]): any[];
  function arrayToObject(array: any[], propertyNames: string[], object?: any): any;
  function saveAsUrl();
  function loadFromUrl();
}
