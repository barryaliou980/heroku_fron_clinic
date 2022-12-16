<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
          style="width: "
        >
          <q-tab v-if="store.tabs.includes('mails')" name="mails" label="Patient Information" />
          <q-tab v-if="store.tabs.includes('alarms')" name="alarms" label="Vitales Parameters" />
          <q-tab v-if="store.tabs.includes('movies')" name="movies" label="Symptomes" />
          <q-tab v-if="store.tabs.includes('test_malaria')" name="test_malaria" label="Malaria RDT Test" />
          <q-tab v-if="store.tabs.includes('test_glucose')" name="test_glucose" label="Glucose Test" />
          <q-tab v-if="store.tabs.includes('test_covid')" name="test_covid" label="Covid RDT Test" />
          <q-tab v-if="store.tabs.includes('malnutrition')" name="malnutrition" label="Malnutrition" />
          <q-tab v-if="store.tabs.includes('blood_pr')" name="blood_pr" label="Blood Pressure" />
          <q-tab v-if="store.tabs.includes('medical_back')" name="medical_back" label="Medical Background" />
        </q-tabs>
        <q-separator />

        <q-tab-panels  v-model="tab" animated>
          <q-tab-panel name="mails">
            <div class="text-h6">Patient Demographic</div>
            <DemographicPage @next="next" @isLoading="isLoading" />
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <div class="text-h6">Vital Parameters</div>
            <VitalParameters @next="next" @isLoading="isLoading" />
          </q-tab-panel>

          <q-tab-panel name="movies">
            <div class="text-h6">Symptoms</div>
            <SymptomsForm @next="next" @isLoading="isLoading" />
          </q-tab-panel>

          <q-tab-panel name="test_malaria">
            <MalariaTest
              @startCountdownMalaria="startCountdownMalaria"
              @next="next"
            />
          </q-tab-panel>
          <q-tab-panel name="test_glucose">
            <GlucoseForm @next="next" @isLoading="isLoading" />
          </q-tab-panel>

          <q-tab-panel name="test_covid">
            <CovidTest
              @startCountdownCovid="startCountdownCovid"
              @next="next"
            />
          </q-tab-panel>
          <q-tab-panel name="malnutrition">
            <div class="text-h6">Malnutrition</div>
            <MalnutritionForm @next="next" @isLoading="isLoading" />
          </q-tab-panel>

          <q-tab-panel name="blood_pr">
            <div class="text-h6">Prise de sang</div>
            <BloodPresureForm @next="next" @isLoading="isLoading" />
          </q-tab-panel>

          <q-tab-panel name="medical_back">
            <div class="text-h6">Background Medical</div>
            <BackgroundMedical @next="next" @isLoading="isLoading" />
          </q-tab-panel>
        </q-tab-panels>

      </q-card>
    </div>


    <div class="tw-grid tw-grid-cols-2 tw-gap-3">
      <q-page-sticky class="tw-pt-16" position="top-right" :offset="[18, 18]">
        <q-btn
          v-show="hideMalariaBtn"
          :label="disableBtnM === false ? 'Resultat Malaria' : ''"
          v-if="store.activeMalaria"
          :disable="disableBtnM"
          :class="
            disableBtnM === false ? 'tw-animate-bounce tw-ml-1' : 'tw-ml-1'
          "
          @click="setRDTResult('malaria')"
          fab
          color="accent"
        >
          <vue-countdown
            v-if="disableBtnM"
            class="tw-text-xl"
            :time="time"
            @end="onCountdownEndMalaaria"
            v-slot="{ minutes, seconds }"
            >Malaria :{{ minutes }}:{{ seconds }}</vue-countdown
          >
        </q-btn>

        <q-btn
          v-show="hideCovidBtn"
          v-if="store.activeCovid"
          :disable="disableBtnC"
          :class="
            disableBtnC === false ? 'tw-animate-bounce tw-ml-1' : 'tw-ml-1'
          "
          @click="setRDTResult('covid')"
          fab
          color="primary"
        >
          <vue-countdown
            v-if="disableBtnC"
            class="tw-text-xl"
            :time="time"
            @end="onCountdownEndCovid"
            v-slot="{ minutes, seconds }"
            >Covid :{{ minutes }}:{{ seconds }}</vue-countdown
          >
          <p v-else class="tw-text-md">resultat Covid</p>
        </q-btn>
      </q-page-sticky>
    </div>

  </div>
   <loader-dialog
    v-model="loading"
    persistent
    />
  <base-dialog
    v-model:open="open"
    :title="resultModatTitle"
    @close="onFormDialogClose"
    :loading="formLoading"
    size="sm"
    persistent
  >
    <div class="tw-mb-4">
      <base-select
        label="Select the result"
        :options="resultOptions"
        v-model="rdtTestResult.result"
        :validator="v$.rdtTestResult.result"
      />

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
            label="Pick Files"
            icon="camera_enhance"
          >
            <q-tooltip>Pick Files</q-tooltip>
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
              No image of result selected
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
        label="Enregistrer"
      />
    </div>
    <!-- <q-spinner
      style="margin-left: 70%; margin-top: -15%"
      v-if="loading"
      color="primary"
      size="4em"
      :thickness="10"
    /> -->
  </base-dialog>
        <q-dialog v-model="leaveStatut" persistent color="red">
          <q-card

          >
            <q-card-section >
              <div class="text-h6">Voulez-vous supprimer cet utilisateur</div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn label="Valider" color="blue"  />
              <q-btn label="Cancel" color="red" @click="(leaveStatut=false)"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
</template>

<script lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { RdTestResult } from '../../components/models';
import VueCountdown from '@chenfengyuan/vue-countdown';
import { useAppStore } from 'src/stores/appStor';
import { api } from 'src/boot/axios';
import { store } from 'quasar/wrappers';
import { useQuasar } from 'quasar';

export default {
  components: {
    VueCountdown,
    DemographicPage: defineAsyncComponent(
      () => import('./pages/DemographicsForm.vue')
    ),
    VitalParameters: defineAsyncComponent(
      () => import('./pages/VitalParameterForm.vue')
    ),
    SymptomsForm: defineAsyncComponent(
      () => import('./pages/SymptomsForm.vue')
    ),
    MalariaTest: defineAsyncComponent(() => import('./pages/MalariaTest.vue')),
    CovidTest: defineAsyncComponent(() => import('./pages/CovidTest.vue')),
    GlucoseForm: defineAsyncComponent(() => import('./pages/GlucoseForm.vue')),
    MalnutritionForm: defineAsyncComponent(
      () => import('./pages/MalnutritionForm.vue')
    ),
    BackgroundMedical: defineAsyncComponent(
      () => import('./pages/BackgroundMedical.vue')
    ),
    BloodPresureForm: defineAsyncComponent(
      () => import('./pages/BloodPresureForm.vue')
    ),
  },
  data() {
    return {
      leaveStatut:false,
      open: false,
      loading: false,
      saveBtn: false,
      hideCovidBtn: true,
      hideMalariaBtn: true,
      resultModatTitle: '',
      msgValidation: 'Image is required',
      formLoading: false,
      image: '',
      imageUploadedUrl: '',
      timerCount: 300,
      rdtTestResult: {} as RdTestResult,
      resultOptions: ['positif', 'negatif', 'indeterminate', 'invalid'],
      disableBtnM: true,
      disableBtnC: true,
      time: 0,
      activeMalaria: false,
      activeCovid: false,
    };
  },
  methods: {
    startCountdownMalaria(n: number) {
      this.activeMalaria = true;
      this.store.setActiveMalaria(true)
      this.time = n * 1000;
      this.disableBtnM = true;
    },
    onCountdownEndMalaaria() {
      this.disableBtnM = false;
      console.log('end');
    },
    startCountdownCovid(n: number) {
      this.activeCovid = true;
      this.store.setActiveCovid(true)
      this.time = n * 1000;
      this.disableBtnC = true;
    },
    onCountdownEndCovid() {
      this.disableBtnC = false;
      console.log('end');
    },
    file_selected: function (file) {
      this.rdtTestResult.image = file[0];
      this.imageUploadedUrl = URL.createObjectURL(this.rdtTestResult.image);
      this.msgValidation = '';
    },
    next(tabName: string) {
      console.log('name', tabName);
      this.tab = tabName;
    },
    setRDTResult(evt) {
      this.open = true;
      this.rdtTestResult = {};
      this.rdtTestResult.label = evt;
      this.resultModatTitle =
        this.rdtTestResult.label == 'covid'
          ? 'Saisissez resultat du COVID'
          : 'Saisissez resultat du malaria';
      console.log('Ckiked');
    },
    onFormDialogClose() {
      this.loading = false;
      this.saveBtn = false;
      this.open = false;
    },
    async submit() {
      if (await this.v$.rdtTestResult.$validate()) {
        const fileData = new FormData();
        this.loading = true;
        this.saveBtn = true;
        console.log('RDT',this.store.symptom?.id)
        fileData.append('rdt_image', this.rdtTestResult.image);
        fileData.append('patient_id', this.store.currentPatient?.id);
        fileData.append('rdt_type', this.rdtTestResult.label);
        fileData.append('rdt_result', this.rdtTestResult.result);
        fileData.append('symptome_id', this.store.symptom?.id);

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
              this.store.setCovidResult(response.data.data);
              console.log('covid', response.data);
              this.loading = false
            } else if (response.data.data.rdt_type === 'malaria') {
              this.hideMalariaBtn = false;
              this.store.setMalariaResult(response.data.data);
              console.log('covid', response.data);
              this.loading = false
            }
          });
      }
    },
    isLoading(status:boolean){
      this.loading = status
    },
  },
 async created() {
    if(this.$route.params.id !== undefined){
      this.isLoading(true)
      const {data} = await api.get(`/patients/${this.$route.params.id }`)
      this.store.init(data.data)
      if(!this.store.tabs.includes('alarms')){
        this.store.setTabs('alarms')
      }
      this.isLoading(false)
     let lastPosition =this.store.tabs.slice(-1)
      this.next(lastPosition[0])
      console.log('TEST CREATED AT', lastPosition)
    }
  },
  validations() {
    return {
      rdtTestResult: {
        result: { required },
        image: { required },
      },
    };
  },
  setup() {
    return {
      tab: ref('mails'),
      fabRight: ref(true),
      v$: useVuelidate(),
      store: useAppStore(),

    };
  },
  watch: {
    timerCount: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
        }
      },
      immediate: true, // This ensures the watcher is triggered upon creation
    },
  },
  async beforeRouteLeave (to, from, next) {
     this.store.resetStore()
     next()
  }
};
</script>
