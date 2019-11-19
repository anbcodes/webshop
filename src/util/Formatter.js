import Log from './Log';

export default {
  /**
   * formats a price as a number to a two digit float prefixed with a $
   * @param {Float} price
   */
  formatPrice(price) {
    const formatted = `$${parseFloat(price).toFixed(2)}`;
    Log(__filename, 'Formatted price', { price, formatted }, true);
    return formatted;
  },

  /**
   * A function the formates a string to a fixed length of 40 characters
   * @param {String} str text on the left side and it will wrap
   * @param {Float} price text on the right side
   */
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
