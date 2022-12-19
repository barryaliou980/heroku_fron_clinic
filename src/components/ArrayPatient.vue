<template>
  <div class="q-pa-md">
  <q-card>
   <q-card-section>
      <div class="text-h6 text-grey-8">
        List des patients
      </div>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <q-table separator="cell" :rows="data" :columns="columns" >
        <template v-slot:body-cell-Name="props">
          <q-td :props="props">
            <q-item style="max-width: 420px">
              <q-item-section avatar>
                <q-avatar>
                <img
                v-if="props.row.photo!==null"
                :src="`${path}${props.row.photo}`"/>
                  <img v-else src="../assets/default.png"/>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ props.row.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>

        <template v-slot:body-cell-Action="props">
          <q-td :props="props">
 <q-card-actions class="col tw-justify-center" align="center">
      <q-btn
        class="tw-w-2/3 tw-mb-0.5"
        :color="props.row.glucose.glucose_level?flagColor(props.row.glucose.vital_flag):'primary'"
        square
        icon="view_in_ar"
        @click="openGlucose"
      >
          <div>Glucose</div>
      </q-btn>
      <q-btn
        class="tw-w-2/3 tw-mb-0.5"
        @click="openMalnu"
        :color="props.row.malnutrition.arm_circumference?flagColor(props.row.malnutrition.vital_flag):'primary'"
        square
        icon="mood_bad"
      >
       <div>Malnutrition</div>
      </q-btn>
      <q-btn
        class="tw-w-2/3 tw-mb-0.5"
        :color="props.row.bloodPressure.bp_sys_avarage?flagColor(props.row.bloodPressure.vital_flag): 'primary'"
        square
        icon="bloodtype"
        @click="openBlood"

      >
       <div> Blood Presure</div>
      </q-btn>

      <q-btn
        class="tw-w-2/3 tw-mb-0.5"
        :color="props.row.malariaResult.rdt_result?rdTestFlag(props.row.malariaResult.rdt_result):'primary'"
        square
        icon="personal_injury"
        @click="openM"
      >
       <div>Malaria</div>
      </q-btn>

      <q-btn
          class="tw-w-2/3 tw-mb-0.5"
        :color="props.row.covidResult.rdt_result?rdTestFlag(props.row.covidResult.rdt_result):'primary'"
        square
        icon="coronavirus"
        @click="openC"
      >
       <div>Covid 19</div>
        <q-tooltip>{{(covidResult.rdt_result?'Le resultat du  Covid 19 est '+covidResult.rdt_result:'Covid 19')}} </q-tooltip>
      </q-btn>

    </q-card-actions>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>

</div>

</template>

<script>
import { backendImagePath } from 'src/boot/axios';
import {ref,defineAsyncComponent} from 'vue'
import {defineComponent} from 'vue'
import CardProfile from './cards/CardProfile.vue';
import moment from 'moment'

export default defineComponent({
  name: 'TableCustomGrid',
  props:[
    'data'
  ],
  data(){
    return{
         path: backendImagePath,
       filter: ref(''),
        show_filter:false,
           columns :[
    {name: 'Name',  label: 'Imange & Nom', field: 'name', sortable: true, align: 'left'},
    {name: 'Telephone', label: 'Telephone', field: 'phone_number', sortable: true, align: 'left'},
    {name: 'Crated_Date', label: 'Date de naissance', field: 'date_of_birth', sortable: true, align: 'left'},
    {name: 'Action', label: '', field: 'Action', sortable: false, align: 'center'}
    ],
    type:'Type',
    title:'Test',
      bloodPressure: {},
      oxygen: {},
      glucose: {},
      temperature: {},
      malnutrition: {},
      malariaResult: {},
      covidResult: {},
      rdtColums:[],
      vitalColums:[],
      rdtData:[],
      vitalData:[],
      covids:[],
      malarias:[],
      glucoses:[],
      malnutritions:[],
      bloodPressures:[],
      rdtTitle:'',
      vitalTitle:'',


    }

  },
    components:{
            // TableActions: defineAsyncComponent(() => import('components/user-table.vue')),
    },
    methods:{
        dateFormat(date){
     return moment(date).locale('fr').fromNow();
    },
      rdTestFlag(flag) {
      if (flag === 'negatif') {
        return 'green';
      } else if (flag === 'indeterminate' ||flag === 'invalid' ) {
        return 'orange';
      } else if (flag === 'positif') {
        return 'red';
      } else {
        return 'blue';
      }
    },
      flagColor(flag) {
      if (Number(flag) === 0) {
        return 'green';
      } else if (Number(flag) === 1) {
        return 'orange';
      } else if (Number(flag) > 1) {
        return 'red';
      } else {
        return 'white';
      }
    },

    },
     created() {
    this.covids = this.row.covids
    this.malarias = this.row.malarias
    this.glucoses= this.row.glucoses
    this.malnutritions = this.row.malnutritions
    this.bloodPressures = this.row.blood_pressures
    this.row.vitals.forEach((element) => {
      if (element.vital_type === 'bloodPressure' && element.is_active ===1) {
        this.bloodPressure = element;
      }
      if (element.vital_type === 'malnutrition' && element.is_active ===1) {
        this.malnutrition = element;
      }
      if (element.vital_type === 'oxygen' && element.is_active ===1) {
        this.oxygen = element;
      }
      if (element.vital_type === 'temperature' && element.is_active ===1) {
        this.temperature = element;
      }
      if (element.vital_type === 'glucose' && element.is_active ===1) {
        this.glucose = element;
      }
    });
    this.row.rdts.forEach((element) => {
      if (element.rdt_type === 'malaria') {
        this.malariaResult = element;
      }
      if (element.rdt_type === 'covid') {
        this.covidResult = element;
      }
    });
  },

})
</script>


