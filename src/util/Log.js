let currentLog = JSON.parse(localStorage.getItem('log') || '[]');
let currentLogLevels = JSON.parse(localStorage.getItem('logLevels') || '[]');

function Log(filename, name, vars, spam) {
  if (currentLogLevels.indexOf('spam') === -1 && spam) {
    return;
  }
  if (currentLog[0] === 'all' || currentLog.indexOf(filename) !== -1) {
    console.groupCollapsed(`${name} (${filename})`);
    Object.keys(vars).forEach(v => console.log(`${v}:`, vars[v]));
    console.groupEnd();
  }
}


window.log = {
  log: Log,
  get files() {
    return currentLog;
  },
  set files(file) {
    if (typeof file === 'string') {
      currentLog = [file];
      localStorage.setItem('log', JSON.stringify(currentLog));
    } else {
      currentLog = file;
      localStorage.setItem('log', JSON.stringify(currentLog));
    }
  },
  get levels() {
    return currentLogLevels;
  },
  set levels(levels) {
    if (typeof levels === 'string') {
      currentLogLevels = [levels];
      localStorage.setItem('logLevels', JSON.stringify(currentLogLevels));
    } else {
      currentLogLevels = levels;
      localStorage.setItem('logLevels', JSON.stringify(currentLogLevels));
    }
  },
};

export default (filename, name, vars, spam) => Log(filename, name, vars, spam);
