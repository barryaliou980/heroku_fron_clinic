<template>
  <div class="q-pa-md">
    <q-separator />
    <div v-if="isAdult">
      <div class="tw-mt-2">
        <base-select
          :label="$t('consumption_of_tabacco')"
          v-model="medical_back.con_tabacco"
          :options="options"
          :validator="v$.medical_back.con_tabacco"
        />
      </div>
      <base-select
        class="tw-mt-2 tw-mb-1"
        :label="$t('consumption_of_alcohol')"
        v-model="medical_back.con_alcohol"
        :options="options"
        :validator="v$.medical_back.con_alcohol"
      />
    </div>
    <base-select
      class="tw-mt-2 tw-mb-1"
      :label="$t('which_vaccinations_do_you_have')"
       v-model="vacins"
      :options="vacinationsOptions"
       use-chips
       multiple
    />
    <q-separator />
    <base-select
      class="tw-mt-4 tw-mb-1"
      :label="$t('do_you_have_any_diagnosed_conditions')"
       v-model="medical_back.do_you_have_any_diagn_cond"
      :options="options"
      @update:model-value="resetDiagCon"
      :validator="v$.medical_back.do_you_have_any_diagn_cond"
    />
    <div
      v-if="medical_back.do_you_have_any_diagn_cond === 'Yes'"
      class="tw-mt-2 tw-w-1/2"
    >
      <p class="text-h6 tw-ml-10">{{ $t('if_yes') }}</p>
      <base-select
         class="tw-ml-10 tw-m-2"
         :label="$t('what_are_they_for')"
        v-model="diags"

         use-chips
         multiple
        :options="wtafOptions"
      />
      <base-select
        class="tw-ml-10 tw-m-2"
        :label="$t('when_where_you_diagnosed')"
        v-model="medical_back.where_diagn_cond"
        :validator="v$.medical_back.where_diagn_cond"
         :options="whenOptions"
      />
      <base-select
        class="tw-ml-10 tw-m-2"
        :label="$t('are_you_on_treatment')"
        v-model="medical_back.are_on_treatment_diagn_cond"
        :options="options"
        :validator="v$.medical_back.are_on_treatment_diagn_cond"
      />
    </div>
    <q-separator />
    <base-select
      class="tw-mt-4 tw-mb-1"
      :label="$t('do_you_take_any_vitamins_or_supplements')"
      v-model="medical_back.do_you_take_any_vitamins"
      :options="options"
      @update:model-value="resetVitamine"
      :validator="v$.medical_back.do_you_take_any_vitamins"
    />
    <div
      v-if="medical_back.do_you_take_any_vitamins === 'Yes'"
      class="tw-mt-2 tw-w-1/2"
    >
      <p class="text-h6 tw-ml-10">{{ $t('if_yes') }}</p>
      <base-select
        class="tw-ml-10 tw-m-2"
        :label="$t('which_ones')"
        v-model="vitamins"
        use-chips
         multiple
       :options="vitaminOptions"
      />
    </div>
    <q-separator />
    <base-select
      class="tw-mt-4 tw-mb-1"
      :label="$t('are_you_physically_active')"
      v-model="medical_back.is_physical_activity"
      :options="options"
      :validator="v$.medical_back.is_physical_activity"
    />

    <q-btn
      @click="submit"
      color="primary"
      class="tw-mt-2"
      :label="$t('save')"
      :loading="loadingBtn"
    />

    <div class="tw-flex tw-justify-center tw-mt-4">
      <q-btn
        @click="validerEndProcess"
        color="red"
        :label="$t('end_the_process')"
      />
    </div>
  </div>
  <q-dialog v-model="open" persistent color="red">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ $t('end_the_process_for_this_patient') }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none"> </q-card-section>
      <q-card-actions align="right">
        <q-btn :label="$t('valided')" color="blue" @click="end_process" />
        <q-btn :label="$t('canceled')" color="red" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="open1" persistent color="red">
    <q-card>
      <q-card-section>
        <div class="text-h6">
          {{ $t('medical_background_save_successfully') }}
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none"> </q-card-section>
      <q-card-actions align="right">
        <q-btn :label="$t('ok')" color="blue" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="open2" persistent>
    <q-card class="tw-bg-red-500 tw-text-white">
      <q-card-section>
        <div class="text-h6 tw-text-center">
          {{ $t('you_can_not_end_the_process') }}
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none"> </q-card-section>
      <q-card-actions align="right">
        <q-btn :label="$t('ok')" color="blue" v-close-popup />
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
import { ref } from 'vue';

export default {
  emits: [],
  data() {
    return {
      vitaminOptions:['No vitamin history','Vitamin A','Vitamin B','VItamin C','Vitamin D','Vitamin E'],
      whenOptions:['Moins d`un an', '1 an' ,'2 ans', '3 ans', 'Plus de 3 ans' ],
      wtafOptions:['Hyper Tension', 'Diabete'],
      vacinationsOptions:['Not known','Covid','Polio','Flue','Meningitis','Hepatitis A','Hepatitis B','HPV','Tetanus','Chickenpox'],
      loadingBtn: false,
      open: false,
      open1: false,
      open2: false,
      vacinationOptions: ['Non', 'Yes'],
      options: ['Yes', 'No'],
      medical_back: {},
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
      console.log('daig', this.diags)
      console.log('vaccins', this.vacins)
      if(this.vacins!=null){
        this.medical_back.which_vaccination =this.vacins.toString()
      }
      if(this.diags!=null){
        this.medical_back.for_diagn_cond = this.diags.toString()
      }
      if(this.vitamins!=null){
        this.medical_back.vitamins = this.vitamins.toString()
      }
      console.log('MEDICAL', this.medical_back)
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
    if(this.store.medicalBackground.which_vaccination!=undefined){
      this.vacins=this.store.medicalBackground.which_vaccination.split(',')
    }
    if(this.store.medicalBackground.vitamins!=undefined){
      this.vitamins=this.store.medicalBackground.vitamins.split(',')
    }
    
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
      vacins:ref(null),
      diags:ref(null),
      vitamins:ref(null),
    };
  },
};
</script>
