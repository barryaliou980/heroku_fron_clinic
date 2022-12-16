<template>
  <q-page class="q-pa-sm">
    <table-custom-grid :data="data" class="q-mt-lg"></table-custom-grid>
  </q-page>
</template>

<script lang="ts">
import { api} from 'src/boot/axios';

import {defineAsyncComponent} from 'vue';
export default ({
  components: {
    TableCustomGrid: defineAsyncComponent(() => import('src/components/CustomGridTable.vue')),
  },
  data(){
    return{
       data:[]
    }
  },
  async created(){
    const {data} = await api.get('/patients')
    this.data =  data
    console.log('patient', data)
  }

})
</script>

