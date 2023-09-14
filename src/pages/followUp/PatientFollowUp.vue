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
              title="Patient must be followed"
              :rows="patientFollowed"
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
                    <p v-if="col.name === 'patient_uid'">
                      {{ props.row.patient_uid }}
                    </p>
                    <p v-else-if="col.name === 'name'">
                      {{ props.row.patient_name }}
                    </p>
                    <p v-else-if="col.name === 'town'">
                      {{ props.row.town }}
                    </p>
                    <p v-else-if="col.name === 'quartier'">
                      {{ props.row.quartier }}
                    </p>
                    <p v-else-if="col.name === 'phone_number'">
                      {{ props.row.phone_number }}
                    </p>

                    <p v-else-if="col.name === 'confirmedDate'">
                      {{ props.row.confirmedDate }}
                    </p>

                    <p
                      v-else-if="col.name === 'daysLeft'"
                      :class="
                        flagFollowUp(props.row.daysLeft, props.row.is_done)
                      "
                    >
                      {{
                        $t(flagPosition(props.row.daysLeft, props.row.is_done))
                      }}
                    </p>

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
import moment from 'moment';

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
          sortable: true,
        },
        {
          name: 'town',
          align: 'center',
          label: 'name',
          sortable: true,
        },
        {
          name: 'quartier',
          align: 'center',
          label: 'name',
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
          name: 'confirmedDate',
          label: 'confirmedDate',
          align: 'center',
          field: 'fat',
          sortable: true,
        },

        {
          name: 'daysLeft',
          label: 'daysLeft',
          align: 'center',
          field: 'fat',
          sortable: true,
        },
      ],
      patientFollowed: [],
    };
  },
  methods: {
    onRowClick(row) {
      this.$router.replace(`/detail-followup/${row.patient_id}`);
    },
    flagPosition(dayLeft, isDone) {
      if (dayLeft == 0 && isDone == 0) {
        return `${dayLeft}`;
      } else if (dayLeft < 0 && isDone == 0) {
        return `${dayLeft}`;
      } else if (dayLeft > 0 && isDone == 0) {
        return `+ ${dayLeft}`;
      } else {
        return 'follow_completed';
      }
    },
    flagFollowUp(dayLeft, isDone) {
      if (dayLeft == 0 && isDone == 0) {
        return 'text-center bg-negative text-white';
      } else if (dayLeft < 0 && isDone == 0) {
        return 'text-center bg-negative text-white';
      } else if (dayLeft > 0 && isDone == 0) {
        return 'text-center bg-negative text-white';
      } else {
        return 'text-center bg-positive text-white';
      }
    },
    daysSinceLastDate(date) {
      let now = moment();
      let dateSinceReferred = moment(date);
      let calDaysSinceReferred = now.diff(dateSinceReferred, 'days');
      return calDaysSinceReferred - 7;
    },
    dataFormatting(data) {
      data.forEach((element) => {
        const referal = new Object();
        referal.patient_id = element.id;
        referal.patient_name = element.name;
        referal.phone_number = element.phone_number;
        referal.patient_uid = element.patient_uid;
        referal.town = element.town;
        referal.quartier = element.quartier;
        referal.is_done = element.follow.length > 0 ? 1 : 0;
        referal.confirmedDate = moment(element.referal[0].created_at).format(
          'DD/MM/YYYY'
        );
        referal.daysLeft = this.daysSinceLastDate(
          moment(element.referal[0].created_at)
        );
        this.patientFollowed.push(referal);
      });
    },
    getFollowUpPatient() {
      api.get('/follows').then((response) => {
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
    this.getFollowUpPatient();
    this.getStatsPatient();
  },
};
</script>

<style>
p {
  text-align: start;
}
</style>
