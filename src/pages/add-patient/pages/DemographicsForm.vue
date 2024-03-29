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
                :label="$t('patient.date_of_birth')"
                filled
                :validator="v$.patient.date_of_birth"
                v-model="patient.date_of_birth"
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date
                        :navigation-max-year-month="maxDate()"
                        minimal
                        v-model="patient.date_of_birth"
                        @update:model-value="disabledFields($event)"
                      >
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
                :label="$t('patient.date_of_birth')"
                v-else
                :validator="v$.patient.date_of_birth"
                v-model="patient.date_of_birth"
                @blur="getAge"
                @update:model-value="disabledFields($event)"
              />
            </div>
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
              :disable="!isWoman || pregnantStatus"
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

            <base-select
              filled
              :validator="v$.patient.town"
              use-input
              :label="$t('patient.town')"
              v-model="patient.town"
              :options="townOptions"
              @update:model-value="getQuartiers"
              :display-value="
                patient.town ? $t(`${patient.town.prefectures}`) : ''
              "
              @filter="filterFn"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{
                      $t(`${scope.opt.prefectures}`)
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </base-select>

            <!-- <base-input
              :label="$t('patient.town')"
              v-model="patient.town"
              :disable="false"
              :validator="v$.patient.town"
            /> -->
            <base-select
              :options="sPrefectures"
              :label="$t('patient.quartier')"
              v-model="patient.quartier"
              :validator="v$.patient.quartier"
              new-value-mode="add"
              use-input
              @update:model-value="getSectors"
              :display-value="
                patient.quartier ? $t(`${patient.quartier.quartiers}`) : ''
              "
              @filter="filterQuartiersFn"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{
                      $t(`${scope.opt.quartiers}`)
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </base-select>

            <base-select
              ref="smartAdd"
              :options="sectorS"
              label="Secteur"
              v-model="patient.sector"
              :validator="v$.patient.sector"
              new-value-mode="add"
              use-input
              :display-value="
                patient.sector ? $t(`${patient.sector.secteurs}`) : ''
              "
              @filter="filterSectorsFn"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{
                      $t(`${scope.opt.secteurs}`)
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </base-select>

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
              :disable="disabledByAge"
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
              :disable="disabledByAge"
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

            <base-select
              :disable="disabledByAge"
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
            <base-select
              :label="$t('patient.type_of_consultation')"
              v-model="patient.type_of_consultation"
              :options="typeOfConsultation"
              :validator="v$.patient.type_of_consultation"
              :display-value="
                patient.type_of_consultation
                  ? $t(`${patient.type_of_consultation}`)
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
            <base-select
              class="tw-full"
              v-model="patient.would_you_be_willing_to_subscribe"
              :label="$t('patient.would_you_be_willing_to_subscribe')"
              :options="howMuchCanYouPaye"
              :display-value="
                patient.would_you_be_willing_to_subscribe
                  ? $t(`${patient.would_you_be_willing_to_subscribe}`)
                  : ''
              "
            >
              <template v-slot:option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  :disable="disabledByAge && scope.opt != '$10 - $12'"
                >
                  <q-item-section>
                    <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </base-select>

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
                <q-item
                  v-bind="scope.itemProps"
                  :disable="disabledByAge && scope.opt != 'Yes'"
                >
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
import { required, maxValue, numeric, minLength } from '@vuelidate/validators';
import moment from 'moment';
import { useAppStore } from 'src/stores/appStor';
import { date } from 'quasar';
import Compressor from 'compressorjs';

export default {
  emits: [],
  data() {
    return {
      disabledByAge: false,
      pregnantStatus: true,
      path: backendImagePath,
      sPrefectures: [],
      sectorO: [
        'Bambaya',
        'Bentouraya',
        'CBA',
        'Fassia',
        'Friguiady',
        'Gomboyah',
        'Hermakono',
        'Kalokoya',
        'Kassonya',
        'Kountia',
        'Sanoyah Km 36',
        'Sanoyah Rails',
        'Tanènè',
      ],
      sectorS: [],
      receivedAtOptions: ['atTheHeadOfTheDistrict', 'atTheHeadOfTheDepartment'],

      birthDayStatus: true,
      alert: false,
      selected_file: '',
      image: '',
      imageUploadedUrl: '',
      patient: {
        town: '',
        quartier: '',
      } as Patient,
      Qoptions: ['Yes', 'No'],
      townOptions: [],
      filterLocationsOptions: [],
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
      howMuchCanYouPaye: ['$0', '$10 - $12', '$20 - $30'],
      typeOfConsultation: ['Teleconsultation', 'Homecare', 'Mass consultation'],
      matrimonialStatusOptions: ['Married', 'Divorced', 'Widow', 'Single'],
      cleanWaterOptions: ['Well water', 'Tap water', 'Mineral water'],
      sanitationOptions: ['Indoor toilet', 'Outdoor toilet'],
      distanceToHealthFacility: [
        'Less than 1 hour',
        '1 - 2 hours',
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
        name: { required, minLength: minLength(5) },
        gender: { required },
        do_you_know_date_of_birth: { required },
        date_of_birth: {
          required,
          maxValue: (value) => value <= moment().format('YYYY/MM/DD'),
        },

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
        type_of_consultation: { required },
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
    filterFn(val, update) {
      update(() => {
        if (val === '') {
          this.townOptions = this.townOptions;
        } else {
          const needle = val.toLowerCase();
          this.townOptions = this.townOptions.filter(
            (v) => v.prefectures.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    },
    filterQuartiersFn(val, update) {
      update(() => {
        if (val === '') {
          this.sPrefectures = this.sPrefectures;
        } else {
          const needle = val.toLowerCase();
          this.sPrefectures = this.sPrefectures.filter(
            (v) => v.quartiers.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    },
    filterSectorsFn(val, update) {
      update(() => {
        if (val === '') {
          this.sectorS = this.sectorS;
        } else {
          const needle = val.toLowerCase();
          this.sectorS = this.sectorS.filter(
            (v) => v.secteurs.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    },
    async prefectures() {
      const town = await api.get('/prefectures');
      this.townOptions = town.data.data;
      this.filterLocationsOptions = this.townOptions;
    },
    async getQuartiers(town) {
      this.patient.quartier = '';
      this.patient.sector = '';
      this.sPrefectures = [];
      this.sectorS = [];
      if (town !== null) {
        const quartiers = await api.get(
          `/quartiers?prefectures=${town.prefectures}`
        );
        this.sPrefectures = quartiers.data.data;
      }
    },

    async getSectors(quartiers) {
      this.patient.sector = '';
      this.sectorS = [];
      if (quartiers !== null) {
        const sectors = await api.get(
          `/sectors?prefectures=${this.patient.town.prefectures}&quartiers=${quartiers.quartiers}`
        );
        this.sectorS = sectors.data.data;
      }
    },

    maxDate() {
      const d = date.formatDate(Date.now(), 'YYYY/MM/DD');
      return d;
    },
    disabledFields(date_of_birth) {
      this.disabledByAge = moment().diff(date_of_birth, 'years') < 18;
      this.patient.profession = null;
      this.patient.daily_expenditure = null;
      this.patient.matrimonial_status = null;
      this.patient.would_you_be_willing_to_subscribe = null;
      this.patient.would_you_like_medical_card = null;
    },
    disabledPregnant() {
      this.pregnantStatus =
        moment().diff(this.patient.date_of_birth, 'years') <= 13;
    },
    async getAge() {
      let age = moment().year();
      let year = age - this.patient.date_of_birth;
      let date = new Date(year, 0, 1);
      this.patient.date_of_birth = moment(date).format('YYYY/MM/DD');
      this.birthDayStatus = false;
      this.disabledFields(this.patient.date_of_birth);
    },
    updateIsWoman(value: string) {
      if (value == 'Female') {
        this.disabledPregnant();
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
      if (!this.disabledByAge) {
        if (
          (await this.v$.patient.level_of_education.$validate()) &&
          (await this.v$.patient.profession.$validate()) &&
          (await this.v$.patient.daily_expenditure.$validate()) &&
          (await this.v$.patient.matrimonial_status.$validate()) &&
          (await this.v$.patient.type_of_consultation.$validate()) &&
          (await this.v$.patient.access_to_drinking_water.$validate()) &&
          (await this.v$.patient.access_to_toilet.$validate()) &&
          (await this.v$.patient.rubbish_collection_services.$validate()) &&
          (await this.v$.patient.time_to_nearest_health_facility.$validate()) &&
          (await this.v$.patient.last_visit_to_doctor.$validate()) &&
          (await this.v$.patient.hmd_visits_in_last_year.$validate())
        ) {
          return true;
        }
      } else {
        if (
          (await this.v$.patient.level_of_education.$validate()) &&
          (await this.v$.patient.access_to_drinking_water.$validate()) &&
          (await this.v$.patient.time_to_nearest_health_facility.$validate()) &&
          (await this.v$.patient.access_to_toilet.$validate()) &&
          (await this.v$.patient.rubbish_collection_services.$validate()) &&
          (await this.v$.patient.type_of_consultation.$validate()) &&
          (await this.v$.patient.last_visit_to_doctor.$validate()) &&
          (await this.v$.patient.hmd_visits_in_last_year.$validate())
        ) {
          return true;
        }
      }
    },
    async testStep3() {
      if (!this.disabledByAge) {
        if (
          (await this.v$.patient.would_you_be_willing_to_subscribe.$validate()) &&
          (await this.v$.patient.would_you_like_medical_card.$validate()) &&
          (await this.v$.patient.testing_services_and_medical_for_free.$validate())
        ) {
          return true;
        }
      } else {
        if (
          (await this.v$.patient.would_you_be_willing_to_subscribe.$validate()) &&
          (await this.v$.patient.would_you_like_medical_card.$validate()) &&
          (await this.v$.patient.testing_services_and_medical_for_free.$validate())
        ) {
          return true;
        }
      }
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
      new Compressor(this.image, {
        quality: 0.6,

        // The compression process is asynchronous,
        // which means you have to access the `result` in the `success` hook function.
        success(result) {
          const fileData = new FormData();

          fileData.append('photo', result, result.name);
          fileData.append('patient_id', patient_id);
          const uploadFile = api
            .post('/upload', fileData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((response) => {
              console.log(response.data);
            });
        },
        error(err) {
          console.log('Error', err.message);
        },
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
      this.patient.date_of_birth = null;
      this.patient.gender = null;
      this.patient.pregnant = null;
    },
  },
  created() {
    this.prefectures();
    this.disabledPregnant();
    this.patient.photo = '';
    this.patient.do_you_know_date_of_birth = 'Yes';
    if (this.store.currentPatient.id) {
      this.disabledFields(this.store.currentPatient.date_of_birth);
      this.patient = this.store.currentPatient;
      this.imageUploadedUrl = this.path + '' + this.patient.photo;
    }
  },
  setup() {
    return {
      model: ref(''),
      step: ref(1),
      v$: useVuelidate(),
      store: useAppStore(),
    };
  },
};
</script>
