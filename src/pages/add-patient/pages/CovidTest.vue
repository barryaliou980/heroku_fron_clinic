<template>
  <div
    v-if="Object.keys(rdtCovid).length == 0"
    class="tw-flex tw-justify-center tw-px-4 tw-py-4"
  >
    <q-btn
      v-if="store.activeCovid !== true"
      color="blue"
      :label="$t('start_the_test')"
      @click="instruction"
    />
  </div>
  <div v-else class="q-pa-md q-gutter-sm">
    <q-banner rounded class="bg-grey-3">
      <template v-slot:avatar>
        <img
          :src="`${path}${rdtCovid.rdt_image}`"
          style="width: 70%; height: 10%"
        />
      </template>

      <q-btn :color="rdtColor">
        {{ rdtCovid.rdt_result }}
      </q-btn>
    </q-banner>
  </div>
  <base-dialog
    v-model:open="open"
    :title="$t('instruction_for_covid')"
    @close="onFormDialogClose"
    @update="update"
    persistent
  >
    <q-stepper v-model="step" vertical color="primary" animated>
      <q-step
        :name="1"
        :title="$t('instruction_first_covid')"
        icon="settings"
        :done="step > 1"
      >
        <div class="text-center">
          <q-img
            src="../../../assets/1-Le_nez.png"
            style="height: 150px; width: 140px; max-width: 300px"
          />
        </div>
        <q-stepper-navigation>
          <q-btn @click="step = 2" color="primary" :label="$t('btnContinue')" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        :title="$t('instruction_scnd_covid')"
        icon="create_new_folder"
        :done="step > 2"
      >
        <div class="text-center">
          <q-img
            src="../../../assets/mesure.png"
            style="height: 150px; width: 140px; max-width: 300px"
          />
        </div>
        <q-stepper-navigation>
          <q-btn @click="step = 3" color="primary" :label="$t('btnContinue')" />
          <q-btn
            flat
            @click="step = 1"
            color="primary"
            :label="$t('btnBack')"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
      <q-step
        :done="step > 3"
        :name="3"
        title="Verser 3 gouttes dans la cassette"
        icon="add_comment"
      >
        <div class="text-center">
          <q-img
            src="../../../assets/cassette.png"
            style="height: 150px; width: 140px; max-width: 300px"
          />
        </div>

        <q-stepper-navigation>
          <q-btn color="primary" label="Suivant" @click="step = 4" />
          <q-btn
            flat
            @click="step = 2"
            color="primary"
            :label="$t('btnBack')"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
      <q-step
        :done="step > 4"
        :name="4"
        title="Attendre 15 min"
        icon="add_comment"
      >
        <div class="text-center">
          <q-img
            src="../../../assets/timer.png"
            style="height: 150px; width: 140px; max-width: 300px"
          />
        </div>

        <q-stepper-navigation>
          <q-btn color="primary" label="OK" @click="open = false" />
          <q-btn
            flat
            @click="step = 3"
            color="primary"
            label="Precedent"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </base-dialog>
</template>

<script lang="ts">
import moment from 'moment';
import { useAppStore } from 'src/stores/appStor';

import { ref } from 'vue';
import { backendRDTPath } from 'src/boot/axios';
export default {
  emits: [],
  data() {
    return {
      open: true,
      path: backendRDTPath,
      rdtCovid: {},
      rdtColor: '',
    };
  },
  methods: {
    rdtFlag() {
      if (this.store.covidResult.rdt_result === 'positif') {
        this.rdtColor = 'red';
      } else if (this.store.covidResult.rdt_result === 'negatif') {
        this.rdtColor = 'green';
      } else {
        this.rdtColor = 'warning';
      }
    },
    instruction() {
      console.log('test', this.store.currentPatient);
      if (
        moment().diff(this.store.currentPatient.date_of_birth, 'years') < 5 ||
        this.store.currentPatient?.pregnant == 'Yes'
      ) {
        this.$emit('startCountdownCovid', 900);
        this.$emit('next', 'malnutrition');
        this.store.setTabs('malnutrition');
      } else {
        if(   moment().diff(this.store.currentPatient.date_of_birth, 'years') >= 18){
          this.$emit('next', 'blood_pr');
          this.store.setTabs('blood_pr');
           this.$emit('startCountdownCovid', 900);
        }else{
              this.$emit('next', 'medical_back');
              this.store.setTabs('medical_back');
               this.$emit('startCountdownCovid', 900);
        }

      }
    },
    onFormDialogClose() {
      this.open = false;
    },
    update(open: boolean) {
      this.open = open;
    },
    next() {
      this.$emit('next');
    },
  },
  created() {
    console.log('bobo', this.store);
    this.rdtCovid = this.store.covidResult;
    if (Object.keys(this.rdtCovid).length != 0) {
      this.rdtFlag();
      this.open = false;
      console.log('rdt covid', this.rdtCovid);
    }
  },
  setup() {
    return {
      step: ref(1),
      store: useAppStore(),
    };
  },
};
</script>
