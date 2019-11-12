let currentLog = JSON.parse(localStorage.getItem('log') || '[]');

function Log(filename, name, vars) {
  if (currentLog[0] === 'all' || currentLog.indexOf(filename) !== -1) {
    console.groupCollapsed(`${name} (${filename})`);
    Object.keys(vars).forEach(v => console.log(`${v}:`, vars[v]));
    console.groupEnd();
  }
}


window.log = {
  log: Log,
  get logFiles() {
    return currentLog;
  },
  set logFiles(file) {
    if (typeof file === 'string') {
      currentLog = [file];
      localStorage.setItem('log', JSON.stringify(currentLog));
    } else {
      currentLog = file;
      localStorage.setItem('log', JSON.stringify(currentLog));
    }
  },
};

export default (...args) => Log(...args);
