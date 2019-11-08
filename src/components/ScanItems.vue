<template>
  <v-container>
    <v-row style="max-height: 480px">
      <div ref="video" style="max-height: 480px; max-width: 640px;">
      </div>
    </v-row>
    <v-row style="max-width: 2in">
      <v-container>
        <v-row v-for="(item, i) in currentItems" :key="i">
          <v-col cols="10" class="text-right">
            {{item.name}}
          </v-col>
          <v-col cols="2" class="text-left">
            ${{item.price}}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="10" class="text-right">
            Total:
          </v-col>
          <v-col cols="2" class="text-left">
            {{formatter.formatPrice(total)}}
          </v-col>
        </v-row>
      </v-container>
    </v-row>
    <v-row>
      <v-btn @click="print">
        Print receipt
      </v-btn>
      <v-btn @click="email">
        Email receipt
      </v-btn>
    </v-row>
  </v-container>
</template>
<script>
import Table from '../util/Table';
import Scanner from '../util/Scanner';
import formatter from '../util/Formatter';
import print from '../util/Print';

export default {
  data: () => ({
    currentItems: [],
    items: [],
    table: new Table(),
    currentCallback: null,
    detectionInLastSecond: false,
    formatter,
  }),
  computed: {
    total() {
      let total = 0;
      this.currentItems.forEach((item) => {
        total += +item.price;
      });
      return total;
    },
  },
  methods: {
    async start() {
      this.items = await this.table.get();
      Scanner.onCode(code => this.onDetection(code));
      Scanner.start(this.$refs.video, 1000);
    },
    onDetection(code) {
      console.log(code);
      // eslint-disable-next-line
      const beep = new Audio('data:audio/wav;base64,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');
      beep.play();
      this.currentItems
        .push(this.items
          .filter(item => item.barcodeId === parseInt(code, 36))[0]);
      this.currentItems = [...this.currentItems];
    },

    finish() {
      Scanner.stop();
      this.$emit('finish', this.currentItems);
    },


    print() {
      this.finish();
      const html = this.getReceiptHtml();
      print(html);
    },

    email() {
      this.finish();
      const text = this.getReceiptPlainText();
      const link = document.createElement('a');
      const email = window.prompt('Enter email');
      link.href = `mailto:${email}?subject=Receipt from ${localStorage.getItem('name')}&body=${encodeURIComponent(text)}`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => { link.remove(); }, 1000);
    },

    getReceiptHtml() {
      const receipt = document.createElement('div');
      receipt.style.width = '2.5in';
      receipt.style.border = '2px solid grey';
      receipt.innerHTML = `<div style="text-align: center;">
        Thank You For Shopping at<br>${localStorage.getItem('name')}
      </div><br><br><br>`;
      let totalCost = 0;
      this.currentItems.forEach((item) => {
        totalCost += +item.price;
        const html = `
          <div style="display: flex;">
            <div style="display: flex; width: 70%; text-align: right;">
              ${item.name}
            </div>
            <div style="display: flex; width: 30%; text-align: left;">
              $${item.price}
            </div>
          </div>
        `;
        receipt.innerHTML += html;
      });

      const html = `
          <br>
          <br>
          <div style="display: flex;">
            <div style="display: flex; width: 70%; text-align: right;">
              Total:
            </div>
            <div style="display: flex; width: 30%; text-align: left;">
              ${formatter.formatPrice(totalCost)}
            </div>
          </div>
      `;
      receipt.innerHTML += html;
      return receipt;
    },
    getReceiptPlainText() {
      let receipt = `Thank You For Shopping at ${localStorage.getItem('name')}\nHere is your receipt:\n`;
      let totalCost = 0;
      this.currentItems.forEach((item) => {
        totalCost += +item.price;
        receipt += `${formatter.formatStringForReceipt(item.name, item.price)}\n`;
      });

      const text = `\n\n\n${formatter.formatStringForReceipt('Total:', totalCost)}`;
      receipt += text;
      console.log('RECEIPT', receipt);
      return receipt;
    },
  },
};
</script>
