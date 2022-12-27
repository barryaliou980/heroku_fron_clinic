<template>
  <div class="q-pa-md">
    <q-separator />
    <div v-if="isAdult">
      <div class="tw-mt-2">
        <base-select
          label="Consumption of Tabacco"
          v-model="medical_back.con_tabacco"
          :options="options"
          :validator="v$.medical_back.con_tabacco"
        />
      </div>
      <base-select
        class="tw-mt-2 tw-mb-1"
        label="Consumption of Alcohol"
        v-model="medical_back.con_alcohol"
        :options="options"
        :validator="v$.medical_back.con_alcohol"
      />
    </div>
    <base-select
      class="tw-mt-2 tw-mb-1"
      label="Which vaccinations do you have"
      v-model="medical_back.which_vaccination"
      :options="options"
      :validator="v$.medical_back.which_vaccination"
    />
    <q-separator />
    <base-select
      class="tw-mt-4 tw-mb-1"
      label="Do you have any diagnosed conditions"
      v-model="medical_back.do_you_have_any_diagn_cond"
      :options="options"
      @update:model-value="resetDiagCon"
      :validator="v$.medical_back.do_you_have_any_diagn_cond"
    />
    <div
      v-if="medical_back.do_you_have_any_diagn_cond === 'Yes'"
      class="tw-mt-2 tw-w-1/2"
    >
      <p class="text-h6 tw-ml-10">If Yes</p>
      <base-input
        class="tw-ml-10 tw-m-2"
        label="What are they for"
        v-model="medical_back.for_diagn_cond"
        :validator="v$.medical_back.for_diagn_cond"
      />
      <base-input
        class="tw-ml-10 tw-m-2"
        label="When where you diagnosed"
        v-model="medical_back.where_diagn_cond"
        :validator="v$.medical_back.where_diagn_cond"
      />
      <base-select
        class="tw-ml-10 tw-m-2"
        label="Are you on Treatment"
        v-model="medical_back.are_on_treatment_diagn_cond"
        :options="options"
        :validator="v$.medical_back.are_on_treatment_diagn_cond"
      />
    </div>
    <q-separator />
    <base-select
      class="tw-mt-4 tw-mb-1"
      label="Do you take any vitamins or supplements"
      v-model="medical_back.do_you_take_any_vitamins"
      :options="options"
      @update:model-value="resetVitamine"
      :validator="v$.medical_back.do_you_take_any_vitamins"
    />
    <div
      v-if="medical_back.do_you_take_any_vitamins === 'Yes'"
      class="tw-mt-2 tw-w-1/2"
    >
      <p class="text-h6 tw-ml-10">If Yes</p>
      <base-input
        class="tw-ml-10 tw-m-2"
        label="Which ones"
        v-model="medical_back.vitamins"
        :validator="v$.medical_back.vitamins"
      />
    </div>
    <q-separator />
    <base-select
      class="tw-mt-4 tw-mb-1"
      label="Are yu physically active"
      v-model="medical_back.is_physical_activity"
      :options="options"
      :validator="v$.medical_back.is_physical_activity"
    />

    <q-btn
      @click="submit"
      color="primary"
      class="tw-mt-2"
      label="Save"
      :loading="loadingBtn"
    />

    <div class="tw-flex tw-justify-center tw-mt-4">
      <q-btn @click="validerEndProcess" color="red" label="End the process" />
    </div>
  </div>
  <q-dialog v-model="open" persistent color="red">
    <q-card>
      <q-card-section>
        <div class="text-h6">End the process for this patient</div>
      </q-card-section>
      <q-card-section class="q-pt-none"> </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Valided" color="blue" @click="end_process" />
        <q-btn label="Cancel" color="red" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="open1" persistent color="red">
    <q-card>
      <q-card-section>
        <div class="text-h6">Medical background Save successfully</div>
      </q-card-section>
      <q-card-section class="q-pt-none"> </q-card-section>
      <q-card-actions align="right">
        <q-btn label="OK" color="blue" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="open2" persistent>
    <q-card class="tw-bg-red-500 tw-text-white">
      <q-card-section>
        <div class="text-h6 tw-text-center">
          Vous Pouvez pas terminer le proccess tant que vous ne saisissez pas
          les resultats
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none"> </q-card-section>
      <q-card-actions align="right">
        <q-btn label="OK" color="blue" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import moment from 'moment';
import { useAppStore } from 'src/stores/appStor';
import { MedicalBackground } from '../../../components/models';
import { api } from 'src/boot/axios';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

export default {
  emits: [],
  data() {
    return {
      loadingBtn: false,
      open: false,
      open1: false,
      open2: false,
      vacinationOptions: ['Non', 'Yes'],
      options: ['Yes', 'No'],
      medical_back: {} as MedicalBackground,
      rows: [],
    };
  },
  methods: {
    async testBackrournd1() {
      if (
        (await this.v$.medical_back.which_vaccination.$validate()) &&
        (await this.v$.medical_back.is_physical_activity.$validate())
      ) {
        return true;
      }
      return false;
    },
    async testBackrournd2() {
      if (await this.v$.medical_back.do_you_have_any_diagn_cond.$validate()) {
        if (this.medical_back.do_you_have_any_diagn_cond === 'Yes') {
          console.log('Cond', this.medical_back.do_you_have_any_diagn_cond);
          if (
            (await this.v$.medical_back.for_diagn_cond.$validate()) &&
            this.v$.medical_back.where_diagn_cond.$validate() &&
            this.v$.medical_back.are_on_treatment_diagn_cond.$validate()
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
      return false;
    },
    async testBackrournd3() {
      if (await this.v$.medical_back.do_you_take_any_vitamins.$validate()) {
        if (this.medical_back.do_you_take_any_vitamins === 'Yes') {
          if (await this.v$.medical_back.vitamins.$validate()) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
      return false;
    },
    async testBackrournd4() {
      if (
        moment().diff(this.store.currentPatient.date_of_birth, 'years') < 18
      ) {
        return true;
      } else {
        if (
          (await this.v$.medical_back.con_tabacco.$validate()) &&
          (await this.v$.medical_back.con_alcohol.$validate())
        ) {
          return true;
        }
      }
      return false;
    },
    resetVitamine() {
      if (this.medical_back.do_you_take_any_vitamins === 'No') {
        this.medical_back.vitamins = undefined;
      }
    },
    resetDiagCon() {
      if (this.medical_back.do_you_have_any_diagn_cond === 'No') {
        this.medical_back.for_diagn_cond = undefined;
        this.medical_back.where_diagn_cond = undefined;
        this.medical_back.are_on_treatment_diagn_cond = undefined;
      }
    },
    async validerEndProcess() {
      const result_1 = await this.testBackrournd1();
      const result_2 = await this.testBackrournd2();
      const result_3 = await this.testBackrournd3();
      const result_4 = await this.testBackrournd4();
      if (result_1 && result_2 && result_3 && result_4) {
        if (JSON.stringify(this.store.medicalBackground) !== '{}') {
          const result = this.isOk();
          if (result) {
            this.open = true;
          } else {
            this.open2 = true;
          }
        } else {
          this.open2 = false;
          this.testBackrournd1();
        }
      }
    },
    async submit() {
      const result_1 = await this.testBackrournd1();
      const result_2 = await this.testBackrournd2();
      const result_3 = await this.testBackrournd3();
      const result_4 = await this.testBackrournd4();
      if (result_1 && result_2 && result_3 && result_4) {
        this.loadingBtn = true;
        this.medical_back.patient_id = this.store.currentPatient.id;

        if (this.store.medicalBackground.id === undefined) {
          const { data } = await api.post('/medical', this.medical_back);
          this.medical_back = data.data;
          this.store.setMedicalBackground(data.data);
          this.loadingBtn = false;
          this.open1 = true;
        } else {
          const { data } = await api.put(
            `/medical/${this.store.medicalBackground.id}`,
            this.medical_back
          );
          this.medical_back = data.data;
          this.store.setMedicalBackground(data.data);
          this.loadingBtn = false;
          this.open1 = true;
        }
      }
    },
    isOk() {
      if (this.store.testCovid) {
        if (JSON.stringify(this.store.covidResult) !== '{}') {
          if (this.store.testMalaria) {
            if (JSON.stringify(this.store.malariaResult) !== '{}') {
              return true;
            } else {
              return false;
            }
          }
          return true;
        } else {
          return false;
        }
      }
      if (this.store.testMalaria) {
        if (JSON.stringify(this.store.malariaResult) !== '{}') {
          if (this.store.testCovid) {
            if (JSON.stringify(this.store.covidResult) !== '{}') {
              return true;
            } else {
              return false;
            }
          }
          return true;
        } else {
          return false;
        }
      }
      return true;
    },
    end_process() {
      this.$emit('endProcess')
      this.store.resetStore();
      this.$router.replace({ name: 'admin.list.patient' });
    },
  },
  computed: {
    isAdult() {
      if (
        moment().diff(this.store.currentPatient.date_of_birth, 'years') > 18
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    this.medical_back = this.store.medicalBackground;
  },
  validations() {
    return {
      medical_back: {
        which_vaccination: { required },
        do_you_have_any_diagn_cond: { required },
        for_diagn_cond: { required },
        where_diagn_cond: { required },
        are_on_treatment_diagn_cond: { required },
        do_you_take_any_vitamins: { required },
        vitamins: { required },
        is_physical_activity: { required },
        con_tabacco: { required },
        con_alcohol: { required },
      },
    };
  },
  setup() {
    return {
      store: useAppStore(),
      v$: useVuelidate(),
    };
  },
};
</script>
