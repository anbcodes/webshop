<template>
  <v-container>
    <v-simple-table fixed-header height="100vh">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Price</th>
            <th class="text-left">+ to print</th>
            <th class="text-left">- from print</th>
            <th class="text-left"># in print</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.barcodeId" @click="editItem(item)">
            <td>{{ item.name }}</td>
            <td>{{ item.price }}</td>
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
    <edit-item-dialog
      v-model="editItemDialogOpen"
      :create="itemCreate"
      :item="currentItem"
      @delete="deleteItem"
      @itemUpdate="itemUpdated"
    />
    <v-btn @click="copyId()">
      Create Id
    </v-btn>
    <v-btn @click="enterId()">
      Enter Id
    </v-btn>
    <v-btn @click="$emit('print', toPrint)">
      Print all
    </v-btn>
  </v-container>
</template>
<script>
import Table from '../util/Table';
import EditItemDialog from './EditItemDialog.vue';

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
    toPrint: [],
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
      this.toPrint = [];
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
      if (this.toPrint.indexOf(item) !== -1) {
        this.toPrint.splice(this.toPrint.indexOf(item), 1);
      }
      this.$forceUpdate();
    },

    addToPrint(item) {
      this.toPrint.push(item);
    },

    countPrint(item) {
      let count = 0;
      console.log('toPrint', this.toPrint);
      this.toPrint.forEach((i) => {
        if (i === item) {
          count += 1;
        }
      });
      return count;
    },
  },
};
</script>
