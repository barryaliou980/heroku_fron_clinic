<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ $t('printing') }}</div>
        <div class="text-subtitle2">{{ $t('printing_with_filter') }}</div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-3">
          <div>
            <base-select
              :label="$t('patient.town')"
              v-model="filters.town"
              :options="towns"
            />
          </div>
          <div>
            <base-select
              :options="sPrefectures"
              :label="$t('patient.quartier')"
              v-model="filters.quartier"
            />
          </div>
          <div>
            <base-select
              :options="filters.quartier == 'Soyah' ? sectorS : sectorO"
              label="Secteur"
              v-model="filters.sector"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          text-color="black"
          glossy
          unelevated
          icon="print"
          :label="$t('filtered')"
          @click="find()"
        />

        <q-btn
          text-color="black"
          glossy
          unelevated
          icon="print"
          :label="$t('printed')"
          @click="cardPrint()"
        />
      </q-card-actions>
      <q-separator inset />
      <q-card-section>
        <div id="patient_qrcode">
          <div class="row justify-content-center" style="margin-left: -5%">
            <!-- <div class="col-3" id="qrCard"></div> -->
            <div
              style="width: 31%; margin-bottom: 0.5%; margin-left: 1%"
              class="col-6"
              v-for="(patient, index) in patients"
              :key="index"
            >
              <div>
                <div
                  class="card-body justify-center"
                  :style="{
                    backgroundImage: 'url(' + image + ')',
                    backgroundPosition: 'center center',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    height: '450px',
                    width: '400px',
                  }"
                >
                  <div class="row">
                    <div class="col-3">
                      <img
                        :src="clinicOImage"
                        alt=""
                        style="
                          max-width: 300%;
                          width: 163%;
                          margin-left: 66%;
                          margin-top: 26%;
                        "
                      />
                    </div>
                    <div class="col-3">
                      <img
                        :src="backendQrCodePath + '' + patient.qrCode"
                        style="
                          max-width: 300%;
                          width: 182%;
                          margin-left: 10%;
                          margin-top: 87%;
                          margin-bottom: 16%;
                        "
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3">
                      <!-- <img class="photo" :src="imagePreview" alt="" /> -->
                      <img
                        class="photo"
                        :src="backendPhotoPath + '' + patient.photo"
                        alt=""
                      />
                    </div>
                    <div class="col-9" style="margin-left: 46%">
                      <div
                        class="row"
                        style="margin-top: -45%; margin-left: -61%"
                      >
                        <div class="col-12 text-center" style="margin-top: -2%">
                          <div v-if="patient.fullName.length == 3">
                            <span>
                              {{
                                patient.fullName[0] + ' ' + patient.fullName[1]
                              }}
                            </span>
                            <p>{{ patient.fullName[2] }}</p>
                          </div>
                          <div v-else-if="patient.fullName.length > 3">
                            <span>
                              {{
                                patient.fullName[0] + ' ' + patient.fullName[1]
                              }}
                            </span>
                            <p>
                              {{
                                patient.fullName[2] + ' ' + patient.fullName[3]
                              }}
                            </p>
                          </div>
                          <div
                            style="margin-top: inherit"
                            v-else-if="patient.fullName[0].length > 7"
                          >
                            <h3 class="mb-4">
                              <span
                                style="
                                  font-size: 12px;
                                  text-transform: uppercase;
                                "
                              >
                                {{
                                  patient.fullName[0] +
                                  '\n' +
                                  patient.fullName[1]
                                }}
                              </span>
                            </h3>
                          </div>

                          <div style="margin-top: inherit" v-else>
                            <h3 class="mb-4">
                              {{ patient.name }}
                            </h3>
                          </div>
                        </div>
                        <div class="col-12" style="margin-bottom: 5%">
                          <h4 class="text-center">
                            {{ getDOB(patient.date_of_birth) }}
                          </h4>
                          <h4 class="text-center">
                            ID: {{ patient.patient_uid }}
                          </h4>
                        </div>
                      </div>

                      <div class="row">
                        <h2 class="col-12 text-4">627 32 07 07</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { api, backendImagePath, backendqrCodePath } from 'src/boot/axios';
import moment from 'moment';

export default {
  name: 'QrCard',
  data: () => {
    return {
      filters: {},
      patients: [],
      backendQrCodePath: backendqrCodePath,
      backendPhotoPath: backendImagePath,
      fullName: 'Thierno Mamadou bobo barry',

      // logoURL:
      //   window.request_data.kiviCarePluginURL +
      //   'assets/images/ClinicO_Logo.svg',

      imagePreview: '../../../src/assets/test.jpg',
      // imagePreview: '../../../src/assets/test1.jpeg',
      qrImage: '../../../src/assets/3428.png',
      // image: pluginBASEURL + "assets/images/rectangle_6_copie_6.png",
      image: '../../../src/assets/cadre-et-crocher.png',
      clinicOImage: '../../../src/assets/clinic_o.png',
      sPrefectures: ['Soyah', 'Oure Kaba'],
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
      towns: ['Mamou', 'Conakry'],
    };
  },
  mounted() {
    this.init();
    // this.patientData.u_id = this.$route.params.pid
  },
  methods: {
    init: function () {
      this.fullName = this.fullName.split(' ');
    },
    find() {
      api
        .post('print', this.filters)
        .then((response) => {
          if (
            response.data.status !== undefined &&
            response.data.status === 'success'
          ) {
            this.patients = [];
            response.data.data.forEach((patient, index) => {
              patient['fullName'] = patient['name'].split(' ');
              patient['fullNameLength'] = patient['name'].length;
              this.patients.push(patient);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cardPrint() {
      var printContents = document.getElementById('patient_qrcode').innerHTML;
      var originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;

      window.print();

      document.body.innerHTML = originalContents;
      // if (this.$route.params.id !== undefined) {
      // $.confirm({
      //   title: this.formTranslation.clinic_schedule.dt_are_you_sure,
      //   content: this.formTranslation.new_forms.action_print_card,
      //   type: 'red',
      //   buttons: {
      //     ok: {
      //       text: this.formTranslation.common.yes,
      //       btnClass: 'btn-danger',
      //       keys: ['enter'],
      //       action: () => {
      //         post('set_as_printed', {
      //           patientID: this.$route.params.id,
      //         })
      //           .then((data) => {
      //             if (
      //               data.data.status !== undefined &&
      //               data.data.status === true
      //             ) {
      //               var printContents =
      //                 document.getElementById('qrCard').innerHTML;
      //               var originalContents = document.body.innerHTML;
      //               document.body.innerHTML = printContents;

      //               window.print();

      //               document.body.innerHTML = originalContents;
      //             }
      //           })
      //           .catch((error) => {
      //             console.log(error);
      //             displayErrorMessage(
      //               this.formTranslation.common.internal_server_error
      //             );
      //           });
      //       },
      //     },
      //     cancel: () => {},
      //   },
      // });
      // }
    },
    getDOB(value) {
      return moment(value).format('DD/MM/YYYY');
    },
    getLengthOfName(x) {
      if (typeof x !== 'undefined') {
        return x.length;
      }
    },
  },
  computed: {
    userData() {
      return this.$store.state.userDataModule.user;
    },

    // getSiteLogo(){
    //     return this.userData.site_logo
    // }
  },
};
</script>
<style scoped>
.photo {
  width: 91px;
  height: auto;
  margin-top: 20%;
  margin-left: 79%;
}

.text-4 {
  display: block;
  font-size: 25px;
  font-weight: bold;
  width: 300%;
  left: auto;
  color: black;
  top: 3%;
  /* text-align: center; */
  margin-top: -10%;
  margin-left: -2%;
  width: 11.58cm;
  height: 12cm;
  box-shadow: unset;
}

@media print {
  @page {
    background-color: white;
  }
}
</style>
