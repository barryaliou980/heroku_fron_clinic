<template>
  <div class="q-pa-md">
    <q-btn
      @click="openForm"
      label="Add Malnutrition"
      class="tw-mt-5"
      color="primary"
    />

    <q-separator />
    <div
      class="
        tw-border-b tw-border-gray-200 tw-bg-white tw-px-4 tw-py-5
        sm:tw-px-6
      "
    >
      <div class="md:tw-w-1/2">
        <base-table
          v-if="malnutritions.length > 0"
          :column-defs="columns"
          :rows="malnutritions"
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
        v-model="malnutrition"
        type="number"
        :validator="v$.malnutrition"
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
      malnutrition: null,
      malnutritions: [],
      showFormDialog: false,
      formLoading: false,
      title: 'Malnutrition',
      columns: [
        {
          field: 'arm_circumference',
          name: 'arm_circumference',
          label: 'Malnutrition value',
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
    },
    onFormDialogClose() {
      this.showFormDialog = false;
    },
    async submit() {
      if (this.v$.malnutrition.$validate()) {
        let formData = {
          patient_id: this.store?.currentPatient?.id,
          vital_type: 'malnutrition',
          arm_circumference: this.malnutrition,
        };
        if(this.store.malnutrition.id===undefined){

          this.$emit('isLoading', true)
          const { data } = await api.post('/vitals', formData);
          this.$emit('isLoading', false)
          this.malnutritions = [data.data];
          this.store.setMalnutrition(data.data);
          console.log('submit', data.data);
          this.showFormDialog = false;
        }else{
          this.$emit('isLoading', true)
           const { data } = await api.put(`/vitals/${this.store.malnutrition.id}`, formData);
           this.$emit('isLoading', false)
          this.malnutritions = [data.data];
          this.store.setMalnutrition(data.data);
          console.log('submit', data.data);
          this.showFormDialog = false;

        }
      }
    },
    next() {
      if (this.malnutritions.length > 0) {
        this.$emit('next', 'medical_back');
        this.store.setTabs('medical_back')
      }
    },
  },
  validations() {
    return {
      malnutrition: { required },
    };
  },
  updated() {
    if( this.store.malnutrition?.id !== undefined){
      this.malnutritions = [this.store.malnutrition]
    }
   ;
  },
  computed: {
    flagColor() {
      if (Number(this.store.malnutrition?.vital_flag) === 0) {
        return 'bg-positive text-white';
      } else if (Number(this.store.malnutrition?.vital_flag) === 1) {
        return 'bg-warning text-white';
      } else if (Number(this.store.malnutrition?.vital_flag) > 1) {
        return 'bg-negative text-white';
      } else {
        return 'bg-white text-black';
      }
    },
  },
  created() {
  if( this.store.malnutrition?.id !== undefined){
      this.malnutritions = [this.store.malnutrition]
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