function fromBase128(str) {
  let num = 0;
  str.split('').forEach((v, i) => {
    const place = str.length - i;
    num += (128 ** (place - 1)) * v.charCodeAt(0);
  });
  return num;
}

function toBase128(num) {
  const str = [];
  let newNum = num;
  while (newNum > 128) {
    str.push(String.fromCharCode(newNum % 128));
    newNum = Math.floor(newNum / 128);
  }
  str.push(String.fromCharCode(newNum));
  return str.reverse().join('');
}

export default {
  to: {
    b128: toBase128,
  },
  from: {
    b128: fromBase128,
  },
};
