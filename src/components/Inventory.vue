<template>
  <v-container>
    <v-row>
      <span class="title">Inventory</span>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="searchTable"
        append-icon="mdi-search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-col cols="12">
        <v-simple-table fixed-header height="75vh">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left"
                  @click="nameSortUp = !nameSortUp; sortByName = true; updateSort()"
                >
                  Name {{nameSortUp ? '▲' : '▼'}}
                </th>
                <th class="text-left"
                  @click="priceSortUp = !priceSortUp; sortByName = false; updateSort()"
                >
                  Price {{priceSortUp ? '▲' : '▼'}}
                </th>
                <th class="text-left">Add to print</th>
                <th class="text-left">Remove from print</th>
                <th class="text-left">Number to print</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in items">
                <inventory-item
                  v-if="includeItem(item)"
                  :key="item.barcodeId"
                  :item="item"
                />
              </template>
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
        <v-btn :loading="printing" block outlined @click="printBarcodes()">
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
import InventoryItem from './InventoryItem.vue';
import EditItemDialog from './EditItemDialog.vue';

import Table from '../util/Table';
import formatter from '../util/Formatter';
import Barcodes from '../util/Barcodes';

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
    printing: false,
    searchTable: '',
    priceSortUp: false,
    nameSortUp: false,
    sortByName: true,

    formatter,
    Table,
    Barcodes,
  }),
  async created() {
    this.$bus.$on('TableUpdate', (items) => { this.items = items; });
    setTimeout(async () => {
      this.items = await (Table.items);
      console.log('Items', this.items, await (Table.items));
    }, 2000);
  },
  methods: {
    updateSort() {
      console.log('Updating sort', this.sortByName, this.nameSortUp, this.priceSortUp);
      if (this.sortByName) {
        this.items.sort((v1, v2) => {
          if (v1.name > v2.name) {
            return this.nameSortUp ? 1 : -1;
          }

          if (v1.name < v2.name) {
            return this.nameSortUp ? -1 : 1;
          }
          return 0;
        });
      } else {
        this.items.sort((v1, v2) => {
          if (+v1.price > +v2.price) {
            return this.priceSortUp ? 1 : -1;
          }

          if (+v1.price < +v2.price) {
            return this.priceSortUp ? -1 : 1;
          }

          return 0;
        });
      }
    },

    includeItem(item) {
      return (item.name.toLowerCase() + formatter.formatPrice(item.price))
        .includes(this.searchTable.toLowerCase());
    },
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
          await (Table.db.items = this.items);
        }
      }
      this.items = await Table.items;
    },

    async printBarcodes() {
      this.printing = true;
      await Barcodes.print();
      this.printing = false;
    },
  },
  watch: {
    'Table.items': {
      async handler() {
        this.items = await Table.items;
        this.updateSort();
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
