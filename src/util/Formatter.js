export default {
  formatPrice(number) {
    return `$${parseFloat(number).toFixed(2)}`;
  },

  formatStringForReceipt(str, price) {
    const strList = str.split(' ');
    let currentStr = '';
    const rows = [];
    strList.forEach((item) => {
      if ((currentStr + item).length < 25) {
        currentStr += item;
      } else {
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
    console.log(newLastRow);
    return rows.join('\n');
  },
};
