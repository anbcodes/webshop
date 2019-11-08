export default {
  formatPrice(number) {
    return `$${parseFloat(number).toFixed(2)}`;
  },

  formatStringForReceipt(str, price) {
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
    console.log(rows, newLastRow);
    return rows.join('\n');
  },
};
