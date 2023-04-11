<template>
  <div class="q-pa-md">
    <q-btn
      @click="openForm"
      :label="$t('add_glucose')"
      class="tw-mt-5"
      color="primary"
    />

    <q-separator />
    <div
      class="tw-border-b tw-min-h-1/2 tw-border-gray-200 tw-bg-white tw-px-4 tw-py-5 sm:tw-px-6"
    >
      <div class="sm:tw-w-full lg:tw-w-1/2 tw-min-h-1/2">
        <base-table
          v-if="glucoses.length > 0"
          :column-defs="columns"
          :rows="glucoses"
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
      :title="selectedRowId > 0 ? `Edit ${title}` : `Add ${title}`"
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
          @update:model-value="weFirst(glucose, $event)"
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
          label=" Entrez la valuer "
          v-model="glucose"
          type="number"
          @update:model-value="weFirst($event, do_you_have_the_disease)"
          :validator="v$.glucose"
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

export default {
  emits: [],
  data() {
    return {
      glucose: null,
      glucoses: [],
      do_you_have_the_disease: null,
      showMsg: false,
      showFormDialog: false,
      formLoading: false,
      title: 'Gucose',
      Qoptions: ['Yes', 'No'],
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
    weFirst(level, disease) {
      if (level >= 1.26 && disease == 'No') {
        this.msgShow = true;
      } else {
        this.msgShow = false;
      }
    },
    async submit() {
      if (
        (await this.v$.glucose.$validate()) &&
        (await this.v$.do_you_have_the_disease.$validate())
      ) {
        if (this.store.glucose.id === undefined) {
          let formData = {
            patient_id: this.store?.currentPatient?.id,
            vital_type: 'glucose',
            do_you_have_the_disease: this.do_you_have_the_disease,
            glucose_level: this.glucose,
          };
          this.$emit('isLoading', true);

          const { data } = await api.post('/vitals', formData);
          this.$emit('isLoading', false);
          this.glucoses = [data.data];
          this.store.setGlucose(data.data);
          this.showFormDialog = false;
        } else {
          let formData = {
            id: this.store.glucose.id,
            patient_id: this.store?.currentPatient?.id,
            vital_type: 'glucose',
            do_you_have_the_disease: this.do_you_have_the_disease,
            glucose_level: this.glucose,
          };
          this.$emit('isLoading', true);

          const { data } = await api.post('/vitals', formData);
          this.$emit('isLoading', false);
          this.glucoses = [data.data];
          this.store.setGlucose(data.data);
          this.showFormDialog = false;
        }

        this.glucose = null;
        this.do_you_have_the_disease = null;

        if (this.store.glucose?.id !== undefined) {
          this.glucoses = [this.store.glucose];
        }
      }
    },
    next() {
      if (this.glucoses.length > 0) {
        if (this.store.testCovid) {
          this.$emit('next', 'test_covid');
          this.store.setTabs('test_covid');
        } else {
          this.$emit('next', 'blood_pr');
          this.store.setTabs('blood_pr');
        }
      } else {
        console.log('Glucose');
      }
    },
  },
  validations() {
    return {
      glucose: { required },
      do_you_have_the_disease: { required },
    };
  },
  // updated() {
  //   if(this.store.glucose?.id !== undefined ){
  //     this.glucoses = [this.store.glucose]
  //    }
  //   },

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
    if (this.store.glucose?.id !== undefined) {
      this.glucoses = [this.store.glucose];
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
