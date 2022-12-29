<template>
  <div class="q-pa-md">
    <q-separator />
    <q-btn
      @click="openTemperature"
      :label="$t('temperature')"
      class="tw-mt-5"
      color="primary"
    />
    <div
      class="
        tw-border-b tw-border-gray-200 tw-bg-white tw-px-4 tw-py-5
        sm:tw-px-6
      "
    >
      <div class="md:tw-w-1/2">
        <base-table
          dense
          flat
          square
          class="my-sticky-header-table"
          v-if="tempOptions.length > 0"
          :column-defs="pColumns"
          :rows="tempOptions"
          :hide-pagination="true"
          hide-default-header
        >
          <template v-slot:header="props">
            <q-td v-for="head in props.cols" :key="head.name">
              {{ $t(`${head.field}`) }}
            </q-td>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" :class="flagColorT">
              <q-td
                class="white"
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                <div v-if="col.name === 'actions'">
                  <q-btn color="teal" icon="mode_edit" />

                  <q-btn color="deep-orange" icon="delete" />
                </div>

                <p v-else>{{ $t(`${col.value}`) }}</p>
              </q-td>
            </q-tr>
          </template>
        </base-table>
      </div>
    </div>
    <q-separator />
    <q-btn
      @click="openOxygen"
      :label="$t('oxygen')"
      class="tw-mt-5"
      color="primary"
    />
    <div
      class="
        tw-border-b tw-border-gray-200 tw-bg-white tw-px-4 tw-py-5
        sm:tw-px-6
      "
    >
      <div class="md:tw-w-1/2">
        <base-table
          dense
          flat
          square
          v-if="oxyOptions.length > 0"
          :column-defs="oColumns"
          :rows="oxyOptions"
          :hide-pagination="true"
          separator="cell"
        >
          <template v-slot:header="props">
            <q-td v-for="head in props.cols" :key="head.name">
              {{ $t(`${head.field}`) }}
            </q-td>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" :class="flagColorO">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <div v-if="col.name === 'actions'">
                  <q-btn color="teal" icon="mode_edit" />

                  <q-btn color="deep-orange" icon="delete" />
                </div>

                <p v-else>{{ $t(`${col.value}`) }}</p>
              </q-td>
            </q-tr>
          </template>
        </base-table>
      </div>
    </div>
  </div>
  <div class="tw-flex tw-flex-row tw-justify-start tw-space-x-3">
    <q-btn
      color="blue"
      class="tw-flex"
      :label="$t('btnContinue')"
      @click="nextStep"
    />
  </div>
  <base-dialog
    v-model:open="showFormDialog"
    :title="selectedRowId > 0 ? $t(`Edit_${title}`) : $t(`Add_${title}`)"
    @close="onFormDialogClose"
    :loading="formLoading"
    size="sm"
  >
    <TemperatureAndOxygenForm :optionData="optionData" @submit="submit" />
  </base-dialog>
</template>

<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { useAppStore } from 'src/stores/appStor';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

export default {
  components: {
    TemperatureAndOxygenForm: defineAsyncComponent(
      () => import('./TemeratureAndOxygenForm.vue')
    ),
  },
  data() {
    return {
      optionData: [],
      title: '',
      temperatures: [
        '35.9 > Hypotermy',
        '36.5 - 37.5 Normal',
        '37.5 - 38.5 Hypertermia',
        '+ 38 Fever',
      ],
      oxygens: ['95% or + (Normal)', '93-94% (Low)', '92% or less (Very Low)'],
      showFormDialog: false,
      selectedRowId: 0,
      formLoading: false,
      pColumns: [
        {
          field: 'temperature',
          name: 'temperature',
          label: 'Temperature',
          align: 'left',
        },
        {
          field: 'date_of_checking',
          name: 'date_of_checking',
          label: 'Date of checking',
          align: 'left',
        },
        {
          field: 'time_of_checking',
          name: 'time_of_checking',
          label: 'Time of checking',
          align: 'left',
        },
        // { name: 'actions', align: 'right', field: 'actions', label: 'Action' },
      ],
      oColumns: [
        {
          field: 'oxygen_saturation',
          name: 'name',
          label: 'Oxygen Saturation',
          align: 'left',
        },
        {
          field: 'date_of_checking',
          name: 'date_of_checking',
          label: 'Date Of Checking',
          align: 'left',
        },
        {
          field: 'time_of_checking',
          name: 'time_of_checking',
          label: 'Time of checking',
          align: 'left',
        },
        // { name: 'actions', align: 'right', field: 'actions', label: 'Action' },
      ],
      tempOptions: [],
      oxyOptions: [],
      oxygenFlag: 0,
      tempFlag: 0,
    };
  },
  methods: {
    onFormDialogClose() {
      this.showFormDialog = false;
    },
    openTemperature() {
      this.title = 'Temperature';
      this.optionData = this.temperatures;
      this.showFormDialog = true;
      console.log('amsrtsdb1', this.tempOptions);
    },
    openOxygen() {
      this.title = 'Oxygen';
      this.optionData = this.oxygens;
      this.showFormDialog = true;
    },
    async submit(params: any) {
      if (this.title === 'Oxygen') {
        if (this.store.oxygen?.id === undefined) {
          let formData = {
            patient_id: this.store?.currentPatient?.id,
            vital_type: 'oxygen',
            oxygen_saturation: params.value,
          };
          const { data } = await api.post('/vitals', formData);
          this.oxyOptions = data.data;
          this.store.setOxygen(data.data);
          this.showFormDialog = false;
        } else {
          let formData = {
            id: this.store.oxygen?.id,
            patient_id: this.store?.currentPatient?.id,
            vital_type: 'oxygen',
            oxygen_saturation: params.value,
          };
          const { data } = await api.post('/vitals/', formData);
          this.oxyOptions = data.data;
          this.store.setOxygen(data.data);
          this.showFormDialog = false;
        }
        if (this.store.oxygen?.id !== undefined) {
          this.oxyOptions = [this.store.oxygen];
        }
      } else if (this.title === 'Temperature') {
        if (this.store.temperature?.id === undefined) {
          let formData = {
            patient_id: this.store?.currentPatient?.id,
            vital_type: 'temperature',
            temperature: params.value,
          };
          this.$emit('isLoading', true);
          const { data } = await api.post('/vitals', formData);
          this.$emit('isLoading', false);
          this.tempOptions = data.data;
          this.store.setTemperature(data.data);
          this.showFormDialog = false;
        } else {
          let formData = {
            id: this.store.temperature.id,
            patient_id: this.store?.currentPatient?.id,
            vital_type: 'temperature',
            temperature: params.value,
            vital_flag: this.tempOptions?.vital_flag,
          };
          this.$emit('isLoading', true);
          const { data } = await api.post('/vitals/', formData);
          this.$emit('isLoading', false);
          this.tempOptions = data.data;
          this.store.setTemperature(data.data);
          this.showFormDialog = false;
        }
        if (this.store.temperature?.id !== undefined) {
          this.tempOptions = [this.store.temperature];
        }
      }
    },
    nextStep() {
      if (
        JSON.stringify(this.store.temperature) !== '{}' &&
        JSON.stringify(this.store.oxygen) !== '{}'
      ) {
        this.$emit('next', 'movies');
        this.store.setTabs('movies');
      } else {
      }
    },
  },
  setup() {
    return {
      store: useAppStore(),
      $q: useQuasar(),
    };
  },
  // updated() {
  // if(this.store.temperature?.id !== undefined ){
  // this.tempOptions = [this.store.temperature];
  // }
  // if(this.store.oxygen?.id !== undefined ){
  //   this.oxyOptions = [this.store.oxygen];
  // }

  // },
  created() {
    if (this.store.temperature?.id !== undefined) {
      this.tempOptions = [this.store.temperature];
      this.tempFlag = this.store.temperature?.vital_flag;
    }
    if (this.store.oxygen?.id !== undefined) {
      this.oxyOptions = [this.store.oxygen];
      this.oxygenFlag = this.store.oxygen?.vital_flag;
    }
  },
  computed: {
    flagColorT() {
      if (Number(this.store.temperature?.vital_flag) === 0) {
        return 'bg-positive text-white';
      } else if (Number(this.store.temperature?.vital_flag) === 1) {
        return 'bg-warning text-white';
      } else if (Number(this.store.temperature?.vital_flag) > 1) {
        return 'bg-negative text-white';
      } else {
        return 'bg-white text-white';
      }
    },
    flagColorO() {
      if (Number(this.store.oxygen?.vital_flag) === 0) {
        return 'bg-positive text-white';
      } else if (Number(this.store.oxygen?.vital_flag) === 1) {
        return 'bg-warning text-white';
      } else if (Number(this.store.oxygen?.vital_flag) > 1) {
        return 'bg-negative text-white';
      } else {
        return 'bg-white text-black';
      }
    },
  },
};
</script>
