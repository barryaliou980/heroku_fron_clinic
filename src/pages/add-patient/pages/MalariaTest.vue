<template>
  <div
    v-if="Object.keys(rdtMalaria).length == 0"
    class="tw-flex tw-justify-center tw-px-4 tw-py-4"
  >
    <q-btn
      v-if="store.activeMalaria !== true"
      color="blue"
      :label="$t('start_the_test')"
      @click="instruction"
    />
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
    :title="$t('instruction_malaria')"
    @close="onFormDialogClose"
    @update="update"
    persistent
  >
    <q-stepper v-model="step" vertical color="primary" animated>
      <q-step
        :name="1"
        :title="$t('malaria_first_instr')"
        icon="settings"
        :done="step > 1"
      >
        <div>
          <q-img
            src="../../../assets/1-malaria.png"
            style="height: 150px; max-width: 300px"
          />
        </div>
        <q-stepper-navigation>
          <q-btn @click="step = 2" color="primary" :label="$t('btnContinue')" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        :title="$t('malaria_scnd_instr')"
        icon="create_new_folder"
        :done="step > 2"
      >
        <div>
          <q-img
            src="../../../assets/2-malaria.png"
            style="height: 150px; max-width: 300px"
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
        :title="$t('malaria_third_instr')"
        icon="add_comment"
      >
        <div>
          <q-img
            src="../../../assets/3-malaria.png"
            style="height: 150px; max-width: 300px"
          />
        </div>

        <q-stepper-navigation>
          <q-btn color="primary" :label="$t('btnContinue')" @click="step = 4" />
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
        :title="$t('malaria_fourth_instr')"
        icon="add_comment"
      >
        <div>
          <q-img
            src="../../../assets/4-malaria.png"
            style="height: 150px; width: 140px; max-width: 300px"
          />
        </div>

        <q-stepper-navigation>
          <q-btn color="primary" :label="$t('btnContinue')" @click="step = 5" />
          <q-btn
            flat
            @click="step = 3"
            color="primary"
            :label="$t('btnBack')"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
      <q-step :name="5" :title="$t('malaria_fifth_instr')" icon="add_comment">
        <div>
          <q-img
            src="../../../assets/5-malaria.png"
            style="height: 150px; max-width: 300px"
          />
          <img
            src="../../../assets/timer.png"
            style="height: 150px; max-width: 300px"
          />
        </div>

        <q-stepper-navigation>
          <q-btn color="primary" :label="$t('OK')" @click="open = false" />
          <q-btn
            flat
            @click="step = 4"
            color="primary"
            :label="$t('btnBack')"
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
      if (
        moment().diff(this.store.currentPatient.date_of_birth, 'years') < 5 ||
        this.store.currentPatient?.pregnant == 'Yes'
      ) {
        if (this.store.testCovid) {
          this.$emit('next', 'test_covid');
          this.store.setTabs('test_covid');
        } else {
          this.$emit('next', 'malnutrition');
          this.store.setTabs('malnutrition');
        }
        this.$emit('startCountdownMalaria', 300);
      } else {
        this.$emit('next', 'test_glucose');
        this.store.setTabs('test_glucose');
        this.$emit('startCountdownMalaria', 300);
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
