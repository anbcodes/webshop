<template>
  <v-container>
    <v-row style="max-height: 480px">
      <div ref="video" style="max-height: 480px; max-width: 640px;">
      </div>
    </v-row>
    <v-row style="max-width: 2in">
      <v-container>
        <v-row v-for="item in currentItems" :key="item.barcodeId">
          <v-col cols="10" class="text-right">
            {{item.name}}
          </v-col>
          <v-col cols="2" class="text-left">
            ${{item.price}}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="10" class="text-right">
            Total:
          </v-col>
          <v-col cols="2" class="text-left">
            {{total}}
          </v-col>
        </v-row>
      </v-container>
    </v-row>
    <v-row>
      <v-btn @click="finish">
        Finish
      </v-btn>
    </v-row>
  </v-container>
</template>
<script>
import Quagga from 'quagga';
import Table from '../util/Table';

export default {
  data: () => ({
    currentItems: [],
    items: [],
    table: new Table(),
    currentCallback: null,
    detectionInLastSecond: false,
  }),
  computed: {
    total() {
      let total = 0;
      this.currentItems.forEach((item) => {
        total += +item.price;
      });
      return total;
    },
  },
  methods: {
    async start() {
      if (!this.currentCallback) {
        this.currentCallback = Quagga.onDetected(data => this.onDetection(data));
      }
      this.items = await this.table.get();

      Quagga.init({
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: this.$refs.video,
        },
        decoder: {
          readers: ['code_128_reader'],
        },
      }, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('Initialization finished. Ready to start');
        Quagga.start();
      });
    },
    onDetection(data) {
      if (this.detectionInLastSecond) {
        return;
      }

      console.log(data.codeResult);
      // eslint-disable-next-line
      const beep = new Audio('data:audio/wav;base64,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');
      beep.play();
      this.currentItems
        .push(this.items
          .filter(item => item.barcodeId === parseInt(data.codeResult.code, 36))[0]);
      this.currentItems = [...this.currentItems];
      this.detectionInLastSecond = true;
      setTimeout(() => { this.detectionInLastSecond = false; }, 1000);
    },

    finish() {
      Quagga.offDetected(this.currentCallback);
      Quagga.stop();
      this.currentCallback = null;
      this.$emit('finish', this.currentItems);
    },
  },
};
</script>
