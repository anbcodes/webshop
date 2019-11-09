<template>
  <tr @click="edit">
    <td>{{ item.name }}</td>
    <td>{{ formatter.formatPrice(item.price) }}</td>
    <td>
      <v-btn icon @click.stop="$emit('addPrint', item)">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </td>
    <td>
      <v-btn icon @click.stop="$emit('removePrint', item)">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </td>
    <td>{{numberInPrint}}</td>
    <edit-item-dialog
      v-model="editItemDialogOpen"
      :create="false"
      :item="item"
    />
  </tr>
</template>
<script>
import formatter from '../util/Formatter';
import EditItemDialog from './EditItemDialog.vue';

export default {
  components: {
    'edit-item-dialog': EditItemDialog,
  },
  props: {
    numberInPrint: Number,
    item: null,
  },
  data: () => ({
    formatter,
    editItemDialogOpen: false,
  }),
  methods: {
    edit() {
      this.editItemDialogOpen = true;
    },
  },
};
</script>
