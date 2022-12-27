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
          <q-tab
            v-if="store.tabs.includes('mails')"
            name="mails"
            label="Patient Information"
          />
          <q-tab
            v-if="store.tabs.includes('alarms')"
            name="alarms"
            label="Vitales Parameters"
          />
          <q-tab
            v-if="store.tabs.includes('movies')"
            name="movies"
            label="Symptomes"
          />
          <q-tab
            v-if="store.tabs.includes('test_malaria')"
            name="test_malaria"
            label="Malaria RDT Test"
          />
          <q-tab
            v-if="store.tabs.includes('test_glucose')"
            name="test_glucose"
            label="Glucose Test"
          />
          <q-tab
            v-if="store.tabs.includes('test_covid')"
            name="test_covid"
            label="Covid RDT Test"
          />
          <q-tab
            v-if="store.tabs.includes('malnutrition')"
            name="malnutrition"
            label="Malnutrition"
          />
          <q-tab
            v-if="store.tabs.includes('blood_pr')"
            name="blood_pr"
            label="Blood Pressure"
          />
          <q-tab
            v-if="store.tabs.includes('medical_back')"
            name="medical_back"
            label="Medical Background"
          />
        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="tab" animated>
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
            <BackgroundMedical @endProcess="endProcess" @next="next" @isLoading="isLoading" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>

    <div class="tw-grid tw-grid-cols-2 tw-gap-3">
      <q-page-sticky class="tw-pt-16" position="top-right" :offset="[18, 18]">
        <q-btn

          :label="disableBtnM === false ? 'Malaria Result' : ''"
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
            :time="malariaTimer"
            @end="onCountdownEndMalaaria"
            v-slot="{ minutes, seconds }"
            >Malaria :{{ minutes }}:{{ seconds }}</vue-countdown
          >
        </q-btn>

        <q-btn

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
            :time="covidTimer"
            @end="onCountdownEndCovid"
            v-slot="{ minutes, seconds }"
            >Covid :{{ minutes }}:{{ seconds }}</vue-countdown
          >
          <p v-else class="tw-text-md">Covid Result</p>
        </q-btn>
      </q-page-sticky>
    </div>
  </div>
  <loader-dialog v-model="loading" persistent />
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
        label="Save"
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
    <q-card>
      <q-card-section>
        <div class="tw-text-xl text-center">
          Have you finished enrolling this patient ? <br />
          By quitting you can no longer continue the process
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Oui" color="blue" @click="endStatus = true" />
        <q-btn label="Non" color="red" @click="leaveStatut = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
    <base-dialog
     v-model="consentementModal"
      persistent color="red"
      title="Consentement"
      size="md"
      >
    <q-card>
      <q-card-section>
        <div class="tw-text-md">
         <p class="tw-font-semibold tw-m-2">CONFIDENTIALITY</p>
        Explain how confidentiality will be protected, and who will have access to the data.

      <p class="tw-font-semibold tw-m-2"> WHAT THE STUDY IS ABOUT?</p>
        This research involves answering some questions related to your health and background. Depending on
        your answers, you may need to get a test for Covid-19 or malaria. This will be decided using the digital
        tool. You will also be tested for diabetes and high blood pressure unless you are among the excluded
        groups. You will receive the results of your tests, treatment for malaria if positive. You will then be
        advised on further care.
       <p class="tw-font-semibold tw-m-2">VOLUNTARY PARTICIPATION</p>
        Your participation is voluntary and you can withdraw at any time after having agreed to participate. You
        are free to refuse to accept any procedure. If you have any questions about this research, you may ask me,
        or contact [provide details for someone at C+O – Adama?). You can also
       <p class="tw-font-semibold tw-m-2"> CONSENTING TO PARTICIPATE</p>
        Checking this box confirms that the CHW has read the above script to the participant and they have
        provided informed consent to participate in the study.
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="I Agree" color="blue" @click="consentementModal = false" />
        <q-btn label="I disagree" color="red" @click="consentement()" />
      </q-card-actions>
    </q-card>
  </base-dialog>
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
      isEndProcess:false,
      consentementModal:false,
      leaveStatut: false,
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
      covidTimer: 0,
      malariaTimer: 0,
      activeMalaria: false,
      activeCovid: false,
      endStatus: false,
    };
  },
  methods: {
    endProcess(){
      this.isEndProcess = true

    },
    consentement(){
       window.location.href = '/';
    },
    startCountdownMalaria(n: number) {
      this.activeMalaria = true;
      this.store.setActiveMalaria(true);
      this.malariaTimer = n * 1000;
      this.disableBtnM = true;
    },
    onCountdownEndMalaaria() {
      this.disableBtnM = false;
      console.log('end');
    },
    startCountdownCovid(n: number) {
      this.activeCovid = true;
      this.store.setActiveCovid(true);
      this.covidTimer = n * 1000;
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
          ? 'Enter Covid result'
          : 'Enter malaria result';
      console.log('Ckiked');
    },
    onFormDialogClose() {
      this.loading = false;
      this.saveBtn = false;
      this.open = false;
    },
    leaveRoute: async function () {
      this.$q
        .dialog({
          title: 'Do you want to exit the process ?',
          message: 'By exiting you confirm that this process is complete',
          ok: {
            push: true,
          },
          cancel: {
            push: true,
            color: 'negative',
          },
          persistent: true,
        })
        .onOk(() => {
          return true;
        })
        .onCancel(() => {
          //
          return false;
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
          return false;
        });
    },
    async submit() {
      if (await this.v$.rdtTestResult.$validate()) {
        const fileData = new FormData();
        this.loading = true;
        this.saveBtn = true;
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
              this.store.setCovidResult(response.data.data)
              this.store.setActiveCovid(false)          ;
              console.log('covid', response.data);
              this.loading = false;
            } else if (response.data.data.rdt_type === 'malaria') {
              this.hideMalariaBtn = false;
              this.store.setMalariaResult(response.data.data);
              this.store.setActiveMalaria(false);
              console.log('covid', response.data);
              this.loading = false;
            }
          });
      }
    },
    isLoading(status: boolean) {
      this.loading = status;
    },
  },
  async created() {
    if (this.$route.params.id !== undefined) {
      this.isLoading(true);
      const { data } = await api.get(`/patients/${this.$route.params.id}`);
      this.store.init(data.data);
      if (!this.store.tabs.includes('alarms')) {
        this.store.setTabs('alarms');
      }
      this.isLoading(false);
      let lastPosition = this.store.tabs.slice(-1);
      this.next(lastPosition[0]);

    }else{
      if(this.store.currentPatient.id === undefined){
        this.consentementModal = true
      }

    }
      let lastPosition = this.store.tabs.slice(-1)
      this.next(lastPosition[0])
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
      q$: useQuasar(),
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
  async beforeRouteLeave(to, from, next) {
    if(this.isEndProcess===false){
    this.$q
      .dialog({
        title: 'Do you want to exit the process ?',
        message: 'By exiting you confirm that this process is complete',
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative',
        },
        persistent: true,
      })
      .onOk(() => {
        this.store.resetStore();
        window.location.href = to.fullPath;
      })
      .onCancel(() => {
        return false;
      })
      .onDismiss(() => {
        return false;
      });
    }else{
      next(true)
    }
    next(false);
  },
};
</script>
