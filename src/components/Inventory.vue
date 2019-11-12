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
                  @click="Table.updateSort('name')"
                >
                  Name {{Table.sortBy === 'name' ? (Table.sortUp ? '▲' : '▼') : ''}}
                </th>
                <th class="text-left"
                  @click="Table.updateSort('price')"
                >
                  Price {{Table.sortBy === 'price' ? (Table.sortUp ? '▲' : '▼') : ''}}
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
import Log from '../util/Log';


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

    formatter,
    Table,
    Barcodes,
  }),
  async created() {
    this.$bus.$on('TableUpdate', (items) => { this.items = items; });
    this.items = await (Table.items);
    Log(__filename, 'Inventory.vue created', { items: this.items, this: this });
  },
  methods: {
    includeItem(item) {
      const includes = (item.name.toLowerCase() + formatter.formatPrice(item.price))
        .includes(this.searchTable.toLowerCase());
      Log(__filename, 'Checking if search contains item', {
        item, includes, search: this.searchTable, items: this.items,
      });
      return includes;
    },
    createItem() {
      this.currentItem = {
        name: '',
        price: 0,
      };
      this.itemCreate = true;
      this.editItemDialogOpen = true;
      Log(__filename, 'Creating Item');
    },

    async copyId() {
      const textArea = document.createElement('textarea');
      textArea.value = JSON.stringify(await Table.items);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      window.alert('Id copied to clipboard');
      Log(__filename, 'Copied ID', { textArea, ID: textArea.value });
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
      Log(__filename, 'Entered ID', { ID: text, items: this.items });
    },

    async printBarcodes() {
      this.printing = true;
      await Barcodes.print();
      this.printing = false;
      Log(__filename, 'Printed barcodes');
    },
  },
  watch: {
    'Table.items': {
      async handler() {
        this.items = await Table.items;
        Log(__filename, 'Table.items updated', { items: this.items }, true);
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
