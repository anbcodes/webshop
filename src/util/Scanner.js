import Quagga from 'quagga';


export default {
  currentCallBack: null,
  cbFrequency: 1000,
  start(element, cbFrequency = 1000) {
    this.cbFrequency = cbFrequency;
    this.addCallback();
    Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: element,
      },
      decoder: {
        readers: ['code_128_reader'],
      },
    }, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      Quagga.start();
    });
  },

  addCallback() {
    if (!this.currentCallback) {
      this.currentCallback = Quagga.onDetected(data => this.detection(data));
    }
  },

  onCode(cb) {
    this.cb = cb;
  },

  detection(data) {
    if (this.withinFrequency) {
      return;
    }
    console.log(data);
    this.cb(data.codeResult.code);
    this.withinFrequency = true;
    setTimeout(() => { this.withinFrequency = false; }, this.cbFrequency);
  },

  stop() {
    Quagga.offDetected(this.currentCallback);
    Quagga.stop();
    this.currentCallback = null;
  },
};
