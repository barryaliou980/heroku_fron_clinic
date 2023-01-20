<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 text-grey-8">
        {{ $t('sidebar.patient_list') }}
      </div>
    </q-card-section>
    <q-card-section class="q-pa-none tw-px-4 tw-py-4">
      <q-table
        separator="cell"
        :rows="data"
        :columns="columns"
        :filter="filter"
      >
        <template v-slot:body-cell-Name="props">
          <q-td :props="props" @click="openDialog(props.row)">
            <q-item style="max-width: 420px">
              <q-item-section avatar>
                <q-avatar rounded>
                  <img
                    v-if="props.row.photo !== null"
                    :src="`${path}${props.row.photo}`"
                  />
                  <img v-else src="../assets/default.png" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ props.row.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>
        <template v-slot:body-cell-date_of_birth="props">
          <q-td :props="props">
            {{ props.row.created_at }}
          </q-td>
        </template>
        <template v-slot:body-cell-Action="props">
          <q-td :props="props">
            <ArrayPatient :row="props.row" />
          </q-td>
        </template>
        <template v-slot:top-right>
          <q-input
            v-if="show_filter"
            filled
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-btn
            class="q-ml-sm"
            icon="filter_list"
            @click="show_filter = !show_filter"
            flat
          />
        </template>
      </q-table>
    </q-card-section>
  </q-card>
  <base-dialog
    v-model:open="open"
    :title="$t('Patient detail')"
    @close="onFormDialogClose"
    :loading="formLoading"
    size="md"
    persistent
    class="tw-text-left"
  >
    <div>
      <div>
        <p class="text-h5 tw-text-green-800">{{ $t('Patient Infos') }}</p>
        <q-separator class="tw-mt-2" />
        <div class="tw-ml-4 tw-mt-2">
          <p class="text-h6">
            {{ $t('patient.name')
            }}<span class="tw-text-gray-500"> {{ row.name }} </span>
          </p>
          <p class="text-h6">
            {{ $t('patient.date_of_birth') }}:
            <span class="tw-text-gray-500"> {{ row.date_of_birth }}</span>
          </p>
          <p class="text-h6">
            {{ $t('patient.gender') }}:
            <span class="tw-text-gray-500"> {{ $t(`${row.gender}`) }}</span>
          </p>
          <p v-if="row.pregnant" class="text-h6">
            {{ $t('patient.pregnant') }}:
            <span class="tw-text-gray-500"> {{ $t(`${row.pregnant}`) }}</span>
          </p>
        </div>
        <q-separator class="tw-mt-2" />
        <p class="text-h5 tw-text-green-800">
          {{ $t('Vitals Parameters Infos') }}
        </p>
        <q-separator class="tw-mt-2" />
        <div class="tw-ml-4 tw-mt-2">
          <p class="text-h6">
            {{ $t('oxygen') }}:
            <span
              :style="`background-color:${flagColor(oxygen.vital_flag)}`"
              class="tw-text-white"
            >
              {{ $t(`${oxygen.oxygen_saturation}`) }}
            </span>
          </p>
          <p class="text-h6">
            {{ $t('temperature') }}:
            <span
              :style="`background-color:${flagColor(temperature.vital_flag)}`"
              class="tw-text-white"
            >
              {{ $t(`${temperature.temperature}`) }}</span
            >
          </p>
          <p v-if="glucose.glucose_level" class="text-h6">
            {{ $t('t-glucose') }}:
            <span
              :style="`background-color:${flagColor(glucose.vital_flag)}`"
              class="tw-text-white"
            >
              {{ $t(`${glucose.glucose_level}`) }}</span
            >
          </p>
          <p v-if="malnutrition.arm_circumference" class="text-h6">
            {{ $t('t-malnutrition') }}:
            <span
              :style="`background-color:${flagColor(malnutrition.vital_flag)}`"
              class="tw-text-white"
              >{{ malnutrition.arm_circumference }}</span
            >
          </p>
          <p v-if="bloodPressure.id" class="text-h6">
            {{ $t('t-blood-pressure') }}:<br />
            <span
              class="tw-text-white"
              :style="`background-color:${flagColor(bloodPressure.vital_flag)}`"
            >
              <span class="tw-white tw-ml-4">
                {{ $t('arm_right') }}: Systol:
                {{ bloodPressure.bp_sys_right }} | Diastol:
                {{ bloodPressure.bp_dias_right }}</span
              >
              <br />
              <span class="tw-white tw-ml-4">
                {{ $t('arm_left') }}: Systol: {{ bloodPressure.bp_sys_left }} |
                Diastol: {{ bloodPressure.bp_dias_left }}</span
              >
            </span>
          </p>
        </div>
        <q-separator class="tw-mt-2" />
        <p class="text-h5 tw-text-green-800">
          {{ $t('RD Test Informations') }}
        </p>
        <q-separator class="tw-mt-2" />
        <div class="tw-ml-4 tw-mt-2">
          <p v-if="covidResult.rdt_result" class="text-h6">
            {{ $t('t-malaria') }}:
            <span
              :style="`background-color:${rdTestFlag(
                malariaResult.rdt_result
              )}`"
              class="tw-text-white"
            >
              {{ $t(`${malariaResult.rdt_result}`) }}
            </span>
          </p>
          <p v-if="covidResult.rdt_result" class="text-h6">
            {{ $t('t-covid') }}:
            <span
              :style="`background-color:${rdTestFlag(covidResult.rdt_result)}`"
              class="tw-text-white"
            >
              {{ $t(`${covidResult.rdt_result}`) }}
            </span>
          </p>
        </div>
      </div>
      <div class="tw-flex tw-justify-end">
        <q-btn
          @click="$router.replace(`/detail-patient/${row.id}`)"
          class="tw-mt-4 tw-mr-5"
          :label="$t('New Consultation')"
          color="blue"
        />
        <q-btn
          class="tw-mt-4 tw-mr-5"
          @click="open = false"
          :label="$t('close')"
          color="primary"
        />
      </div>
    </div>
  </base-dialog>
</template>


<script>
import { ref } from 'vue';
import { defineComponent } from 'vue';
import ArrayPatient from './ArrayPatient.vue';
import { backendImagePath } from 'src/boot/axios';

export default defineComponent({
  name: 'TableCustomGrid',
  props: ['data'],
  components: {
    ArrayPatient,
  },
  data() {
    return {
      filter: ref(''),
      show_filter: false,
      oxygen: {},
      malnutrition: {},
      temperature: {},
      glucose: {},
      malariaResult: {},
      bloodPressure: {},
      covidResult: {},
      formLoading: false,
      open: false,
      row: {},
      path: backendImagePath,
      columns: [
        {
          name: 'Name',
          label: 'Informations',
          field: 'name',
          sortable: true,
          align: 'left',
        },
        // {name: 'Gender', label: 'Gender', field: 'gender', sortable: true, align: 'left'},
        // {name: 'Telephone', label: 'Telephone', field: 'phone_number', sortable: true, align: 'left'},
        // {name: 'date_of_birth ', label: 'Date de naissance', field: 'date_of_birth', sortable: true, align: 'left'},
        {
          name: 'Action',
          label: '',
          field: 'Action',
          sortable: false,
          align: 'center',
        },
      ],
    };
  },
  methods: {
    dateFormat(date) {
      return moment(date).format('lll');
    },
    openDialog(row) {
      this.row = row;
      row.vitals.forEach((element) => {
        if (element.vital_type === 'bloodPressure' && element.is_active === 1) {
          this.bloodPressure = element;
        }
        if (element.vital_type === 'malnutrition' && element.is_active === 1) {
          this.malnutrition = element;
        }
        if (element.vital_type === 'oxygen' && element.is_active === 1) {
          this.oxygen = element;
        }
        if (element.vital_type === 'temperature' && element.is_active === 1) {
          this.temperature = element;
        }
        if (element.vital_type === 'glucose' && element.is_active === 1) {
          this.glucose = element;
        }
      });
      row.rdts.forEach((element) => {
        if (element.rdt_type === 'malaria') {
          this.malariaResult = element;
        }
        if (element.rdt_type === 'covid') {
          this.covidResult = element;
        }
      });
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
      } else if (flag === 'indeterminate' || flag === 'invalid') {
        return 'orange';
      } else if (flag === 'positif') {
        return 'red';
      } else {
        return 'blue';
      }
    },
  },
});
</script>
