<template>
  <div class="q-pa-md">
    <q-btn
      @click="openForm"
      label="Add glucose"
      class="tw-mt-5"
      color="primary"
    />

    <q-separator />
    <div
      class="
        tw-border-b tw-min-h-1/2 tw-border-gray-200 tw-bg-white tw-px-4 tw-py-5
        sm:tw-px-6
      "
    >
      <div class="sm:tw-w-full lg:tw-w-1/2 tw-min-h-1/2">
        <base-table
          v-if="glucoses.length > 0"
          :column-defs="columns"
          :rows="glucoses"
          :hide-pagination="true"
          separator="cell"
        >
          <template v-slot:body="props">
            <q-tr :props="props" :class="flagColor">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <div v-if="col.name === 'actions'">
                  <q-btn color="teal" icon="mode_edit" />

                  <q-btn color="deep-orange" icon="delete" />
                </div>

                <p v-else>{{ col.value }}</p>
              </q-td>
            </q-tr>
          </template>
        </base-table>
      </div>
    </div>

    <base-dialog
      v-model:open="showFormDialog"
      :title="selectedRowId > 0 ? `Edit ${title}` : `Add ${title}`"
      @close="onFormDialogClose"
      :loading="formLoading"
      size="sm"
      persistent
    >
      <base-input
        label=" Entrez la valuer "
        v-model="glucose"
        type="number"
        :validator="v$.glucose"
      />
      <q-btn class="tw-mt-3" @click="submit" color="blue" label="Submit" />
    </base-dialog>
  </div>

  <q-btn @click="next" color="blue" label="Suivant" />
</template>

<script lag="ts">
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useAppStore } from 'src/stores/appStor';
import { api } from 'src/boot/axios';

export default {
    emits: [],
  data() {
    return {
      glucose: null,
      glucoses: [],
      showFormDialog: false,
      formLoading: false,
      title: 'Gucose',
      columns: [
        {
          field: 'glucose_level',
          name: 'glucose_level',
          label: 'Glucose Level',
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
        // { name: 'actions', align: 'right', field: 'actions', Label: 'Action' },
      ],
    };
  },
  methods: {
    openForm() {
      this.showFormDialog = true;
      console.log('Open');
    },
    onFormDialogClose() {
      this.showFormDialog = false;
    },
    async submit() {
      if (this.v$.glucose.$validate()) {

        if(this.store.glucose.id === undefined){
           let formData = {
          patient_id: this.store?.currentPatient?.id,
          vital_type: 'glucose',
          glucose_level: this.glucose,
        };
        this.$emit('isLoading', true)

          const { data } = await api.post('/vitals', formData);
          this.$emit('isLoading', false)
          this.glucoses = [data.data];
          this.store.setGlucose(data.data);
          this.showFormDialog = false;
        }else{
          let formData = {
            id:this.store.glucose.id ,
          patient_id: this.store?.currentPatient?.id,
          vital_type: 'glucose',
          glucose_level: this.glucose,
        };
        this.$emit('isLoading', true)

          const { data } = await api.post('/vitals', formData);
          this.$emit('isLoading', false)
          this.glucoses = [data.data];
          this.store.setGlucose(data.data);
          this.showFormDialog = false;
        }
      }
    },
    next() {
      if (this.glucoses.length > 0) {
        if (this.store.testCovid) {
          this.$emit('next', 'test_covid');
          this.store.setTabs('test_covid')
        } else {
          this.$emit('next', 'blood_pr');
          this.store.setTabs('blood_pr')

        }
      } else {
        console.log('Glucose');
      }
    },
  },
  validations() {
    return {
      glucose: { required },
    };
  },
  updated() {
    if(this.store.glucose?.id !== undefined ){
      this.glucoses = [this.store.glucose]
     }
    },

  computed: {
    flagColor() {
      if (Number(this.store.glucose?.vital_flag) === 0) {
        return 'bg-positive text-white';
      } else if (Number(this.store.glucose?.vital_flag) === 1) {
        return 'bg-warning text-white';
      } else if (Number(this.store.glucose?.vital_flag) > 1) {
        return 'bg-negative text-white';
      } else {
        return 'bg-white text-black';
      }
    },
  },
  created() {
if(this.store.glucose?.id !== undefined ){
      this.glucoses = [this.store.glucose]
     }
  },
  setup() {
    return {
      store: useAppStore(),
      v$: useVuelidate(),
    };
  },
};
</script>
