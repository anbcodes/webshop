import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import table from './util/Table';


Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();
table.init(data => Vue.prototype.$bus.$emit('TableUpdate', data));

new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app');
