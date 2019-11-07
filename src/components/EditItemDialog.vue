<template>
  <v-dialog
    :value="value"
    @input="$emit('input', arguments[0])"
    max-width="500"
  >
    <v-card>
      <v-card-title class="title">
        {{ create ? 'Create' : 'Edit' }} Item
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="10">
              <v-text-field v-model="itemCopy.name" lable="name"/>
            </v-col>
            <v-col>
              <v-text-field v-model="itemCopy.price" prefix="$" lable="price" type="number"/>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-container>
          <v-row>
            <v-col cols="3">
              <v-btn outlined color="success" @click="close(true)">
                {{create ? 'Create' : 'Save'}}
              </v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn
                v-if="!create"
                outlined
                color="error"
                @click="$emit('delete', item); $emit('input', false)"
              >
                Delete
              </v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn outlined color="warning" @click="close(false)">
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    create: Boolean,
    item: null,
    value: Boolean,
  },
  data: () => ({
    itemCopy: {},
  }),

  watch: {
    item: {
      handler() {
        if (this.item) {
          this.itemCopy = { ...this.item };
        }
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    close(save) {
      if (save) {
        this.$emit('itemUpdate', { item: this.itemCopy, create: this.create });
      }
      this.$emit('input', false);
    },
  },
};
</script>
