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
              <inventory-item
                v-for="item in items"
                :key="item.barcodeId"
                :item="item"
                :numberInPrint="countPrint(item)"
                @addPrint="addToPrint"
                @removePrint="removeFromPrint"
              />
            </tbody>
            <v-container>
              <v-btn icon @click.stop="createItem()">
                <v-icon>
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-container>
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
      :create="true"
      :item="currentItem"
    />
  </v-container>
</template>
<script>
import JsBarcode from 'jsbarcode';

import InventoryItem from './InventoryItem.vue';
import EditItemDialog from './EditItemDialog.vue';

import Table from '../util/Table';
import print from '../util/Print';
import formatter from '../util/Formatter';

export default {
  components: {
    'edit-item-dialog': EditItemDialog,
    'inventory-item': InventoryItem,
  },
  data: () => ({
    items: [],
    currentItem: null,
    editItemDialogOpen: false,
    itemCreate: false,
    Table,
    itemsToPrint: [],
    formatter,
  }),
  async created() {
    this.$bus.$on('TableUpdate', (items) => { this.items = items; });
    setTimeout(async () => {
      this.items = await (Table.items);
      console.log('Items', this.items, await (Table.items));
    }, 2000);
  },
  methods: {
    // async itemUpdated(item) {
    //   this.itemsToPrint = [];
    //   console.log('ITEMS', this.items);
    //   console.log('item', item);
    //   if (item.create) {
    //     let lastId = Math.max(...this.items.map(v => v.barcodeId));
    //     if (lastId === -Infinity) {
    //       lastId = -1;
    //     }
    //     console.log('create item:', { ...item.item, barcodeId: lastId + 1 });
    //     this.items.push({ ...item.item, barcodeId: lastId + 1 });
    //   } else {
    //     this.items.forEach((v, i) => {
    //       console.log('looking for item', v.barcodeId, item.item.barcodeId);
    //       if (v.barcodeId === item.item.barcodeId) {
    //         this.items[i] = item.item;
    //         console.log('found!');
    //       }
    //     });
    //   }
    //   await this.table.set(this.items);
    //   this.items = await this.table.get();
    // },

    createItem() {
      this.currentItem = {
        name: '',
        price: 0,
      };
      this.itemCreate = true;
      this.editItemDialogOpen = true;
    },

    async copyId() {
      const textArea = document.createElement('textarea');
      textArea.value = JSON.stringify(await Table.items);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      window.confirm('Id copied to clipboard');
    },

    async enterId() {
      const text = window.prompt('Id:');
      if (text && text !== '') {
        const yes = window.confirm('The will delete all current Items');
        if (yes) {
          this.items = JSON.parse(text);
          await Table.erase();
          await (Table.items = this.items);
        }
      }
      this.items = await Table.items;
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
  watch: {
    'Table.items': {
      async handler() {
        this.items = await Table.items;
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
