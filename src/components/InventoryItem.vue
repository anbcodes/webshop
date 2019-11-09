<template>
  <tr @click="edit">
    <td>{{ item.name }}</td>
    <td>{{ formatter.formatPrice(item.price) }}</td>
    <td>
      <v-btn icon @click.stop="Barcodes.add(item)">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </td>
    <td>
      <v-btn icon @click.stop="Barcodes.remove(item)">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </td>
    <td>{{Barcodes.count(item)}}</td>
    <edit-item-dialog
      v-model="editItemDialogOpen"
      :create="false"
      :item="item"
    />
  </tr>
</template>
<script>
import Barcodes from '../util/Barcodes';
import formatter from '../util/Formatter';
import EditItemDialog from './EditItemDialog.vue';

export default {
  components: {
    'edit-item-dialog': EditItemDialog,
  },
  props: {
    item: null,
  },
  data: () => ({
    formatter,
    Barcodes,
    editItemDialogOpen: false,
  }),
  methods: {
    edit() {
      this.editItemDialogOpen = true;
    },
  },
};
</script>
