import { boot } from 'quasar/wrappers';

import settingLayoutVue from 'src/layouts/setting-layout.vue';
import baseInputVue from 'src/components/base-input.vue';
import baseSelectVue from 'src/components/base-select.vue';
import phoneInputVue from 'src/components/phone-number-input.vue';
import moneyInputVue from 'src/components/money-input.vue';
import baseTableVue from 'src/components/base-table.vue';
import baseDialog from 'src/components/base-dialog.vue';
import loaderDialog from 'src/components/loader-dialog.vue';
export default boot(({ app }) => {
  app.component('setting-layout', settingLayoutVue);
  app.component('base-input', baseInputVue);
  app.component('base-select', baseSelectVue);
  app.component('phone-input', phoneInputVue);
  app.component('money-input', moneyInputVue);
  app.component('base-table', baseTableVue);
  app.component('base-dialog', baseDialog);
  app.component('loader-dialog', loaderDialog);
});
