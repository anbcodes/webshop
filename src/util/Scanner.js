import Quagga from 'quagga';
import Log from './Log';

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
        Log(__filename, 'ERROR: Starting scanning faild', {
          err,
          Quagga,
          cbFrequency,
          element,
        });
        return;
      }
      Quagga.start();
      Log(__filename, 'Starting scanning', { Quagga, cbFrequency, element });
    });
  },

  addCallback() {
    if (!this.currentCallback) {
      this.currentCallback = Quagga.onDetected(data => this.detection(data));
      Log(__filename, 'Added callback', { callback: this.currentCallBack });
    }
    Log(__filename, 'Error adding callback. Callback alread exists', { callback: this.currentCallBack });
  },

  onCode(cb) {
    this.cb = cb;
    Log(__filename, 'Setting onCode callback', { cb });
  },

  detection(data) {
    Log(__filename, 'Detection', { data }, true);
    if (this.withinFrequency) {
      return;
    }
    Log(__filename, 'Detection after fecquency', { data });
    console.log(data);
    this.cb(data.codeResult.code);
    this.withinFrequency = true;
    setTimeout(() => { this.withinFrequency = false; }, this.cbFrequency);
  },

  stop() {
    Quagga.offDetected(this.currentCallback);
    Quagga.stop();
    this.currentCallback = null;
    Log(__filename, 'Stoped scanning', { Quagga, cb: this.currentCallBack });
  },
};
