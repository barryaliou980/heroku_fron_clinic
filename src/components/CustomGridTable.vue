
<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 text-grey-8">
        List des patients
      </div>
    </q-card-section>
    <q-separator/>
    <q-card-section class="q-pa-none tw-px-4 tw-py-4">
      <q-table grid :rows="data"  :filter="filter">
        <template  v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <card-profile :row="props.row"></card-profile>
          </div>
          
        </template>
       <template v-slot:top-right>
          <q-input v-if="show_filter" filled borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>

          <q-btn class="q-ml-sm" icon="filter_list" @click="show_filter=!show_filter" flat/>
        </template>

        
      </q-table>

    </q-card-section>
  </q-card>
</template>

<script>
import {ref} from 'vue'
import {defineComponent} from 'vue'
import CardProfile from './cards/CardProfile.vue';

export default defineComponent({
  name: 'TableCustomGrid',
  props:[
    'data'
  ],
  data(){
    return{
       filter: ref(''),
        show_filter:false
    }

  },
  components: {CardProfile},


})
</script>