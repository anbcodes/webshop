<template>
  <v-list-item style="font-family: monospace;">
    <v-list-item-action>
      <v-btn icon @click="$emit('remove', item)">
        <v-icon>
          mdi-minus
        </v-icon>
      </v-btn>
    </v-list-item-action>
    <v-list-item-content>
      {{item.name}} ({{strPrice}}) x{{item.number}} - {{strTotal}}
    </v-list-item-content>
  </v-list-item>
</template>
<script>
import formatter from '../util/Formatter';

export default {
  props: {
    item: Object,
  },

  data: () => ({
    formatter,
  }),

  computed: {
    strPrice() {
      return this.formatter.formatPrice(this.item.price);
    },
    strTotal() {
      return this.formatter.formatPrice(+this.item.price * this.item.number);
    },
  },
};
</script>
