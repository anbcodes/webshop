export default function (name, vars) {
  console.groupCollapsed(name);
  Object.keys(vars).forEach(v => console.log(`${v}:`, vars[v]));
  console.groupEnd();
}
