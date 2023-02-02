<template>
  <div class="q-pa-md">
    <q-stepper v-model="step" ref="stepper" color="primary" animated>
      <q-step
        :name="1"
        :title="$t('patient.demographicsDetails')"
        icon="settings"
        :done="step > 1"
        :contracted="false"
      >
        <div>
          <h1>Information</h1>
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-3">
            <base-input
              :label="$t('patient.name')"
              v-model="patient.name"
              :validator="v$.patient.name"
            />
            <base-select
              filled
              :label="$t('patient.gender')"
              v-model="patient.gender"
              :options="GenderOptions"
              @update:model-value="updateIsWoman"
              :validator="v$.patient.gender"
              :display-value="patient.gender ? $t(`${patient.gender}`) : ''"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </base-select>
            <base-select
              :label="$t('patient.pregnant')"
              v-model="patient.pregnant"
              :options="YesOrNoOptions"
              :disable="!isWoman"
              :validator="v$.patient.pregnant"
              :display-value="patient.pregnant ? $t(`${patient.pregnant}`) : ''"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </base-select>
            <base-select
              :label="$t('patient.do_you_know_date_of_birth')"
              v-model="patient.do_you_know_date_of_birth"
              :options="Qoptions"
              :validator="v$.patient.do_you_know_date_of_birth"
              @update:model-value="updatBirthdayKnow"
              :display-value="
                patient.do_you_know_date_of_birth
                  ? $t(`${patient.do_you_know_date_of_birth}`)
                  : ''
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
            <div>
              <base-input
                v-if="birthDayStatus === true"
                filled
                    :validator="v$.patient.date_of_birth"
                v-model="patient.date_of_birth"
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date v-model="patient.date_of_birth">
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-btn
                            label="OK"
                            color="primary"
                            flat
                            v-close-popup
                          />
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
                  :label="$t('patient.pickFiles')"
                  icon="camera_enhance"
                >
                  <q-tooltip>{{ $t(`${imageUploadedUrl}`) }}</q-tooltip>
                  <q-uploader-add-trigger></q-uploader-add-trigger>
                </q-btn>
              </template>

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
              :label="$t('patient.town')"
              v-model="patient.town"
              :disable="true"
              :validator="v$.patient.town"
            />
            <base-select
              :options="sPrefectures"
              :label="$t('patient.quartier')"
              v-model="patient.quartier"
              :validator="v$.patient.quartier"
            />
            <base-select
              :options="patient.quartier == 'Soyah' ? sectorS : sectorO"
              label="Secteur"
              v-model="patient.sector"
              :validator="v$.patient.sector"
            />

            <div class="q-gutter-sm">
              <q-checkbox
                :validator="v$.patient.do_you_have_access_to_telephone"
                @update:model-value="updateHavePhone"
                v-model="patient.do_you_have_access_to_telephone"
                :label="$t('patient.do_you_have_access_to_telephone')"
              />
            </div>
            <base-select
              :label="$t('patient.phone_type')"
              v-model="patient.phone_type"
              :options="typePhoneOptions"
              :disable="!havePhone"
              :validator="v$.patient.phone_type"
              :display-value="
                patient.phone_type ? $t(`${patient.phone_type}`) : ''
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
            <phone-input
              :label="$t('patient.phone_number')"
              v-model="patient.phone_number"
              :disable="!havePhone"
              :validator="v$.patient.phone_number"
            />
          </div>
        </div>
      </q-step>

      <q-step
        :name="2"
        :title="$t('patient.socialEconomic')"
        icon="create_new_folder"
        :done="step > 2"
      >
        <div>
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-3">
            <base-select
              :label="$t('patient.level_of_education')"
              v-model="patient.level_of_education"
              :options="educationLevels"
              :validator="v$.patient.level_of_education"
              :display-value="
                patient.level_of_education
                  ? $t(`${patient.level_of_education}`)
                  : ''
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

            <base-select
              :label="$t('patient.profession')"
              v-model="patient.profession"
              :options="professionOptions"
              :validator="v$.patient.profession"
              :display-value="
                patient.profession ? $t(`${patient.profession}`) : ''
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

            <base-select
              :label="$t('patient.daily_expenditure')"
              v-model="patient.daily_expenditure"
              :options="dailyIncomeOptions"
              :validator="v$.patient.daily_expenditure"
              :display-value="
                patient.daily_expenditure
                  ? $t(`${patient.daily_expenditure}`)
                  : ''
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

            <!-- <money-input
              :label="$t('patient.daily_expenditure')"
              v-model="patient.daily_expenditure"
              :validator="v$.patient.daily_expenditure"
            /> -->
            <base-select
              :label="$t('patient.matrimonial_status')"
              v-model="patient.matrimonial_status"
              :options="matrimonialStatusOptions"
              :validator="v$.patient.matrimonial_status"
              :display-value="
                patient.matrimonial_status
                  ? $t(`${patient.matrimonial_status}`)
                  : ''
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
            <div />
            <div />
            <base-select
              :validator="v$.patient.access_to_drinking_water"
              @update:model-value="updateHavePhone"
              v-model="patient.access_to_drinking_water"
              :label="$t('patient.access_to_drinking_water')"
              :options="cleanWaterOptions"
              :display-value="
                patient.access_to_drinking_water
                  ? $t(`${patient.access_to_drinking_water}`)
                  : ''
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
            <base-select
              :validator="v$.patient.access_to_toilet"
              @update:model-value="updateHavePhone"
              v-model="patient.access_to_toilet"
              :label="$t('patient.access_to_toilet')"
              :options="sanitationOptions"
              :display-value="
                patient.access_to_toilet
                  ? $t(`${patient.access_to_toilet}`)
                  : ''
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
            <base-select
              :validator="v$.patient.rubbish_collection_services"
              @update:model-value="updateHavePhone"
              v-model="patient.rubbish_collection_services"
              :label="$t('patient.rubbish_collection_services')"
              :options="YesOrNoOptions"
              :display-value="
                patient.rubbish_collection_services
                  ? $t(`${patient.rubbish_collection_services}`)
                  : ''
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

            <base-select
              :validator="v$.patient.time_to_nearest_health_facility"
              v-model="patient.time_to_nearest_health_facility"
              :label="$t('patient.time_to_nearest_health_facility')"
              :options="distanceToHealthFacility"
              :display-value="
                patient.time_to_nearest_health_facility
                  ? $t(`${patient.time_to_nearest_health_facility}`)
                  : ''
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

            <base-select
              :validator="v$.patient.last_visit_to_doctor"
              v-model="patient.last_visit_to_doctor"
              :label="$t('patient.last_visit_to_doctor')"
              :options="lastDrVisit"
              :display-value="
                patient.last_visit_to_doctor
                  ? $t(`${patient.last_visit_to_doctor}`)
                  : ''
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
            <base-input
              :validator="v$.patient.hmd_visits_in_last_year"
              :label="$t('patient.hmd_visits_in_last_year')"
              v-model="patient.hmd_visits_in_last_year"
            />
          </div>
        </div>
      </q-step>

      <q-step
        :name="3"
        :title="$t('patient.willingnesstoPay')"
        icon="add_comment"
      >
        <div>
          <div class="tw-grid tw-grid-cols-1 tw-gap-3">
            <money-input
              min="120000"
              max="300000"
              :label="$t('patient.would_you_be_willing_to_subscribe')"
              v-model="patient.would_you_be_willing_to_subscribe"
              :validator="v$.patient.would_you_be_willing_to_subscribe"
            />
            <!-- <base-select
              v-model="patient.would_you_be_willing_to_subscribe"
              :label="$t('patient.would_you_be_willing_to_subscribe')"
              :options="YesOrNoOptions"
              :display-value="
                patient.would_you_be_willing_to_subscribe
                  ? $t(`${patient.would_you_be_willing_to_subscribe}`)
                  : ''
              "
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </base-select> -->
            <base-select
              class="tw-full"
              v-model="patient.would_you_like_medical_card"
              :label="$t('patient.would_you_like_medical_card')"
              :options="YesOrNoOptions"
              :display-value="
                patient.would_you_like_medical_card
                  ? $t(`${patient.would_you_like_medical_card}`)
                  : ''
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
            <base-select
              v-model="patient.testing_services_and_medical_for_free"
              :label="$t('patient.testing_services_and_medical_for_free')"
              :options="receivedAtOptions"
              :display-value="
                patient.testing_services_and_medical_for_free
                  ? $t(`${patient.testing_services_and_medical_for_free}`)
                  : ''
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
          </div>
        </div>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click.prevent="onSubmit($refs, step)"
            color="blue"
            :label="step === 3 ? $t('btnFinish') : $t('btnContinue')"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            :label="$t('btnBack')"
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
            @click="
              $emit('next', 'alarms');
              store.setTabs('alarms');
            "
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
import { required ,maxValue,numeric,minLength} from '@vuelidate/validators';
import moment from 'moment';
import { useAppStore } from 'src/stores/appStor';

export default {
  emits: [],
  data() {
    return {
      sPrefectures: ['Soyah', 'Oure Kaba'],
      receivedAtOptions: ['atTheHeadOfTheDistrict', 'atTheHeadOfTheDepartment'],
      sectorS: [
        'Soyah Centre',
        'Berteyah',
        'Farenta',
        'Nôbé',
        'Kenten',
        'Bhoully',
        'Fodeyah',
      ],
      sectorO: [
        'Kaba Centre',
        'Dian-Dian',
        'Kouloundala',
        'Sitakötö',
        'Banékötö',
        'Sogoroya',
        'Sébékötö',
        'Portofita',
        'Séléya',
        'Alphaya',
        'Bantamaya',
        'Kolimö',
        'Yomaya Limban',
      ],
      birthDayStatus: true,
      alert: false,
      selected_file: '',
      image: '',
      imageUploadedUrl: '',
      patient: {
        town: 'Mamou',
        quartier: 'Soyah',
      } as Patient,
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
        name: { required,minLength: minLength(5)},
        gender: { required },
        do_you_know_date_of_birth: { required },
        date_of_birth: { required, maxValue:value => value <= moment().format('YYYY/MM/DD')},

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
        hmd_visits_in_last_year: { required, numeric },
        would_you_be_willing_to_subscribe: { required },
        would_you_like_medical_card: { required },
        testing_services_and_medical_for_free: { required },
      },
    };
  },
  methods: {
    async getAge() {
      let age = moment().year();
      let year = age - this.patient.date_of_birth;
      let date = new Date(year, 0, 1);
      this.patient.date_of_birth = moment(date).format('YYYY/MM/DD');
      this.birthDayStatus = false;
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
          const date1 = new Date();
          this.patient.date_of_registration = moment(date1).format(
            'YYYY-MM-DD HH:mm:ss'
          );
          this.patient.date_of_birth = moment(
            this.patient.date_of_birth
          ).format('YYYY-MM-DD HH:mm:ss');

          if (this.store.currentPatient.id === undefined) {
            this.$emit('isLoading', true);
            const { data } = await api.post('/patients', this.patient);
            this.$emit('isLoading', false);
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
            this.alert = true;
            this.$emit('next', 'alarms');
            this.store.setTabs('alarms');
          } else {
            this.$emit('isLoading', true);
            const { data } = await api.put(
              `/patients/${this.store.currentPatient.id}`,
              this.patient
            );
            this.$emit('isLoading', false);
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
            this.alert = true;
            this.$emit('next', 'alarms');
            this.store.setTabs('alarms');
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
    updatBirthdayKnow(value) {
      console.log('Value', value);
      if (value === 'No') {
        this.birthDayStatus = false;
      } else {
        this.birthDayStatus = true;
      }
    },
  },
  created() {
    this.patient.photo = '';
    this.patient.do_you_know_date_of_birth = 'Yes';
    if (this.store.currentPatient.id) {
      this.patient = this.store.currentPatient;
      this.imageUploadedUrl = this.patient.photo;
      console.log('bobo', this.imageUploadedUrl);
    }
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
