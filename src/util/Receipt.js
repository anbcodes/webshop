import printHTML from './PrintHTML';
import formatter from './Formatter';

export default class Receipt {
  constructor(name) {
    this.name = name;
    this.id = +new Date();
    this.items = [];
  }

  add(item, number = 1) {
    this.items.push({ ...item, number, id: +new Date() });
  }

  remove(item) {
    this.items = this.items
      .filter(v => v.id !== item.id);
  }

  async print() {
    const receipt = document.createElement('div');
    receipt.style.width = '2.5in';
    receipt.style.padding = '0.1in';
    receipt.style.fontFamily = 'monospace';
    receipt.style.border = '2px solid grey';
    receipt.innerHTML = `<div style="text-align: center;">
      Thank You For Shopping at<br>${localStorage.getItem('name')}
    </div><br><br><br>`;
    let totalCost = 0;

    this.items.forEach((item) => {
      totalCost += +item.price * item.number;

      receipt.innerHTML += this.receiptRowHTML({
        row: [item.name, `${formatter.formatPrice(item.price)}`],
        width: ['60%', '40%'],
        textAlign: ['left', 'right'],
        wrap: true,
      });

      if (item.number > 1) {
        receipt.innerHTML += this.receiptRowHTML({
          row: [`---- x${item.number}`, `${formatter.formatPrice(item.price * item.number)}`],
          width: ['60%', '40%'],
          textAlign: ['left', 'right'],
        });
      }
      receipt.innerHTML += '<br>';
    });
    receipt.innerHTML += '<br>';
    receipt.innerHTML += '<br>';
    receipt.innerHTML += this.receiptRowHTML({
      row: ['Total:', formatter.formatPrice(totalCost)],
      width: ['70%', '30%'],
      textAlign: ['left', 'right'],
    });
    receipt.innerHTML += '<br>';
    const dateOptions = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    };

    const date = new Date().toLocaleString(undefined, dateOptions);

    receipt.innerHTML += this.receiptRowHTML({
      row: ['Date:', date],
      width: ['20%', '80%'],
      textAlign: ['left', 'left'],
    });
    receipt.innerHTML += '<br>';
    receipt.innerHTML += '<br>';
    receipt.innerHTML += this.receiptRowHTML({
      row: ['ID:', this.id],
      width: ['10%', '90%'],
      textAlign: ['left', 'left'],
    });
    await printHTML(receipt);
  }

  receiptRowHTML({
    row, width = ['60%', '40%'], textAlign = ['left', 'left'], wrap,
  }) {
    return `
      <div style="display: flex; margin-top: 0.07in;">
        <div style="display: flex; width: ${width[0]}; text-align: ${textAlign[0]}; ${wrap ? 'text-overflow: wrap;' : ''}">
          ${row[0]}
        </div>
        <div style="display: flex; width: ${width[1]}; text-align: ${textAlign[1]};">
          ${row[1]}
        </div>
      </div>
    `;
  }

  getEmailText() {
    let receipt = `Thank You For Shopping at ${localStorage.getItem('name')}\nHere is your receipt:\n\n`;
    let totalCost = 0;
    this.items.forEach((item) => {
      totalCost += +item.price * item.number;
      receipt += `${formatter.formatStringForReceipt(item.name, item.price)}\n`;
      if (item.number > 1) {
        receipt
          += `${formatter.formatStringForReceipt(
            `---- x${item.number}`,
            +item.price * item.number,
          )}\n`;
      }
      receipt += '\n';
    });

    const text = `\n\n${formatter.formatStringForReceipt('Total:', totalCost)}`;
    receipt += text;

    const dateOptions = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    };

    const date = new Date().toLocaleString(undefined, dateOptions);

    const dateText = `\n\nDate:  ${date}\n\n`;

    receipt += dateText;

    receipt += `ID: ${this.id}`;

    console.log('RECEIPT', receipt);
    return receipt;
  }
}
