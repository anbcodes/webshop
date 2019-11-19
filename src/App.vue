<template>
  <v-app>
    <v-app-bar app>
      <v-btn icon href="https://github.com/anbcodes/webshop/wiki">
        <v-icon>
          mdi-help-circle-outline
        </v-icon>
      </v-btn>
      <v-img contain height="50" src="./assets/logo.png" lazy-src="./assets/logo.png" />
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <inventory v-if="page === 'table'" />
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
    </v-content>
  </v-app>
</template>

<script>
import Inventory from './components/Inventory.vue';
import ScanItems from './components/ScanItems.vue';
import Log from './util/Log';

export default {
  name: 'App',

  components: {
    inventory: Inventory,
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
      Log(__filename, 'Finished scanning');
    },
    async startItems() {
      this.page = 'scan';
      await this.$nextTick();
      this.$refs.scan.start();
      Log(__filename, 'Started scanning');
    },
    setStoreName() {
      const name = prompt('What is the name of your store?');
      localStorage.setItem('name', name);
      Log(__filename, 'Setted store name', { name });
    },
  },
};
</script>
