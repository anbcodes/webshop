import Log from './Log';

export default {
  formatPrice(number) {
    const formatted = `$${parseFloat(number).toFixed(2)}`;
    Log(__filename, 'Formatted price', { number, formatted }, true);
    return formatted;
  },

  formatStringForReceipt(str, price) {
    // TO-LONG
    const strList = str.split(' ');
    let currentStr = '';
    const rows = [];
    strList.forEach((item, i) => {
      currentStr += item;
      if ((currentStr + (strList[i + 1] || 0)).length >= 25) {
        rows.push(currentStr);
        currentStr = '';
      }
    });
    if (currentStr) {
      rows.push(currentStr);
    }
    const lastRow = rows.slice(-1)[0];
    const newLastRow = lastRow + ' '.repeat(40 - lastRow.length - this.formatPrice(price).length) + this.formatPrice(price);
    rows[rows.length - 1] = newLastRow;
    Log(__filename, 'formated string for receipt', {
      str, price, rows, newLastRow,
    }, true);
    return rows.join('\n');
  },
};
