<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :separator="separator"
    >
      <template v-slot:top>
        <q-btn
          color="primary"
          :label="$t('add_consultation')"
          @click="openForm"
        />
        <q-space />
        <q-input
          borderless
          dense
          debounce="300"
          color="primary"
          v-model="filter"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:header="props">
        <q-td class="text-center" v-for="head in props.cols" :key="head.name">
          {{ $t(`${head.field}`) }}
        </q-td>
      </template>
      <template v-slot:body="props">
        <q-tr
          :props="props"
          :class="flagColor"
          @click="onRowClick(props.row.id, props.row)"
        >
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <div v-if="col.name === 'date_of_consult'">
              <p>{{ getDOB(col.value) }}</p>
            </div>
            <div v-else-if="col.name === 'type_consult'">
              <p>
                <q-badge
                  :color="
                    col.value == 'Mass consultation' ? 'secondary' : 'orange'
                  "
                  :label="col.value"
                />
              </p>
            </div>
            <div v-else-if="col.name === 'people_enrolled'">
              <p>
                <q-badge
                  rounded
                  color="green"
                  class="q-ml-xs"
                  :label="col.value"
                />
              </p>
            </div>
            <p v-else>{{ col.value }}</p>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <base-dialog v-model:open="showFormDialog" size="sm" persistent>
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-3">
        <q-separator />
        <base-select
          filled
          :label="$t('type_consult')"
          :validator="v$.consult.type_consult"
          v-model="consult.type_consult"
          :options="ConsultationOptions"
          :display-value="
            consult.type_consult ? $t(`${consult.type_consult}`) : ''
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
        <q-separator />
        <base-input
          filled
          label="Date"
          v-model="consult.date_of_consult"
          :validator="v$.consult.date_of_consult"
          mask="date"
          :rules="['date']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy>
                <q-date minimal v-model="consult.date_of_consult">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="OK" color="primary" flat v-close-popup />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </base-input>
        <base-select
          filled
          :validator="v$.consult.ahead"
          new-value-mode="add"
          use-input
          option-value="name"
          option-label="name"
          :label="$t('ahead')"
          v-model="consult.ahead"
          :options="agents"
          :display-value="consult.ahead ? $t(`${consult.ahead}`) : ''"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ $t(`${scope.opt.name}`) }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </base-select>
        <base-select
          filled
          new-value-mode="add"
          :validator="v$.consult.location_of_consult"
          use-input
          :label="$t('location_of_consult')"
          v-model="consult.location_of_consult"
          :options="filterOptions"
          :display-value="
            consult.location_of_consult
              ? $t(`${consult.location_of_consult}`)
              : ''
          "
          @filter="filterFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </base-select>

        <q-separator />
        <q-separator />
        <q-separator />
        <base-select
          filled
          new-value-mode="add"
          use-input
          option-value="name"
          option-label="name"
          :validator="v$.consult.participants"
          :label="$t('participants')"
          v-model="participants"
          :options="agents"
          use-chips
          multiple
          :display-value="participants ? $t(`${participants.value}`) : ''"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ $t(`${scope.opt.name}`) }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </base-select>
        <base-input
          :validator="v$.consult.people_attending"
          :label="$t('people_attending')"
          v-model="consult.people_attending"
        />

        <base-input
          :validator="v$.consult.home_attending"
          v-show="consult.type_consult == 'Home visit'"
          :label="$t('home_attending')"
          v-model="consult.home_attending"
        />
      </div>
      <q-btn
        class="tw-mt-3"
        @click="submit"
        color="blue"
        :label="$t('btnSubmit')"
      />
    </base-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { required, numeric } from '@vuelidate/validators';
import { api } from 'src/boot/axios';
import useVuelidate from '@vuelidate/core';
import moment from 'moment';

const locationOptions = [
  'Soyah Centre',
  'Berteyah',
  'Farenta',
  'Nôbé',
  'Kenten',
  'Bhoully',
  'Fodeyah',
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
];

export default {
  data() {
    return {
      consult: {},
      consultationID: 0,
      showFormDialog: false,
      filterOptions: locationOptions,
      ConsultationOptions: ['Mass consultation', 'Homecare'],
      pagination: {
        rowsPerPage: 10,
        sortBy: 'date_of_consult',
        descending: false,
      },
      columns: [
        {
          name: 'people_enrolled',
          label: 'people_enrolled',
          align: 'center',
          field: 'people_enrolled',
          sortable: true,
        },
        {
          name: 'date_of_consult',
          label: 'date_of_consult',
          align: 'center',
          field: 'date_of_consult',
          sortable: true,
        },
        {
          name: 'type_consult',
          align: 'center',
          label: 'type_consult',
          field: 'type_consult',
        },
        { name: 'ahead', label: 'ahead', field: 'ahead', align: 'center' },
        {
          name: 'location_of_consult',
          label: 'location_of_consult',
          field: 'location_of_consult',
          align: 'center',
        },
        {
          name: 'Participants',
          label: 'Participants',
          align: 'center',
          field: 'participants',
        },
        {
          name: 'people_attending',
          label: 'people_attending',
          align: 'center',
          field: 'people_attending',
        },
        {
          name: 'home_attending',
          label: 'home_attending',
          align: 'center',
          field: 'home_attending',
        },
      ],
      agents: [],
      rows: [],
    };
  },
  validations() {
    return {
      consult: {
        date_of_consult: { required },
        type_consult: { required },
        participants: { required },
        ahead: { required },
        location_of_consult: { required },
        home_attending: { required, numeric },
        people_attending: { required, numeric },
      },
    };
  },
  methods: {
    onRowClick(cID, row) {
      this.consult = row;
      this.consultationID = cID;
      this.participants = row.participants.split(',');
      this.showFormDialog = true;
    },
    filterFn(val, update) {
      update(() => {
        if (val === '') {
          this.filterOptions = locationOptions;
        } else {
          const needle = val.toLowerCase();
          this.filterOptions = locationOptions.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    },

    getDOB(value) {
      return moment(value).format('DD/MM/YYYY');
    },
    openForm() {
      this.consult = {};
      this.participants = null;
      this.showFormDialog = true;
      console.log('Open');
    },
    onFormDialogClose() {
      this.consult = {};
      this.participants = null;
      this.showFormDialog = false;
    },
    async submit() {
      if (this.participants != null) {
        this.consult.participants = this.participants.toString();
      }
      if (
        (await this.v$.consult.date_of_consult.$validate()) &&
        (await this.v$.consult.type_consult.$validate()) &&
        (await this.v$.consult.participants.$validate()) &&
        (await this.v$.consult.ahead.$validate()) &&
        (await this.v$.consult.location_of_consult.$validate()) &&
        (await this.v$.consult.people_attending.$validate())
      ) {
        if (this.consult.type_consult == 'Home visit') {
          if (await this.v$.consult.home_attending.$validate()) {
            if (this.consultationID == 0) {
              const { data } = await api.post('/consultations', this.consult);
              this.rows.push(data.data);
            } else {
              const { data } = await api.put(
                `/consultations/${this.consultationID}`,
                this.consult
              );
            }
            this.showFormDialog = false;
          } else {
            this.showFormDialog = true;
          }
        } else {
          if (this.consultationID == 0) {
            const { data } = await api.post('/consultations', this.consult);
            this.rows.push(data.data);
          } else {
            this.consult.home_attending = 0;
            const { data } = await api.put(
              `/consultations/${this.consultationID}`,
              this.consult
            );
          }
          this.showFormDialog = false;
        }
      }
    },
  },

  async mounted() {
    const response = await api.get('/consultations');
    this.rows = response.data[0];
    this.agents = response.data[1];
  },

  setup() {
    return {
      participants: ref(null),
      separator: ref('horizontal'),
      v$: useVuelidate(),
    };
  },
};
</script>
