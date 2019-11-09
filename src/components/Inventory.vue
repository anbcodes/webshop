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
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
