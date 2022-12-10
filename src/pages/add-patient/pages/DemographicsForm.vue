<template>
  <div class="q-pa-md">
    <q-stepper v-model="step" ref="stepper" color="primary" animated>
      <q-step
        :name="1"
        title="Demographics and Contact Details"
        icon="settings"
        :done="step > 1"
      >
        <div>
          <h1>Information</h1>
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-3">
            <base-input
              label="Name"
              v-model="patient.name"
              :validator="v$.patient.name"
            />
            <base-select
              label="Gender"
              v-model="patient.gender"
              :options="GenderOptions"
              @update:model-value="updateIsWoman"
              :validator="v$.patient.gender"
            />
            <base-select
              label="Pregnant"
              v-model="patient.pregnant"
              :options="YesOrNoOptions"
              :disable="!isWoman"
              :validator="v$.patient.pregnant"
            />
            <base-select
              label="Do you know date of birth"
              v-model="patient.do_you_know_date_of_birth"
              :options="Qoptions"
              :validator="v$.patient.do_you_know_date_of_birth"
               @update:model-value="updatBirthdayKnow"
              

            />
            <div>

            <base-input  v-if="birthDayStatus===true" filled v-model="patient.date_of_birth" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date v-model="patient.date_of_birth" >
                   <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="OK" color="primary" flat  v-close-popup />
                  </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </base-input>
             <base-input
                v-else
                :validator="v$.patient.date_of_birth"
                 v-model="patient.date_of_birth"
                 @blur="getAge"
              />
         
            <!-- <base-input
              v-if="patient.do_you_know_date_of_birth===true"
              :validator="v$.patient.date_of_birth"
              type="date"
              v-model="patient.date_of_birth"
            /> -->
          
            </div>

            <q-uploader
              color="teal"
              v-model="patient.photo"
              style="max-width: 300px"
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
              <!-- <template v-slot:header="scope">
                <q-btn
                  v-if="scope.canAddFiles"
                  type="a"
                  icon-right="camera"
                  label="Click here to take picture"
                  dense
                  flat
                >
                  <q-uploader-add-trigger></q-uploader-add-trigger>
                </q-btn>
              </template> -->
              <template v-slot:list="scope">
                <q-img
                  :src="imageUploadedUrl"
                  :alt="scope.name"
                  spinner-color="white"
                  style="height: 70px; max-width: 80px; margin-left: 30%"
                >
                </q-img>
              </template>
            </q-uploader>

            <base-input
              label="Town"
              v-model="patient.town"
              :validator="v$.patient.town"
            />
            <base-input
              label="Quartier"
              v-model="patient.quartier"
              :validator="v$.patient.quartier"
            />
            <base-input
              label="Secteur"
              v-model="patient.sector"
              :validator="v$.patient.sector"
            />

            <div class="q-gutter-sm">
              <q-checkbox
                :validator="v$.patient.do_you_have_access_to_telephone"
                @update:model-value="updateHavePhone"
                v-model="patient.do_you_have_access_to_telephone"
                label="Do you have access to a phone?"
              />
            </div>
            <base-select
              label="Type of phone"
              v-model="patient.phone_type"
              :options="typePhoneOptions"
              :disable="!havePhone"
              :validator="v$.patient.pregnant"
            />
            <phone-input
              label="Phone"
              v-model="patient.phone_number"
              :disable="!havePhone"
              :validator="v$.patient.phone_number"
            />
          </div>
        </div>
      </q-step>

      <q-step
        :name="2"
        title="Social-Economic Data"
        icon="create_new_folder"
        :done="step > 2"
      >
        <div>
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-3">
            <base-select
              label="Level of education"
              v-model="patient.level_of_education"
              :options="educationLevels"
              :validator="v$.patient.level_of_education"
            />

            <base-select
              label="Profession"
              v-model="patient.profession"
              :options="professionOptions"
              :validator="v$.patient.profession"
            />

            <money-input
              label="Daily Expenditure"
              v-model="patient.daily_expenditure"
              :validator="v$.patient.daily_expenditure"
            />
            <base-select
              label="Matrimonial Status"
              v-model="patient.matrimonial_status"
              :options="matrimonialStatusOptions"
              :validator="v$.patient.matrimonial_status"
            />
            <div />
            <div />
            <base-select
              :validator="v$.patient.access_to_drinking_water"
              @update:model-value="updateHavePhone"
              v-model="patient.access_to_drinking_water"
              label="Do you have access a drinking water?"
              :options="cleanWaterOptions"
            />
            <base-select
              :validator="v$.patient.access_to_toilet"
              @update:model-value="updateHavePhone"
              v-model="patient.access_to_toilet"
              label="Do you have access a toilet ?"
              :options="sanitationOptions"
            />
            <base-select
              :validator="v$.patient.rubbish_collection_services"
              @update:model-value="updateHavePhone"
              v-model="patient.rubbish_collection_services"
              label="Rubbish collection services ?"
              :options="YesOrNoOptions"
            />

            <base-select
              :validator="v$.patient.time_to_nearest_health_facility"
              v-model="patient.time_to_nearest_health_facility"
              label="Time to nearest health facility"
              :options="distanceToHealthFacility"
            />

            <base-select
              :validator="v$.patient.last_visit_to_doctor"
              v-model="patient.last_visit_to_doctor"
              label="Last visit to doctor"
              :options="lastDrVisit"
            />
            <base-input
              :validator="v$.patient.hmd_visits_in_last_year"
              label="How many doctors visits in last 12 months"
              v-model="patient.hmd_visits_in_last_year"
            />
          </div>
        </div>
      </q-step>

      <q-step :name="3" title="Willingness to pay" icon="add_comment">
        <div>
          <div class="tw-grid tw-grid-cols-1 tw-gap-3">
            <base-select
              v-model="patient.would_you_be_willing_to_subscribe"
              label="Would you be willing to subscribe to Clinic-O's program at the following price ?"
              :options="YesOrNoOptions"
            />
            <base-select
              class="tw-full"
              v-model="patient.would_you_like_medical_card"
              label="In this study, testing service medical ID card will be provided for free, would you like to received a medical ID card from C+O?"
              :options="YesOrNoOptions"
            />
            <base-select
              v-model="patient.testing_services_and_medical_for_free"
              label="In this study, testing services and medical ID card will be provided for free?"
              :options="YesOrNoOptions"
            />
          </div>
        </div>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click.prevent="onSubmit($refs, step)"
            color="blue"
            :label="step === 3 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
    <q-dialog
      v-model="alert"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Utilisateur creer avec success
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            @click="$emit('next', 'alarms');store.setTabs('alarms')"
            label="OK"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { Patient } from '../../../components/models';
import { api, backendImagePath } from 'src/boot/axios';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import moment from 'moment';
import { useAppStore } from 'src/stores/appStor';

export default {
    emits: [],
  data() {
    return {
      birthDayStatus:true,
      alert: false,
      selected_file: '',
      image: '',
      imageUploadedUrl: '',
      patient: {} as Patient,
      Qoptions: ['Yes', 'No'],
      GenderOptions: ['Male', 'Female'],
      isWoman: false,
      YesOrNoOptions: ['Yes', 'No'],
      typePhoneOptions: ['Smart phone', 'Feature phone'],
      havePhone: false,
      educationLevels: [
        'Illeterate',
        'Elementary',
        'Junior high school',
        'High School',
        'University',
      ],
      professionOptions: [
        'Formal sector',
        'Informal sector',
        'Retired',
        'Unemployed',
      ],
      dailyIncomeOptions: [
        'Less than $2',
        '$2-$4',
        '$4-$6',
        '$6-$10',
        'More than $10',
      ],
      matrimonialStatusOptions: ['Married', 'Divorced', 'Widow', 'Single'],
      cleanWaterOptions: ['Well water', 'Tap water', 'Mineral water'],
      sanitationOptions: ['Indoor toilet', 'Outdoor toilet'],
      distanceToHealthFacility: [
        'Less than 2 hours',
        '2 - 4 hours',
        '4 -8 hours',
        'More than 8 hours',
      ],
      lastDrVisit: [
        'Less than 3 months',
        '6 - 12 months',
        '1 - 2 years',
        'More than 3 years ',
      ],
    };
  },
  validations() {
    return {
      patient: {
        name: { required },
        gender: { required },
        do_you_know_date_of_birth: { required },
        date_of_birth: { required },

        photo: { required },
        town: { required },
        quartier: { required },
        sector: { required },
        do_you_have_access_to_telephone: { required },
        phone_number: { required },
        phone_type: { required },
        level_of_education: { required },
        profession: { required },
        daily_expenditure: { required },
        matrimonial_status: { required },
        access_to_drinking_water: { required },
        access_to_toilet: { required },
        rubbish_collection_services: { required },
        time_to_nearest_health_facility: { required },
        last_visit_to_doctor: { required },
        hmd_visits_in_last_year: { required },
        would_you_be_willing_to_subscribe: { required },
        would_you_like_medical_card: { required },
        testing_services_and_medical_for_free: { required },
      },
    };
  },
  methods: {
    async getAge(){
      let age = moment().year()
      let year = age - this.patient.date_of_birth
      let date = new Date(year,0,1)
      this.patient.date_of_birth = moment(date).format('YYYY/MM/DD'); 
      this.birthDayStatus=false
    },
    updateIsWoman(value: string) {
      if (value == 'Female') {
        this.isWoman = true;
        this.patient.pregnant = 'No';
      } else {
        this.patient.pregnant = undefined;
        this.isWoman = false;
      }
    },
    updateHavePhone(value: boolean) {
      this.havePhone = value;
    },
    async testStep1() {
      if (
        (await this.v$.patient.name.$validate()) &&
        (await this.v$.patient.gender.$validate()) &&
        (await this.v$.patient.date_of_birth.$validate()) &&
        (await this.v$.patient.town.$validate()) &&
        (await this.v$.patient.quartier.$validate()) &&
        (await this.v$.patient.sector.$validate())
      ) {
        return true;
      }
      return false;
    },
    async testStep2() {
      if (
        (await this.v$.patient.level_of_education.$validate()) &&
        (await this.v$.patient.profession.$validate()) &&
        (await this.v$.patient.daily_expenditure.$validate()) &&
        (await this.v$.patient.matrimonial_status.$validate()) &&
        (await this.v$.patient.access_to_drinking_water.$validate()) &&
        (await this.v$.patient.access_to_toilet.$validate()) &&
        (await this.v$.patient.rubbish_collection_services.$validate()) &&
        (await this.v$.patient.time_to_nearest_health_facility.$validate()) &&
        (await this.v$.patient.last_visit_to_doctor.$validate()) &&
        (await this.v$.patient.hmd_visits_in_last_year.$validate())
      ) {
        return true;
      }
      return false;
    },
    async testStep3() {
      if (
        (await this.v$.patient.would_you_be_willing_to_subscribe.$validate()) &&
        (await this.v$.patient.would_you_like_medical_card.$validate()) &&
        (await this.v$.patient.testing_services_and_medical_for_free.$validate())
      ) {
        return true;
      }
      return false;
    },
    async onSubmit(ref: any, step: number) {
      console.log('store', this.store.currentPatient);
      let result;
      if (step === 1) {
        result = await this.testStep1();
      } else if (step === 2) {
        result = await this.testStep2();
      } else {
        result = await this.testStep3();
      }

      if (result) {
        if (step < 3) {
          ref.stepper.next();
        } else {
          // console.log(files);
          // this.uploadFile();

          const date1 = new Date();
          this.patient.date_of_registration = moment(date1).format(
            'YYYY-MM-DD HH:mm:ss'
          );
           this.patient.date_of_birth = moment(this.patient.date_of_birth).format(
            'YYYY-MM-DD HH:mm:ss'
          );
          // (this.patient.hmd_visits_in_last_year = '12'),
          // (this.patient.do_you_know_date_of_birth = 'Yes');
          // this.patient.photo = 'image ';
          // console.log(this.patient.photo);
          if(this.store.currentPatient.id===undefined){
            this.$emit('isLoading', true)
                const { data } = await api.post('/patients', this.patient);
                this.$emit('isLoading', false)
          let photo = this.store.currentPatient.photo;
          if (this.image instanceof Blob) {
            this.uploadFile(data.data.id);
          }
          this.patient = data.data;
          this.store.init(data.data);
          if (this.image instanceof Blob) {
            this.store.currentPatient.photo = this.imageUploadedUrl;
          } else {
            this.store.currentPatient.photo = photo;
          }
          console.log('store', this.store);
          this.alert = true;
          this.$emit('next', 'alarms');
          this.store.setTabs('alarms')

          }else{
            this.$emit('isLoading', true)
          const { data } = await api.put(`/patients/${this.store.currentPatient.id}`, this.patient);
          this.$emit('isLoading', false)
          let photo = this.store.currentPatient.photo;
          if (this.image instanceof Blob) {
            this.uploadFile(data.data.id);
          }
          this.patient = data.data;
          this.store.init(data.data);
          if (this.image instanceof Blob) {
            this.store.currentPatient.photo = this.imageUploadedUrl;
          } else {
            this.store.currentPatient.photo = photo;
          }
          console.log('store', this.store);
          this.alert = true;
          this.$emit('next', 'alarms');
          this.store.setTabs('alarms')
          }
      
        }
      }
    },
    async uploadFile(patient_id) {
      const fileData = new FormData();

      fileData.append('photo', this.image);
      fileData.append('patient_id', patient_id);

      const uploadFile = api
        .post('/upload', fileData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          this.imageUploadedUrl = backendImagePath + response.data;
        });
    },
    file_selected: function (file) {
      this.image = file[0];
      this.imageUploadedUrl = URL.createObjectURL(this.image);
    },
    updatBirthdayKnow(value){
      console.log('Value', value)
      if(value==='No'){
        this.birthDayStatus = false
      }else{
        this.birthDayStatus= true
      }

    }
  },
  created() {
    this.patient.photo = '';
    this.patient.do_you_know_date_of_birth = 'Yes'
    this.patient = this.store.currentPatient;
    this.imageUploadedUrl = this.patient.photo;
    
  },
  setup() {
    return {
      step: ref(1),
      v$: useVuelidate(),
      store: useAppStore(),
    };
  },
};
</script>
