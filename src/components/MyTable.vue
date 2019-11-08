<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-simple-table fixed-header height="75vh">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Price</th>
                <th class="text-left">Add to print</th>
                <th class="text-left">Remove from print</th>
                <th class="text-left">Number to print</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.barcodeId" @click="editItem(item)">
                <td>{{ item.name }}</td>
                <td>{{ formatter.formatPrice(item.price) }}</td>
                <td>
                  <v-btn icon small @click.stop="addToPrint(item)">
                    <v-icon>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </td>
                <td>
                  <v-btn
                    icon
                    small
                    @click.stop="removeFromPrint(item)"
                  >
                    <v-icon>
                      mdi-minus
                    </v-icon>
                  </v-btn>
                </td>
                <td>
                  {{countPrint(item)}}
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <v-btn icon small @click.stop="createItem()">
                    <v-icon>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </td>
              </tr>

            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-btn block outlined @click="copyId()">
          Create Id
        </v-btn>
      </v-col>
      <v-col cols="2">
        <v-btn block outlined @click="enterId()">
          Enter Id
        </v-btn>
      </v-col>
      <v-col cols="2">
        <v-btn block outlined @click="printBarcodes()">
          Print all
        </v-btn>
      </v-col>
    </v-row>
    <edit-item-dialog
      v-model="editItemDialogOpen"
      :create="itemCreate"
      :item="currentItem"
      @delete="deleteItem"
      @itemUpdate="itemUpdated"
    />
  </v-container>
</template>
<script>
import JsBarcode from 'jsbarcode';

import Table from '../util/Table';
import EditItemDialog from './EditItemDialog.vue';
import print from '../util/Print';
import formatter from '../util/Formatter';

export default {
  components: {
    'edit-item-dialog': EditItemDialog,
  },
  data: () => ({
    items: [],
    currentItem: null,
    editItemDialogOpen: false,
    itemCreate: false,
    table: new Table(),
    itemsToPrint: [],
    formatter,
  }),
  async mounted() {
    this.items = (await this.table.get()) || [];
  },

  methods: {
    async deleteItem(item) {
      this.items.forEach((v, i) => {
        console.log('looking for item', v.barcodeId, item.barcodeId);
        if (v.barcodeId === item.barcodeId) {
          this.items.splice(i, 1);
          console.log('found!');
        }
      });
      await this.table.set(this.items);
      this.items = await this.table.get();
    },
    async itemUpdated(item) {
      this.itemsToPrint = [];
      console.log('ITEMS', this.items);
      console.log('item', item);
      if (item.create) {
        let lastId = Math.max(...this.items.map(v => v.barcodeId));
        if (lastId === -Infinity) {
          lastId = -1;
        }
        console.log('create item:', { ...item.item, barcodeId: lastId + 1 });
        this.items.push({ ...item.item, barcodeId: lastId + 1 });
      } else {
        this.items.forEach((v, i) => {
          console.log('looking for item', v.barcodeId, item.item.barcodeId);
          if (v.barcodeId === item.item.barcodeId) {
            this.items[i] = item.item;
            console.log('found!');
          }
        });
      }
      await this.table.set(this.items);
      this.items = await this.table.get();
    },

    createItem() {
      this.currentItem = {
        name: '',
        price: 0,
      };
      this.itemCreate = true;
      this.editItemDialogOpen = true;
    },

    editItem(item) {
      this.currentItem = item;
      this.itemCreate = false;
      this.editItemDialogOpen = true;
    },

    copyId() {
      const textArea = document.createElement('textarea');
      textArea.value = JSON.stringify(this.items);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      window.confirm('Id copied to clipboard');
    },

    async enterId() {
      const text = window.prompt('Id:');
      if (text && text !== '') {
        const yes = window.confirm('Deleting all current Items');
        if (yes) {
          this.items = JSON.parse(text);
        }
      }
      await this.table.erase();
      await this.table.set(this.items);
      this.items = await this.table.get(this.items);
    },

    removeFromPrint(item) {
      if (this.itemsToPrint.indexOf(item) !== -1) {
        this.itemsToPrint.splice(this.itemsToPrint.indexOf(item), 1);
      }
      this.$forceUpdate();
    },

    addToPrint(item) {
      this.itemsToPrint.push(item);
    },

    countPrint(item) {
      let count = 0;
      this.itemsToPrint.forEach((i) => {
        if (i === item) {
          count += 1;
        }
      });
      return count;
    },

    printBarcodes() {
      const items = this.itemsToPrint.map((item) => {
        const div = document.createElement('div');
        div.style.border = '2px dotted grey';
        const price = document.createElement('div');
        price.style.width = '1.2in';
        price.style.textOverflow = 'wrap';
        price.style.textAlign = 'center';

        price.innerHTML = `${item.name} ($${item.price})`;
        const img = document.createElement('img');
        JsBarcode(img, item.barcodeId.toString(36), {
          displayValue: false,
        });
        div.appendChild(img);
        div.appendChild(price);
        return div;
      });
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.flexWrap = 'wrap';
      div.style.flexDirection = 'row';
      div.style.width = '8.5in';
      div.style.textOverflow = 'wrap';
      items.forEach((item) => {
        div.appendChild(item);
      });
      print(div);
    },
  },
};
</script>
