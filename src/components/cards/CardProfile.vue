<template>
  <q-card @click="openModal">
    <q-card-section class="text-center">
      <q-avatar size="100px" class="shadow-10">
        <!-- <img
          :src="row.photo !== null ? `${path}${row.photo}` : `../../assets/default.png`"
        /> -->
        <img
           v-if="row.photo !== null"
           :src="`${path}${row.photo}`"
           
        />
        <img 
         v-else
         src="../../assets/default.png"           
        />
        />
      </q-avatar>
    </q-card-section>

    <q-card-section class="q-pt-none text-center">
      <div class="text-h6 text-grey-8">
        {{ row.name }}
      </div>
    </q-card-section>

    <q-card-actions align="center">
      <q-btn
       align="between"
        :color="glucose.glucose_level?flagColor(glucose.vital_flag):'primary'"
        square
        icon="view_in_ar"
      >
          <div>Glucose</div>
        <q-tooltip> Glucose {{glucose.glucose_level}} </q-tooltip>
      </q-btn>
      <q-btn
      
        :color="malnutrition.arm_circumference?flagColor(malnutrition.vital_flag):'primary'"
        square
        icon="mood_bad"
      >
       <div>Malnutrition</div>
        <q-tooltip> Malnutrition {{malnutrition.arm_circumference}} </q-tooltip>
      </q-btn>
      <q-btn
        :color="bloodPressure.bp_sys_avarage?flagColor(bloodPressure.vital_flag): 'primary'"
        square
        icon="bloodtype"
     
      >
       <div> Blood Presure</div>
        <q-tooltip> Blood Presure </q-tooltip>
      </q-btn>
      
      <q-btn
        :color="malariaResult.rdt_result?rdTestFlag(malariaResult.rdt_result):'primary'"
        square
        icon="personal_injury"
      >
       <div>Malaria</div>
        <q-tooltip> {{(malariaResult.rdt_result?'Le resultat du  malaria est '+malariaResult.rdt_result:'Malaria')}}  </q-tooltip>
      </q-btn>
      <q-btn
        :color="covidResult.rdt_result?rdTestFlag(covidResult.rdt_result):'primary'"
        square
        icon="coronavirus"
      >
       <div>Covid 19</div>
        <q-tooltip>{{(covidResult.rdt_result?'Le resultat du  Covid 19 est '+covidResult.rdt_result:'Covid 19')}} </q-tooltip>
      </q-btn>
    </q-card-actions>
  </q-card>
  <base-dialog
    v-model:open="open"
    :title="`Detail patient`"
    @close="onFormDialogClose"
    :loading="formLoading"
    size="md"
    persistent
    class="tw-text-left"
  >
    <div>
      <div>
        <p class="text-h5 tw-text-green-800">Informations sur Patient</p>
        <q-separator class="tw-mt-2" />
        <div class="tw-ml-4 tw-mt-2">
          <p class="text-h6">
            Nom:<span class="tw-text-gray-500"> {{ row.name }} </span>
          </p>
          <p class="text-h6">
            Date de naissance:
            <span class="tw-text-gray-500"> {{ row.date_of_birth }}</span>
          </p>
          <p class="text-h6">
            Gender: <span class="tw-text-gray-500"> {{ row.gender }}</span>
          </p>
          <p v-if="row.pregnant" class="text-h6">
            Pregnant: <span class="tw-text-gray-500"> {{ row.pregnant }}</span>
          </p>
        </div>
        <q-separator class="tw-mt-2" />
        <p class="text-h5 tw-text-green-800">
          Information sur les parametres vitaux
        </p>
        <q-separator class="tw-mt-2" />
        <div class="tw-ml-4 tw-mt-2">
          <p class="text-h6">
            Oxygene:
            <span
              :style="`background-color:${flagColor(oxygen.vital_flag)}`"
              class="tw-text-white"
            >
              {{ oxygen.oxygen_saturation }}
            </span>
          </p>
          <p class="text-h6">
            Temperature:
            <span
              :style="`background-color:${flagColor(temperature.vital_flag)}`"
              class="tw-text-white"
            >
              {{ temperature.temperature }}</span
            >
          </p>
          <p v-if="glucose.glucose_level" class="text-h6">
            Glucose:
            <span
              :style="`background-color:${flagColor(glucose.vital_flag)}`"
              class="tw-text-white"
            >
              {{ glucose.glucose_level }}</span
            >
          </p>
          <p v-if="malnutrition.arm_circumference" class="text-h6">
            Malnutrition:
            <span
              :style="`background-color:${flagColor(malnutrition.vital_flag)}`"
              class="tw-text-white"
              >{{ malnutrition.arm_circumference }}</span
            >
          </p>
          <p v-if="bloodPressure.id" class="text-h6">
            Blood Presure:<br />
            <span
              class="tw-text-white"
              :style="`background-color:${flagColor(bloodPressure.vital_flag)}`"
            >
              <span class="tw-white tw-ml-4">
                Bras Droit: Diastol: {{ bloodPressure.bp_dias_right }} | Systol:
                {{ bloodPressure.bp_sys_right }}</span
              >
              <br />
              <span class="tw-white tw-ml-4">
                Bras Gauche: Diastol: {{ bloodPressure.bp_dias_left }} | Systol:
                {{ bloodPressure.bp_sys_left }}</span
              >
            </span>
          </p>
        </div>
        <q-separator class="tw-mt-2" />
        <p class="text-h5 tw-text-green-800">Information sur les RDT Test</p>
        <q-separator class="tw-mt-2" />
        <div class="tw-ml-4 tw-mt-2">
         
          <p v-if="covidResult.rdt_result" class="text-h6">
            Malaria:
            <span  :style="`background-color:${rdTestFlag(malariaResult.rdt_result)}`" class="tw-text-white">
              {{ malariaResult.rdt_result }}
            </span>
          </p>
           <p v-if="covidResult.rdt_result" class="text-h6">
            Covid:
            <span  :style="`background-color:${rdTestFlag(covidResult.rdt_result)}`" class="tw-text-white"> {{ covidResult.rdt_result }} </span>
          </p>
        </div>
      </div>
      <div class="tw-flex tw-justify-end">
        <q-btn @click="$router.replace(`/detail-patient/${row.id}`)" class="tw-mt-4 tw-mr-5" label="Consulter" color="blue" />
        <q-btn
          class="tw-mt-4 tw-mr-5"
          @click="open = false"
          label="Fermer"
          color="primary"
        />
      </div>
    </div>
  </base-dialog>
</template>

<script >
import { backendImagePath } from 'src/boot/axios';
export default {
  name: 'CardProfile',
  props: ['row'],
  data() {
    return {
      default_image: '/src/assets/default.png',
      path: backendImagePath,
      open: false,
      formLoading: false,

      bloodPressure: {},
      oxygen: {},
      glucose: {},
      temperature: {},
      malnutrition: {},
      malariaResult: {},
      covidResult: {},
    };
  },
  methods: {
    openModal() {
      console.log('open modal', this.row);
      this.open = true;
    },
    onFormDialogClose() {
      this.open = false;
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
    
  },
  created() {
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
};
</script>

<style scoped>
</style>
