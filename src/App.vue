<template>
  <v-app>
    <v-content>
      <my-table v-if="page === 'table'" />
      <scan-items ref="scan" v-if="page === 'scan'" @finish="onScanFinish"/>
      <v-btn v-if="page === 'table' " @click="startItems()">
        Scan Items
      </v-btn>
      <v-btn v-if="page === 'table' " @click="setStoreName()">
        Set store name
      </v-btn>
    </v-content>
  </v-app>
</template>

<script>
import MyTable from './components/MyTable.vue';
import ScanItems from './components/ScanItems.vue';

export default {
  name: 'App',

  components: {
    'my-table': MyTable,
    'scan-items': ScanItems,
  },
  mounted() {
    if (!localStorage.getItem('name') || localStorage.getItem('name') === '') {
      this.setStoreName();
    }
  },
  data: () => ({
    page: 'table',
  }),

  methods: {
    onScanFinish() {
      this.page = 'table';
    },
    async startItems() {
      this.page = 'scan';
      await this.$nextTick();
      this.$refs.scan.start();
    },
    setStoreName() {
      const name = prompt('What is the name of your store?');
      localStorage.setItem('name', name);
    },
  },
};
</script>
