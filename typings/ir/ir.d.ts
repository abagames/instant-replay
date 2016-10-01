declare module 'ir' {
  function startRecord();
  function record(status, events);
  function startReplay();
  function getEvents();
  function saveAsUrl();
  function loadFromUrl();
}
