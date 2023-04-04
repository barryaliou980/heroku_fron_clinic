<template>
  <div class="q-pa-md">
    <q-btn
      @click="openForm"
      :label="$t('add_malnutrition')"
      class="tw-mt-5"
      color="primary"
    />

    <q-separator />
    <div
      class="tw-border-b tw-border-gray-200 tw-bg-white tw-px-4 tw-py-5 sm:tw-px-6"
    >
      <div class="md:tw-w-1/2">
        <base-table
          v-if="malnutritions.length > 0"
          :column-defs="columns"
          :rows="malnutritions"
          :hide-pagination="true"
          separator="cell"
        >
          <template v-slot:header="props">
            <q-td v-for="head in props.cols" :key="head.name">
              {{ $t(`${head.field}`) }}
            </q-td>
          </template>
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
      :title="selectedRowId > 0 ? $t(`edit_${title}`) : $t(`add_${title}`)"
      @close="onFormDialogClose"
      :loading="formLoading"
      size="sm"
      persistent
    >
      <div class="tw-grid tw-grid-cols-1 tw-gap-3">
        <base-select
          class="tw-full"
          v-model="do_you_have_the_disease"
          :label="$t('do_you_have_the_disease_d')"
          :options="Qoptions"
          :display-value="
            do_you_have_the_disease ? $t(`${do_you_have_the_disease}`) : ''
          "
          :validator="v$.do_you_have_the_disease"
          @update:model-value="weFirst($event, malnutrition)"
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
          :label="$t('set_value')"
          v-model="malnutrition"
          type="number"
          :validator="v$.malnutrition"
          @update:model-value="weFirst($event, do_you_have_the_disease)"
        />
      </div>

      <div class="text-center">
        <q-badge
          v-if="msgShow"
          color="secondary"
          :label="$t('clinic_O_is_first')"
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

  <q-btn @click="next" color="blue" :label="$t('btnContinue')" />
</template>

<script lag="ts">
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useAppStore } from 'src/stores/appStor';
import { api } from 'src/boot/axios';
import moment from 'moment';

export default {
  emits: [],
  data() {
    return {
      malnutrition: null,
      malnutritions: [],
      do_you_have_the_disease: null,
      showMsg: false,
      showFormDialog: false,

      formLoading: false,
      title: 'Malnutrition',
      Qoptions: ['Yes', 'No'],
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
    weFirst(arm_circumference, disease) {
      if (this.store?.currentPatient?.id !== undefined) {
        let now = moment().year();
        let age = moment(this.store.currentPatient.date_of_birth).year();
        let year = now - age;
        if (year < 5 && arm_circumference < 125 && disease == 'No') {
          this.msgShow = true;
        } else if (
          this.store.currentPatient.pregnant == 'Yes' &&
          arm_circumference < 230
        ) {
          this.msgShow = true;
        } else {
          this.msgShow = false;
        }
      }
    },
    openForm() {
      this.showFormDialog = true;
    },
    onFormDialogClose() {
      this.showFormDialog = false;
    },
    async submit() {
      if (
        (await this.v$.malnutrition.$validate()) &&
        (await this.v$.do_you_have_the_disease.$validate())
      ) {
        let formData = {
          id: this.store.malnutrition?.id,
          patient_id: this.store?.currentPatient?.id,
          vital_type: 'malnutrition',
          arm_circumference: this.malnutrition,
          do_you_have_the_disease: this.do_you_have_the_disease,
        };
        if (this.store.malnutrition.id === undefined) {
          this.$emit('isLoading', true);
          const { data } = await api.post('/vitals', formData);
          this.$emit('isLoading', false);
          this.malnutritions = [data.data];
          this.store.setMalnutrition(data.data);
          console.log('submit', data.data);
          this.showFormDialog = false;
        } else {
          this.$emit('isLoading', true);
          const { data } = await api.post('/vitals', formData);
          this.$emit('isLoading', false);
          this.malnutritions = [data.data];
          this.store.setMalnutrition(data.data);
          console.log('submit', data.data);
          this.showFormDialog = false;
        }
        this.arm_circumference = null;
        this.do_you_have_the_disease = null;
        if (this.store.malnutrition?.id !== undefined) {
          this.malnutritions = [this.store.malnutrition];
        }
      }
    },
    next() {
      if (this.malnutritions.length > 0) {
        this.$emit('next', 'medical_back');
        this.store.setTabs('medical_back');
      }
    },
  },
  validations() {
    return {
      malnutrition: { required },
      do_you_have_the_disease: { required },
    };
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
    if (this.store.malnutrition?.id !== undefined) {
      this.malnutritions = [this.store.malnutrition];
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