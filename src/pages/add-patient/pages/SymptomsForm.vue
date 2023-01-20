<template>
  <div
    class="
      tw-border-b tw-flex
      flex-col
      tw-w-full tw-justify-center tw-border-gray-200 tw-bg-white
    "
  >
    <q-card
      style="width: 80%"
      class="tw-justify-center my-card tw-px-4 tw-py-4 tw-gap-3"
    >
      <div class="tw-flex tw-text-rigth tw-items-center tw-flex-col">
        <div
          class="tw-justify-start tw-items-left tw-text-right text-h5 tw-p-2"
        >
          {{ $t('fever') }}
          <q-badge class="tw-text-rigth text-h6" :color="flagColorT">
            {{ $t(`${store.temperature.temperature}`) }}
          </q-badge>
        </div>
        <div class="tw-text-right text-h5 tw-p-2">
          {{ $t('oxygen_saturation') }}
          <q-badge class="text-h6" :color="flagColorO">
            {{ $t(`${store.oxygen?.oxygen_saturation}`) }}
          </q-badge>
        </div>
        <table class="tw-w-1/2 tw-divide-y tw-mx-4 tw-py-4 tw-divide-gray-300">
          <thead class="tw-bg-gray-50">
            <tr class="tw-divide-x tw-divide-gray-200">
              <th
                scope="col"
                class="
                  tw-py-3.5 tw-pl-4 tw-pr-3
                  text-left
                  tw-text-sm tw-font-semibold tw-text-gray-900
                  tw-sm:pl-6
                "
              ></th>
              <th
                scope="col"
                class="
                  tw-px-3
                  tw-py-3.5
                  tw-text-left
                  tw-text-sm
                  tw-font-semibold
                  tw-text-gray-900
                "
              ></th>
            </tr>
          </thead>
          <tbody class="tw-divide-y tw-divide-gray-200 tw-bg-white">
            <tr class="tw-divide-x tw-divide-gray-200">
              <td class="text-h6">{{ $t('chills') }}</td>
              <td class="tw-text-center">
                <div>
                  <q-btn-toggle
                    v-model="symptoms.chills"
                    glossy
                    :toggle-color="symptoms.chills === 'Yes' ? 'blue' : 'red'"
                    :options="[
                      { label: $t('Yes'), value: 'Yes' },
                      { label: $t('No'), value: 'No' },
                    ]"
                  />
                </div>
              </td>
            </tr>
            <tr class="tw-divide-x tw-divide-gray-200">
              <td class="text-h6">{{ $t('nausea_and_vomiting') }}</td>
              <td class="tw-text-center">
                <q-btn-toggle
                  v-model="symptoms.nausea_and_vomiting"
                  glossy
                  :toggle-color="
                    symptoms.nausea_and_vomiting === 'Yes' ? 'blue' : 'red'
                  "
                  :options="[
                    { label: $t('Yes'), value: 'Yes' },
                    { label: $t('No'), value: 'No' },
                  ]"
                />
              </td>
            </tr>
            <tr class="tw-divide-x tw-divide-gray-200">
              <td class="text-h6">{{ $t('headaches') }}</td>
              <td class="tw-text-center">
                <q-btn-toggle
                  v-model="symptoms.headaches"
                  glossy
                  :toggle-color="symptoms.headaches === 'Yes' ? 'blue' : 'red'"
                  :options="[
                    { label: $t('Yes'), value: 'Yes' },
                    { label: $t('No'), value: 'No' },
                  ]"
                />
              </td>
            </tr>
            <tr class="tw-divide-x tw-divide-gray-200">
              <td class="text-h6">{{ $t('muscle_or_join_pain') }}</td>
              <td class="tw-text-center">
                <q-btn-toggle
                  v-model="symptoms.muscle_or_join_pain"
                  glossy
                  :toggle-color="
                    symptoms.muscle_or_join_pain === 'Yes' ? 'blue' : 'red'
                  "
                  :options="[
                    { label: $t('Yes'), value: 'Yes' },
                    { label: $t('No'), value: 'No' },
                  ]"
                />
              </td>
            </tr>
            <tr class="tw-divide-x tw-divide-gray-200">
              <td class="text-h6">{{ $t('symptoms_sore_throa') }}</td>
              <td class="tw-text-center">
                <q-btn-toggle
                  v-model="symptoms.sore_throa"
                  glossy
                  :toggle-color="symptoms.sore_throa === 'Yes' ? 'blue' : 'red'"
                  :options="[
                    { label: $t('Yes'), value: 'Yes' },
                    { label: $t('No'), value: 'No' },
                  ]"
                />
              </td>
            </tr>
            <tr class="tw-divide-x tw-divide-gray-200">
              <td class="text-h6">{{ $t('cough') }}</td>
              <td class="tw-text-center">
                <q-btn-toggle
                  v-model="symptoms.cough"
                  glossy
                  :toggle-color="symptoms.cough === 'Yes' ? 'blue' : 'red'"
                  :options="[
                    { label: $t('Yes'), value: 'Yes' },
                    { label: $t('No'), value: 'No' },
                  ]"
                />
              </td>
            </tr>
            <tr class="tw-divide-x tw-divide-gray-200">
              <td class="text-h6">{{ $t('fatigue') }}</td>
              <td class="tw-text-center">
                <q-btn-toggle
                  v-model="symptoms.fatigue"
                  glossy
                  :toggle-color="symptoms.fatigue === 'Yes' ? 'blue' : 'red'"
                  :options="[
                    { label: $t('Yes'), value: 'Yes' },
                    { label: $t('No'), value: 'No' },
                  ]"
                />
              </td>
            </tr>
            <tr class="tw-divide-x tw-divide-gray-200">
              <td class="text-h6">{{ $t('loss_of_sense_of_smell') }}</td>
              <td class="tw-text-center">
                <q-btn-toggle
                  v-model="symptoms.loss_of_sense_of_smell"
                  glossy
                  :toggle-color="
                    symptoms.loss_of_sense_of_smell === 'Yes' ? 'blue' : 'red'
                  "
                  :options="[
                    { label: $t('Yes'), value: 'Yes' },
                    { label: $t('No'), value: 'No' },
                  ]"
                />
              </td>
            </tr>
            <tr class="tw-divide-x tw-divide-gray-200">
              <td class="text-h6">{{ $t('difficulty_breathing') }}</td>
              <td class="tw-text-center">
                <q-btn-toggle
                  v-model="symptoms.difficulty_breathing"
                  glossy
                  :toggle-color="
                    symptoms.difficulty_breathing === 'Yes' ? 'blue' : 'red'
                  "
                  :options="[
                    { label: $t('Yes'), value: 'Yes' },
                    { label: $t('No'), value: 'No' },
                  ]"
                />
              </td>
            </tr>
            <tr class="tw-divide-x tw-divide-gray-200">
              <td class="text-h6">{{ $t('diarrhoea') }}</td>
              <td class="tw-text-center">
                <q-btn-toggle
                  v-model="symptoms.diarrhoea"
                  push
                  glossy
                  :toggle-color="symptoms.diarrhoea === 'Yes' ? 'blue' : 'red'"
                  :options="[
                    { label: $t('Yes'), value: 'Yes' },
                    { label: $t('No'), value: 'No' },
                  ]"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <q-separator class="tw-mt-5" />
      <div class="tw-mt-5tw-flex tw-flex-row tw-justify-start tw-space-x-3">
        <q-btn
          color="blue"
          class="tw-mt-5"
          :label="$t('btnSubmit')"
          @click="openDialog"
        />
        <q-dialog v-model="open" persistent color="red">
          <q-card
            :class="
              malaria == true || covid == true
                ? 'bg-red tw-text-white'
                : 'bg-green tw-text-white'
            "
          >
            <q-card-section v-if="malaria === true || covid === true">
              <div class="text-h6">{{ $t('msg_must_be_testing') }}</div>
            </q-card-section>
            <q-card-section v-else>
              <div class="text-h6">{{ $t('msg_not_be_testing') }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <p v-if="covid === true" class="text-h6">
                {{ $t('rdt_covid') }} <q-icon name="check" />
              </p>
              <p v-if="malaria === true" class="text-h6">
                {{ $t('rdt_malaria') }} <q-icon name="check" />
              </p>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn :label="$t('valided')" color="blue" @click="submit" />
              <q-btn :label="$t('canceled')" color="red" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-card>
  </div>
</template>


<script lang="ts" >
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import moment from 'moment';
import { useAppStore } from 'src/stores/appStor';
import { Symptom, RdTest } from '../../../components/models';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
export default {
  emits: [],
  data() {
    return {
      symptoms: {
        chills: 'No',
        nausea_and_vomiting: 'No',
        headaches: 'No',
        muscle_or_join_pain: 'No',
        cough: 'No',
        sore_throa: 'No',
        fatigue: 'No',
        loss_of_sense_of_smell: 'No',
        difficulty_breathing: 'No',
        diarrhoea: 'No',
      } as Symptom,
      selectOptions: ['Yes', 'No'],
      malaria: false,
      covid: false,
      testCovid: {} as RdTest,
      testMalaria: {} as RdTest,
    };
  },
  computed: {
    flagColorT() {
      if (Number(this.store.temperature?.vital_flag) === 0) {
        return 'green';
      } else if (Number(this.store.temperature?.vital_flag) === 1) {
        return 'orange';
      } else if (Number(this.store.temperature?.vital_flag) > 1) {
        return 'red';
      } else {
        return 'white';
      }
    },
    flagColorO() {
      if (Number(this.store.oxygen?.vital_flag) === 0) {
        return 'green';
      } else if (Number(this.store.oxygen?.vital_flag) === 1) {
        return 'orange';
      } else if (Number(this.store.oxygen?.vital_flag) > 1) {
        return 'red';
      } else {
        return 'white';
      }
    },
  },
  methods: {
    mustDoCovidTest() {
      if (
        this.symptoms.chills === 'Yes' ||
        this.store.temperature?.vital_flag == 3 ||
        this.store.oxygen?.vital_flag == 2 ||
        this.symptoms.nausea_and_vomiting === 'Yes' ||
        this.symptoms.headaches === 'Yes' ||
        this.symptoms.muscle_or_join_pain === 'Yes' ||
        this.symptoms.sore_throa === 'Yes' ||
        this.symptoms.cough === 'Yes' ||
        this.symptoms.fatigue === 'Yes' ||
        this.symptoms.loss_of_sense_of_smell === 'Yes' ||
        this.symptoms.difficulty_breathing === 'Yes'
      ) {
        this.testCovid = {
          rdt_type: 'covid',
          test: 'yes',
        };

        return true;
      }
      this.testCovid = {};
      return false;
    },
    mustDoMalariaTest() {
      if (
        this.symptoms.chills === 'Yes' ||
        this.store.temperature?.vital_flag == 3 ||
        this.store.oxygen?.vital_flag == 2 ||
        this.symptoms.nausea_and_vomiting === 'Yes' ||
        this.symptoms.headaches === 'Yes' ||
        this.symptoms.muscle_or_join_pain === 'Yes' ||
        this.symptoms.sore_throa === 'Yes' ||
        this.symptoms.diarrhoea === 'Yes'
      ) {
        this.testMalaria = {
          rdt_type: 'malaria',
          test: 'yes',
        };

        return true;
      }
      this.testMalaria = {};
      return false;
    },

    openDialog() {
      this.malaria = this.mustDoMalariaTest();
      this.covid = this.mustDoCovidTest();
      this.open = true;
    },
    async submit() {
      let test = [];
      let covid = false;
      let malaria = false;
      if (JSON.stringify(this.testCovid) !== JSON.stringify({})) {
        test.push(this.testCovid);
        this.store.setCovidTest(true);
        covid = true;
        console.log('Covid');
      } else {
        this.store.setCovidTest(false);
      }
      if (JSON.stringify(this.testMalaria) !== JSON.stringify({})) {
        test.push(this.testMalaria);
        malaria = true;
        this.store.setMalariaTest(true);
      } else {
        this.store.setMalariaTest(false);
      }
      this.symptoms.rdts = test;
      this.symptoms.patient_id = this.store.currentPatient.id;
      this.symptoms.temperature_id = this.store.temperature?.id;
      this.symptoms.oxygen_id = this.store.oxygen?.id;
      if (this.store.symptom.id === undefined) {
        this.$emit('isLoading', true);
        const { data } = await api.post('/symptoms', this.symptoms);
        this.$emit('isLoading', false);
        console.log('Data', data);
        this.store.setSymptom(data.data);
      } else {
        this.$emit('isLoading', true);
        const { data } = await api.put(
          `/symptoms/${this.store.symptom.id}`,
          this.symptoms
        );
        this.$emit('isLoading', false);
        console.log('Data', data);
        this.store.setSymptom(data.data);
      }

      this.open = false;

      if (malaria === true) {
        this.$emit('next', 'test_malaria');
        this.store.setTabs('test_malaria');
      } else if (
        moment().diff(this.store.currentPatient.date_of_birth, 'years') < 5 ||
        this.store.currentPatient?.pregnant == 'Yes'
      ) {
        if (covid === true) {
          this.$emit('next', 'test_covid');
          this.store.setTabs('test_covid');
        } else {
          this.$emit('next', 'malnutrition');
          this.store.setTabs('malnutrition');
        }
      } else {
        this.$emit('next', 'test_glucose');
        this.store.setTabs('test_glucose');
      }
    },
  },
  created() {
    this.symptoms = this.store.symptom;
  },
  setup() {
    return {
      step: ref(1),
      open: ref(false),
      v$: useVuelidate(),
      store: useAppStore(),
    };
  },
};
</script>