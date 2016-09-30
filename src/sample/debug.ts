export function initSeedUi(onSeedChanged: Function) {
  const p = document.createElement('p');
  p.innerHTML = '<button id="change">change</button>' +
    'random seed: <input type="number" id="seed" value="0"></input>' +
    '<button id="set">set</button>';
  document.getElementsByTagName('body')[0].appendChild(p);
  const changeElm = document.getElementById('change');
  const seedElm = <HTMLInputElement>document.getElementById('seed');
  const setElm = document.getElementById('set');
  changeElm.onclick = function () {
    seedElm.value = Math.floor(Math.random() * 9999999).toString();
    onSeedChanging();
  };
  setElm.onclick = onSeedChanging;
  function onSeedChanging() {
    onSeedChanged(Number(seedElm.value));
  }
}

export function enableShowingErrors() {
  const pre = document.createElement('pre');
  document.getElementsByTagName('body')[0].appendChild(pre);
  window.addEventListener('error', function (error: any) {
    var message = [error.filename, '@', error.lineno, ':\n', error.message].join('');
    pre.textContent += '\n' + message;
    return false;
  });
}
