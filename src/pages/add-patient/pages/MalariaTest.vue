<template>
  <div
    v-if="Object.keys(rdtMalaria).length == 0"
    class="tw-flex tw-justify-center tw-px-4 tw-py-4"
  >
    <q-btn color="blue" label="Demarer le test" @click="instruction" />
  </div>
  <div v-else class="q-pa-md q-gutter-sm">
    <q-banner rounded class="bg-grey-3">
      <template v-slot:avatar>
        <img
          :src="`${path}${rdtMalaria.rdt_image}`"
          style="width: 70%; height: 10%"
        />
      </template>

      <q-btn :color="rdtColor">
        {{ rdtMalaria.rdt_result }}
      </q-btn>
    </q-banner>
  </div>
  <base-dialog
    v-model:open="open"
    title="Instructions Malaria"
    @close="onFormDialogClose"
    @update="update"
    persistent
  >
    <q-stepper v-model="step" vertical color="primary" animated>
      <q-step
        :name="1"
        title="Netoyer le RDT Test"
        icon="settings"
        :done="step > 1"
      >
        For each ad campaign that you create, you can control how much you're
        willing to spend on clicks and conversions, which networks and
        geographical locations you want your ads to show on, and more.

        <q-stepper-navigation>
          <q-btn @click="step = 2" color="primary" label="Suivant" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Prelever le sang du patient"
        icon="create_new_folder"
        :done="step > 2"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.

        <q-stepper-navigation>
          <q-btn @click="step = 4" color="primary" label="Suivant" />
          <q-btn
            flat
            @click="step = 1"
            color="primary"
            label="Precedent"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
      <q-step :name="4" title="Demarer le test" icon="add_comment">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.

        <q-stepper-navigation>
          <q-btn color="primary" label="OK" @click="open = false" />
          <q-btn
            flat
            @click="step = 2"
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
      rdtMalaria: {},
      rdtColor: '',
    };
  },
  methods: {
    rdtFlag() {
      if (this.store.malariaResult.rdt_result === 'positif') {
        this.rdtColor = 'red';
      } else if (this.store.malariaResult.rdt_result === 'negatif') {
        this.rdtColor = 'green';
      } else {
        this.rdtColor = 'warning';
      }
    },
    instruction() {

      console.log(
        'Age',
        moment().diff(this.store.currentPatient.date_of_birth, 'years')
      );
      if (
        moment().diff(this.store.currentPatient.date_of_birth, 'years') < 5 ||
        this.store.currentPatient?.pregnant == 'Yes'
      ) {
        if (this.store.testCovid) {
          this.$emit('next', 'test_covid');
           this.store.setTabs('test_covid')
        } else {
          this.$emit('next', 'malnutrition');
          this.store.setTabs('malnutrition')
        }
        this.$emit('startCountdownMalaria', 900);
      } else {
        this.$emit('next', 'test_glucose');
         this.store.setTabs('test_glucose')
        this.$emit('startCountdownMalaria', 900);
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
    this.rdtMalaria = this.store.malariaResult;
    if (Object.keys(this.rdtMalaria).length != 0) {
      this.rdtFlag();
      this.open = false;
      console.log('rdt', this.rdtMalaria);
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
