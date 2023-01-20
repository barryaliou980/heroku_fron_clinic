<template>
  <q-card class="row">
    <div @click="openModal" class="col">
      <q-card-section class="text-center">
        <q-avatar rounded size="100px" class="shadow-10">
          <!-- <img
            :src="row.photo !== null ? `${path}${row.photo}` : `../../assets/default.png`"
          /> -->
          <img v-if="row.photo !== null" :src="`${path}${row.photo}`" />
          <img v-else src="../../assets/default.png" />
          />
        </q-avatar>
      </q-card-section>
      <q-card-section class="q-pt-none text-center">
        <div class="text-h6 text-grey-8">
          {{ row.name }}
        </div>
      </q-card-section>
    </div>
    <q-card-actions class="col tw-justify-center" align="center">
      <q-btn
        class="tw-w-2/3 tw-mb-0.5"
        :color="
          glucose.glucose_level ? flagColor(glucose.vital_flag) : 'primary'
        "
        square
        icon="view_in_ar"
        @click="openGlucose"
      >
        <div>{{ $t('t-glucose') }}</div>
        <q-tooltip>
          {{ $t('t-glucose') }} {{ glucose.glucose_level }}
        </q-tooltip>
      </q-btn>
      <q-btn
        class="tw-w-2/3 tw-mb-0.5"
        @click="openMalnu"
        :color="
          malnutrition.arm_circumference
            ? flagColor(malnutrition.vital_flag)
            : 'primary'
        "
        square
        icon="mood_bad"
      >
        <div>{{ $t('t-malnutrition') }}</div>
        <q-tooltip>
          {{ $t('t-malnutrition') }} {{ malnutrition.arm_circumference }}
        </q-tooltip>
      </q-btn>
      <q-btn
        class="tw-w-2/3 tw-mb-0.5"
        :color="
          bloodPressure.bp_sys_avarage
            ? flagColor(bloodPressure.vital_flag)
            : 'primary'
        "
        square
        icon="bloodtype"
        @click="openBlood"
      >
        <div>{{ $t('t-blood-pressure') }}</div>
        <q-tooltip> {{ $t('t-blood-pressure') }} </q-tooltip>
      </q-btn>

      <q-btn
        v-if="malariaResult.id != undefined && malariaResult.rdt_result != null"
        class="tw-w-2/3 tw-mb-0.5"
        :color="
          malariaResult.rdt_result
            ? rdTestFlag(malariaResult.rdt_result)
            : 'primary'
        "
        square
        icon="personal_injury"
        @click="openM"
      >
        <div>{{ $t('t-malaria') }}</div>
        <q-tooltip>
          {{
            malariaResult.rdt_result
              ? $t('Malaria result is') + malariaResult.rdt_result
              : $t('t-malaria')
          }}
        </q-tooltip>
      </q-btn>
      <q-btn
        v-else
        @click="setRDTResult('malaria')"
        class="tw-w-2/3 tw-mb-0.5"
        color="#000"
        style="color: #ffb3b3"
        square
        outline
        icon="personal_injury"
      >
        {{ $t('result') }}
      </q-btn>

      <q-btn
        v-if="covidResult.id != undefined && covidResult.rdt_result !=null"
        class="tw-w-2/3 tw-mb-0.5"
        :color="
          covidResult.rdt_result
            ? rdTestFlag(covidResult.rdt_result)
            : 'primary'
        "
        square
        icon="coronavirus"
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
      <q-btn
        v-else
        @click="setRDTResult('covid')"
        class="tw-w-2/3 tw-mb-0.5"
        color="#000"
        style="color: #ffb3b3"
        square
        outline
        icon="personal_injury"
      >
        {{ $t('result') }}
      </q-btn>
    </q-card-actions>
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
                {{ bloodPressure.bp_dias_right }}
              </span>
              <br />
              <span class="tw-white tw-ml-4">
                {{ $t('arm_left') }}: Systol: {{ bloodPressure.bp_sys_left }} |
                Diastol: {{ bloodPressure.bp_dias_left }}
              </span>
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
          @click="newConsul"
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
              <p>
                {{ col.value }}
              </p>
            </q-td>
          </q-tr>
        </template>
      </base-table>
      <q-separator class="tw-mt-2" />
      <div class="tw-flex tw-justify-end">
        <q-btn
          class="tw-mt-4 tw-mr-5"
          @click="openRDt = false"
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
          @click="openVital = false"
          :label="$t('close')"
          color="primary"
        />
      </div>
    </div>
  </base-dialog>
  <base-dialog
    v-model:open="openResult"
    :title="resultModatTitle"
    @close="onFormDialogClose"
    :loading="formLoading"
    size="sm"
    persistent
  >
    <div class="tw-mb-4">
      <base-select
        :label="$t('select_result')"
        :options="resultOptions"
        v-model="rdtTestResult.result"
        :validator="v$.rdtTestResult.result"
        :display-value="
          rdtTestResult.result ? $t(`${rdtTestResult.result}`) : ''
        "
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </base-select>

      <q-uploader
        color="teal"
        style="max-width: 300px; margin-left: 9%"
        v-model="rdtTestResult.image"
        multiple
        @added="file_selected"
      >
        <template v-slot:header="scope">
          <q-btn
            v-if="scope.canAddFiles"
            type="a"
            class="full-width"
            :label="$t('patient.pickFiles')"
            icon="camera_enhance"
          >
            <q-tooltip>{{ $t('patient.pickFiles') }}</q-tooltip>
            <q-uploader-add-trigger></q-uploader-add-trigger>
          </q-btn>
        </template>
        <template v-slot:list="scope">
          <q-img
            v-if="typeof rdtTestResult.image !== 'undefined'"
            :src="imageUploadedUrl"
            :alt="scope.name"
            spinner-color="white"
            style="height: 180px; max-width: auto"
          >
          </q-img>
          <p style="margin: 5% 20%" v-else>
            <q-badge color="red">
              {{ $t('patient.no_image') }}
              <q-icon name="warning" color="white" class="q-ml-xs" />
            </q-badge>
          </p>
        </template>
      </q-uploader>
      <div v-if="msgValidation">
        <q-badge style="margin: 4% 32%; font-size: 1em" color="red">
          {{ msgValidation }}
        </q-badge>
      </div>

      <q-btn
        @click="submit"
        :disabled="saveBtn"
        color="blue"
        style="margin-left: 30%"
        class="tw-mt-4"
        :label="$t('save')"
      />
    </div>
  </base-dialog>
  <q-dialog v-model="openConfirm" persistent color="red">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ $t('do_you_need_another_test') }}</div>
        <p class="text-lg">{{ $t('patient_has_result_to_save') }}</p>
        <p class="text-lg">{{ $t('are_canceled') }}</p>
      </q-card-section>
      <q-card-section class="q-pt-none"> </q-card-section>
      <q-card-actions align="right">
        <q-btn
          :label="$t('btnContinue')"
          color="blue"
          @click="$router.replace(`/detail-patient/${row.id}`)"
        />
        <q-btn
          :label="$t('canceled')"
          color="red"
          @click="
            openConfirm = false;
            open = false;
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
   <loader-dialog v-model="loading" persistent />
</template>

<script >
import { backendImagePath } from 'src/boot/axios';
import moment from 'moment';
import 'moment/locale/es'; // without this line it didn't work
moment.locale('fr');
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useAppStore } from 'src/stores/appStor';
import { api } from 'src/boot/axios';

export default {
  name: 'CardProfile',
  props: ['row'],
  data() {
    return {
      loading:false,
      openConfirm:false,
      resultModatTitle: '',
      openResult: false,
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
      rdtTestResult: {},
      resultOptions: ['positif', 'negatif', 'indeterminate', 'invalid'],
      msgValidation: 'Image is required',
      imageUploadedUrl: '',
      saveBtn: false,
    };
  },
  methods: {
    newConsul() {
      if (
        (JSON.stringify(this.malariaResult) === '{}' ||
          this.malariaResult.rdt_result != null) &&
        (JSON.stringify(this.covidResult) === '{}' ||
          this.covidResult.rdt_result != null)
      ) {
        this.$router.replace(`/detail-patient/${this.row.id}`);
      } else {
        this.openConfirm = true;
      }
    },
    file_selected: function (file) {
      this.rdtTestResult.image = file[0];
      this.imageUploadedUrl = URL.createObjectURL(this.rdtTestResult.image);
      this.msgValidation = '';
    },
    setRDTResult(evt) {
      this.openResult = true;
      this.rdtTestResult = {};
      this.rdtTestResult.label = evt;
      this.resultModatTitle =
        this.rdtTestResult.label == 'covid'
          ? 'Enter Covid result'
          : 'Enter malaria result';
      console.log('Ckiked');
    },
    async submit() {
      if (await this.v$.rdtTestResult.$validate()) {
        let result;
        if (this.rdtTestResult.label === 'covid') {
          result = this.covidResult;
        } else if (this.rdtTestResult.label === 'malaria') {
          result = this.covidResult;
        }
        const fileData = new FormData();
        this.loading = true;
        this.saveBtn = true;
        fileData.append('rdt_image', this.rdtTestResult.image);
        fileData.append('patient_id', result.patient_id);
        fileData.append('rdt_type', this.rdtTestResult.label);
        fileData.append('rdt_result', this.rdtTestResult.result);
        fileData.append('symptome_id', result.symptome_id);
        fileData.append('id', result.id);

        api
          .post('/rdt', fileData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            this.open = false;
            this.loading = false;
            this.saveBtn = false;
            if (response.data.data.rdt_type === 'covid') {
              this.hideCovidBtn = false;
              console.log('covid', response.data);
              this.loading = false;
            } else if (response.data.data.rdt_type === 'malaria') {
              this.hideMalariaBtn = false;

              console.log('covid', response.data);
              this.loading = false;
            }
            this.$router.go();
          });
      }
    },
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
      this.rdtData = this.malarias;
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
      this.vitalColums = [
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
      ];
      this.vitalData = this.glucoses;
      this.vitalTitle = 'Glucose';
      this.openVital = true;
    },
    openBlood() {
      this.vitalColums = [
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
        // {
        //   field: 'bp_dias_avarage',
        //   name: 'bp_dias_avarage',
        //   label: 'Dias average',
        //   align: 'left',
        // },
        // {
        //   field: 'bp_sys_avarage',
        //   name: 'bp_sys_avarage',
        //   label: 'Sys average',
        //   align: 'left',
        // },

        // { name: 'actions', align: 'right', field: 'actions', Label: 'Action' },
      ];
      this.vitalData = this.bloodPressures;
      this.vitalTitle = 'Blood Pressure';
      this.openVital = true;
    },
    openMalnu() {
      this.vitalColums = [
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
      ];
      this.vitalData = this.malnutritions;
      this.vitalTitle = 'Malnutrition';
      this.openVital = true;
    },
  },
  validations() {
    return {
      rdtTestResult: {
        result: { required },
        image: { required },
      },
    };
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
  setup() {
    return {
      v$: useVuelidate(),
      store: useAppStore(),
    };
  },
};
</script>

<style scoped>
</style>
