<template>
  <v-app>
    <v-content>
      <my-table v-if="page === 'table'" @print="tablePrint" />
      <scan-items ref="scan" v-if="page === 'scan'" @finish="onScanFinish"/>
      <v-btn v-if="page === 'table' " @click="startItems()">
        Scan Items
      </v-btn>
      <v-btn v-if="page === 'table' " @click="setStoreName()">
        Set store name
      </v-btn>
    </v-content>
  </v-app>
</template>

<script>
import JsBarcode from 'jsbarcode';
import MyTable from './components/MyTable.vue';
import ScanItems from './components/ScanItems.vue';
import print from './util/Print';

export default {
  name: 'App',

  components: {
    'my-table': MyTable,
    'scan-items': ScanItems,
  },
  mounted() {
    if (!localStorage.getItem('name') || localStorage.getItem('name') === '') {
      this.setStoreName();
    }
  },
  data: () => ({
    page: 'table',
  }),

  methods: {
    tablePrint(itemList) {
      const items = itemList.map((item) => {
        const div = document.createElement('div');
        div.style.border = '2px dotted grey';
        const price = document.createElement('div');
        price.style.width = '0.7in';
        price.style.overflow = 'wrap';
        price.style.textAlign = 'center';
        price.innerHTML = `$${item.price}<br>${item.name}`;
        const img = document.createElement('img');
        JsBarcode(img, item.barcodeId);

        div.appendChild(price);
        div.appendChild(img);
        return div;
      });
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.flexWrap = 'wrap';
      div.style.flexDirection = 'row';
      div.style.width = '8.5in';
      div.style.overflow = 'wrap';

      items.forEach((item) => {
        div.appendChild(item);
      });
      print(div);
    },

    onScanFinish(items) {
      const receipt = document.createElement('div');
      receipt.style.width = '2.5in';
      receipt.style.border = '2px solid grey';
      receipt.innerHTML = `<div style="text-align: center;">
        Thank You For Shopping at<br>${localStorage.getItem('name')}
      </div><br><br><br>`;
      let totalCost = 0;
      items.forEach((item) => {
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
          <div style="display: flex;">
            <div style="display: flex; width: 70%; text-align: right;">
              Total:
            </div>
            <div style="display: flex; width: 30%; text-align: left;">
              $${totalCost}
            </div>
          </div>
      `;
      receipt.innerHTML += html;
      print(receipt);
      this.page = 'table';
    },
    async startItems() {
      this.page = 'scan';
      await this.$nextTick();
      this.$refs.scan.start();
    },
    setStoreName() {
      const name = prompt('What is the name of your store?');
      localStorage.setItem('name', name);
    },
  },
};
</script>
