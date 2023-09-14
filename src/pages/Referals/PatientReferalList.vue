<template>
  <div>
    <div class="q-pa-md">
      <div class="row">
        <div class="col-6">
          <q-input
            filled
            :model-value="
              filters.dateRange != null
                ? `${filters.dateRange.from} - ${filters.dateRange.to}`
                : '-'
            "
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="filters.dateRange" range>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-separator />
          <q-btn
            style="width: 100%; height: auto; margin-top: 5%"
            color="white"
            text-color="black"
            :label="$t('filtered')"
            @click="find()"
            :loading="loadingBtn"
          />
        </div>
        <div class="col-3" v-for="p_refered in allTree" :key="p_refered[0]">
          <q-tree
            :nodes="p_refered"
            node-key="label"
            selected-color="primary"
            default-expand-all
          >
            <template v-slot:default-header="prop">
              <div class="row items-center">
                <div
                  v-if="prop.node.label.split(':').length == 2"
                  class="text-weight-bold text-primary"
                >
                  {{
                    $t(prop.node.label.split(':')[0]) +
                    ' : ' +
                    prop.node.label.split(':')[1]
                  }}
                </div>
                <div v-else class="text-weight-bold text-primary">
                  {{ $t(prop.node.label.split(':')[0]) }}
                </div>
              </div>
            </template>
          </q-tree>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="q-pa-md">
            <q-table
              class="my-sticky-header-column-table"
              title="Patient Must Be Referred"
              :rows="patientReferred"
              :columns="columns"
              row-key="name"
            >
              <template v-slot:header="props">
                <q-td
                  style="font-weight: bold"
                  v-for="head in props.cols"
                  :key="head.name"
                >
                  {{ $t(`${head.name}`) }}
                </q-td>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props" @click="onRowClick(props.row)">
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    <div v-if="col.name === 'patient_uid'">
                      <span>{{ props.row.patient_uid }}</span>
                    </div>
                    <div v-else-if="col.name === 'name'">
                      <span>{{ props.row.patient_name }}</span>
                    </div>
                    <div v-else-if="col.name === 'phone_number'">
                      <span>{{ props.row.phone_number }}</span>
                    </div>

                    <div
                      :class="
                        flagColor(
                          typeof props.row.glucoseReferalData !== 'undefined'
                            ? props.row.glucoseReferalData
                            : 'n_e'
                        )
                      "
                      v-else-if="col.name === 'glucose'"
                    >
                      <span>{{
                        $t(smartShowing(props.row.glucoseReferalData))
                      }}</span>
                    </div>
                    <div
                      :class="
                        col.name === 'bloodPressure'
                          ? flagColor(
                              typeof props.row.bloodPressureReferalData !==
                                'undefined'
                                ? props.row.bloodPressureReferalData
                                : 'n_e'
                            )
                          : ''
                      "
                      v-else-if="col.name === 'bloodPressure'"
                    >
                      <span>{{
                        $t(smartShowing(props.row.bloodPressureReferalData))
                      }}</span>
                    </div>

                    <div
                      :class="
                        flagColor(
                          typeof props.row.malariaReferalData !== 'undefined'
                            ? props.row.malariaReferalData
                            : 'n_e'
                        )
                      "
                      v-else-if="col.name === 'malaria'"
                    >
                      <span>{{
                        $t(smartShowing(props.row.malariaReferalData))
                      }}</span>
                    </div>
                    <div
                      :class="
                        flagColor(
                          typeof props.row.covidReferalData !== 'undefined'
                            ? props.row.covidReferalData
                            : 'n_e'
                        )
                      "
                      v-else-if="col.name === 'covid'"
                    >
                      <span>{{
                        $t(smartShowing(props.row.covidReferalData))
                      }}</span>
                    </div>

                    <div
                      :class="
                        flagColor(
                          typeof props.row.malnutritionReferalData !==
                            'undefined'
                            ? props.row.malnutritionReferalData
                            : 'n_e'
                        )
                      "
                      v-else-if="col.name === 'malnutrition'"
                    >
                      <span>{{
                        $t($t(smartShowing(props.row.malnutritionReferalData)))
                      }}</span>
                    </div>

                    <div
                      :class="flagColorConfirmed(props.row.r_confirmed)"
                      v-else-if="col.name === 'r_confirmed'"
                    >
                      <span>{{ $t(props.row.r_confirmed) }}</span>
                    </div>
                    <p v-else>{{ props.row.patient_id }}</p>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { ref } from 'vue';
import { api } from 'src/boot/axios';

export default {
  data() {
    return {
      filters: {},
      dateRange: {
        from: null,
        to: null,
      },
      allTree: [],
      total: 0,
      columns: [
        {
          name: 'patient_uid',
          required: true,
          align: 'center',
          label: 'patient_uid',
          align: 'left',
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'name',
          align: 'center',
          label: 'name',
          field: 'calories',
          sortable: true,
        },
        {
          name: 'phone_number',
          label: 'phone_number',
          align: 'center',
          field: 'fat',
          sortable: true,
        },

        {
          name: 'glucose',
          label: 'glucose',
          field: 'fat',
          align: 'center',
          sortable: true,
        },
        {
          name: 'bloodPressure',
          label: 'bloodPressure',
          field: 'fat',
          align: 'center',
          sortable: true,
        },
        {
          name: 'malaria',
          label: 'malaria',
          field: 'fat',
          align: 'center',
          sortable: true,
        },
        {
          name: 'covid',
          label: 'covid',
          field: 'fat',
          align: 'center',
          sortable: true,
        },
        {
          name: 'malnutrition',
          label: 'malnutrition',
          field: 'fat',
          align: 'center',
          sortable: true,
        },
        {
          name: 'r_confirmed',
          label: 'r_confirmed',
          field: 'fat',
          align: 'center',
          sortable: true,
        },
      ],
      patientReferred: [],
    };
  },
  methods: {
    onRowClick(row) {
      this.$router.replace(`/referals/${row.patient_id}`);
    },
    flagColor(flag) {
      if (flag === 'done') {
        return 'text-center bg-positive text-white';
      } else if (flag === 'n_e') return 'text-center bg-info text-white';
      else {
        return 'text-center bg-negative text-white';
      }
    },
    flagColorConfirmed(flag) {
      if (flag === 'r_confirmed') {
        return 'text-center bg-positive text-white';
      } else {
        return 'text-center bg-negative text-white';
      }
    },
    smartShowing(data) {
      if (typeof data !== 'undefined' && data != null) {
        return data;
      } else {
        return "don't need";
      }
    },
    dataFormatting(data) {
      data.forEach((element) => {
        const referal = new Object();
        referal.patient_id = element.id;
        referal.patient_name = element.name;
        referal.phone_number = element.phone_number;
        referal.patient_uid = element.patient_uid;
        referal.r_confirmed =
          element.referal.length > 0 ? 'r_confirmed' : 'n_confirmed';

        element.referals.forEach((condition) => {
          if (condition.referal_type == 'covid') {
            referal.covidReferalData =
              condition.refered_by !== null ? 'done' : 'Not completed';
          }
          if (condition.referal_type == 'malaria') {
            referal.malariaReferalData =
              condition.refered_by !== null ? 'done' : 'Not completed';
          }
          if (condition.referal_type == 'malnutrition') {
            referal.malnutritionReferalData =
              condition.refered_by !== null ? 'done' : 'Not completed';
          }
          if (condition.referal_type == 'glucose') {
            referal.glucoseReferalData =
              condition.refered_by !== null ? 'done' : 'Not completed';
          }
          if (condition.referal_type == 'bloodPressure') {
            referal.bloodPressureReferalData =
              condition.refered_by !== null ? 'done' : 'Not completed';
          }
        });
        this.patientReferred.push(referal);
      });
    },
    getReferalPatient() {
      api.get('/referal').then((response) => {
        this.dataFormatting(response.data.data);
      });
    },
    getStatsPatient() {
      api.get('/referStats').then((response) => {
        this.allTree = response.data.data.tree;
      });
    },

    find() {
      this.loadingBtn = true;
      api
        .post('findReferal', this.filters)
        .then((response) => {
          if (
            response.data.status !== undefined &&
            response.data.status === 'success'
          ) {
            this.allTree = response.data.data.tree;
            this.loadingBtn = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  setup() {
    return {
      splitterModel: ref(50),
      selected: ref('Food'),
    };
  },
  async mounted() {
    this.getReferalPatient();
    this.getStatsPatient();
  },
};
</script>

  
  