<template>
  <q-card-actions>
    <q-btn
      class=""
      :color="glucose.glucose_level ? flagColor(glucose.vital_flag) : 'primary'"
      square
      @click="openGlucose"
    >
      <div>{{ $t('t-glucose') }}</div>
    </q-btn>
    <q-btn
      class=""
      @click="openMalnu"
      :color="
        malnutrition.arm_circumference
          ? flagColor(malnutrition.vital_flag)
          : 'primary'
      "
      square
    >
      <div>Malnu..</div>
    </q-btn>
    <q-btn
      class=""
      :color="
        bloodPressure.bp_sys_avarage
          ? flagColor(bloodPressure.vital_flag)
          : 'primary'
      "
      square
      @click="openBlood"
    >
      <div>Blood</div>
    </q-btn>

    <q-btn
      class=""
      :color="
        malariaResult.rdt_result
          ? rdTestFlag(malariaResult.rdt_result)
          : 'primary'
      "
      square
      @click="openM"
    >
      <div>Malaria</div>
    </q-btn>

    <q-btn
      class=""
      :color="
        covidResult.rdt_result ? rdTestFlag(covidResult.rdt_result) : 'primary'
      "
      square
      @click="openC"
    >
      <div>{{ $t('t-covid') }}</div>
      <q-tooltip
        >{{
          covidResult.rdt_result
            ? $t('Covid result is') + covidResult.rdt_result
            : $t('t-covid')
        }}
      </q-tooltip>
    </q-btn>
  </q-card-actions>
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
            {{ $t('patient.name') }}:<span class="tw-text-gray-500">
              {{ row.name }}
            </span>
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
  <base-dialog
    v-model:open="openRDt"
    :title="`Historique ${rdtTitle}`"
    @close="openMalaria = false"
    :loading="formLoading"
    size="sm"
    persistent
    class="tw-text-left"
  >
    <div>
      <base-table
        v-if="malarias.length > 0"
        :column-defs="rdtColums"
        :rows="rdtData"
        :hide-pagination="true"
        separator="cell"
        hide-default-header
      >
        <template v-slot:header="props">
          <q-td v-for="head in props.cols" :key="head.name">
            {{ $t(`${head.field}`) }}
          </q-td>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" :class="rdtflagColor(props.row.rdt_result)">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <p>{{ col.value }}</p>
            </q-td>
          </q-tr>
        </template>
        <!-- <template #body-cell-rdt_result_at="props">
                <q-td :props="props">
                    {{dateFormat(props)}}
                </q-td>
              </template> -->
      </base-table>
      <q-separator class="tw-mt-2" />
      <div class="tw-flex tw-justify-end">
        <q-btn
          class="tw-mt-4 tw-mr-5"
          @click="openMalaria = false"
          :label="$t('close')"
          color="primary"
        />
      </div>
    </div>
  </base-dialog>
  <base-dialog
    v-model:open="openVital"
    :title="`Historique ${vitalTitle}`"
    @close="openVital = false"
    :loading="formLoading"
    size="sm"
    persistent
    class="tw-text-left"
  >
    <div>
      <base-table
        v-if="vitalData.length > 0"
        :column-defs="vitalColums"
        :rows="vitalData"
        :hide-pagination="true"
        separator="cell"
        hide-default-header
      >
        <template v-slot:header="props">
          <q-td v-for="head in props.cols" :key="head.name">
            {{ $t(`${head.field}`) }}
          </q-td>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" :class="flagColorO(props.row.vital_flag)">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <p>
                {{
                  col.field !== 'created_at' ? col.value : dateFormat(col.value)
                }}
              </p>
            </q-td>
          </q-tr>
        </template>
        <!-- <q-tr class="tw-bg-red-500">
            <template #body-cell-created_at="props">
                <q-td :props="props">
                    {{dateFormat(props)}}
                </q-td>
              </template>
          </q-tr> -->
      </base-table>
      <p class="text-center" v-else>{{ $t('no_historique') }}</p>
      <q-separator class="tw-mt-2" />
      <div class="tw-flex tw-justify-end">
        <q-btn
          class="tw-mt-4 tw-mr-5"
          @click="openGlucose = false"
          :label="$t('close')"
          color="primary"
        />
      </div>
    </div>
  </base-dialog>
</template>
<script >
import { backendImagePath } from 'src/boot/axios';
import moment from 'moment';
import 'moment/locale/es'; // without this line it didn't work
moment.locale('fr');
export default {
  name: 'CardProfile',
  props: ['row'],
  data() {
    return {
      openRDt: false,
      openVital: false,
      openMalaria: false,
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
      rdtColums: [],
      vitalColums: [],
      rdtData: [],
      vitalData: [],
      covids: [],
      malarias: [],
      glucoses: [],
      malnutritions: [],
      bloodPressures: [],
      rdtTitle: '',
      vitalTitle: '',
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
    flagColorO(flag) {
      if (Number(flag) === 0) {
        return 'bg-positive text-white';
      } else if (Number(flag) === 1) {
        return 'bg-warning text-white';
      } else if (Number(flag) > 1) {
        return 'bg-negative text-white';
      } else {
        return 'bg-white text-black';
      }
    },
    rdtflagColor(flag) {
      if (flag === 'negatif') {
        return 'bg-positive text-white';
      } else if (flag === 'indeterminate' || flag === 'invalid') {
        return 'bg-warning text-white';
      } else if (flag === 'positif') {
        return 'bg-negative text-white';
      } else {
        return 'bg-white text-black';
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
    dateFormat(date) {
      return moment(date).format('YYYY-MM-DD hh:mm:ss');
    },
    openM() {
      (this.rdtColums = [
        {
          field: 'rdt_type',
          name: 'rdt_type',
          label: 'Test',
          align: 'left',
        },
        {
          field: 'rdt_result_at',
          name: 'rdt_result_at',
          label: 'Date',
          align: 'left',
        },
        {
          field: 'rdt_result',
          name: 'rdt_result',
          label: 'Resultat',
          align: 'left',
        },

        // { name: 'actions', align: 'right', field: 'actions', Label: 'Action' },
      ]),
        (this.rdtData = this.malarias);
      this.rdtTitle = 'Malaria';
      this.openRDt = true;
    },
    openC() {
      this.rdtColums = [
        {
          field: 'rdt_type',
          name: 'rdt_type',
          label: 'Test',
          align: 'left',
        },
        {
          field: 'rdt_result_at',
          name: 'rdt_result_at',
          label: 'Date',
          align: 'left',
        },
        {
          field: 'rdt_result',
          name: 'rdt_result',
          label: 'Resultat',
          align: 'left',
        },

        // { name: 'actions', align: 'right', field: 'actions', Label: 'Action' },
      ];
      this.rdtData = this.covids;
      this.rdtTitle = 'Covid';
      this.openRDt = true;
    },
    openGlucose() {
      (this.vitalColums = [
        {
          field: 'vital_type',
          name: 'vital_type',
          label: 'Test',
          align: 'left',
        },
        {
          field: 'created_at',
          name: 'created_at',
          label: 'Date',
          align: 'left',
        },
        {
          field: 'glucose_level',
          name: 'glucose_level',
          label: 'Resultat',
          align: 'left',
        },

        // { name: 'actions', align: 'right', field: 'actions', Label: 'Action' },
      ]),
        (this.vitalData = this.glucoses);
      this.vitalTitle = 'Glucose';
      this.openVital = true;
    },
    openBlood() {
      (this.vitalColums = [
        {
          field: 'vital_type',
          name: 'vital_type',
          label: 'Test',
          align: 'left',
        },
        {
          field: 'created_at',
          name: 'created_at',
          label: 'Date',
          align: 'left',
        },
        {
          field: 'bp_sys_right',
          name: 'bp_sys_right',
          label: 'Sys Arm Right',
          align: 'left',
        },
        {
          field: 'bp_dias_right',
          name: 'bp_dias_right',
          label: 'Dias Arm Right',
          align: 'left',
        },
        {
          field: 'bp_sys_left',
          name: 'bp_sys_left',
          label: 'Sys Arm Left',
          align: 'left',
        },
        {
          field: 'bp_dias_left',
          name: 'bp_dias_left',
          label: 'Dias Arm Left',
          align: 'left',
        },

        // { name: 'actions', align: 'right', field: 'actions', Label: 'Action' },
      ]),
        (this.vitalData = this.bloodPressures);
      this.vitalTitle = 'Blood Pressure';
      this.openVital = true;
    },
    openMalnu() {
      (this.vitalColums = [
        {
          field: 'vital_type',
          name: 'vital_type',
          label: 'Test',
          align: 'left',
        },
        {
          field: 'created_at',
          name: 'created_at',
          label: 'Date',
          align: 'left',
        },
        {
          field: 'arm_circumference',
          name: 'arm_circumference',
          label: 'Resultat',
          align: 'left',
        },

        // { name: 'actions', align: 'right', field: 'actions', Label: 'Action' },
      ]),
        (this.vitalData = this.malnutritions);
      this.vitalTitle = 'Malnutrition';
      this.openVital = true;
    },
  },
  created() {
    this.covids = this.row.covids;
    this.malarias = this.row.malarias;
    this.glucoses = this.row.glucoses;
    this.malnutritions = this.row.malnutritions;
    this.bloodPressures = this.row.blood_pressures;
    this.row.vitals.forEach((element) => {
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
