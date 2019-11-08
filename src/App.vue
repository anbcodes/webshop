<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <my-table v-if="page === 'table'" />
          <scan-items ref="scan" v-if="page === 'scan'" @finish="onScanFinish"/>
        </v-col>
      </v-row>
      <v-row v-if="page === 'table'">
        <v-col cols="2">
          <v-btn outlined block @click="setStoreName()">
            Set store name
          </v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn outlined block @click="startItems()">
            Scan Items
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
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
