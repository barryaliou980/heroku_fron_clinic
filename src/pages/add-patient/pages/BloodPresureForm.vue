<template>
  <div class="q-pa-md">
    <q-btn @click="EntrezBloodPre" color="blue" :label="$t('set_values')" />
    <table
      v-if="bloodPreResult.id !== undefined"
      class="tw-w-1/2 tw-divide-y tw-mx-4 tw-py-4 tw-divide-gray-300"
    >
      <thead class="tw-text-white">
        <tr class="tw-divide-x tw-divide-gray-200">
          <th
            scope="col"
            class="
              tw-py-3.5 tw-pl-4 tw-pr-3
              text-left
              tw-text-sm tw-font-semibold tw-text-gray-900
              tw-sm:pl-6
            "
          ></th>

          <th
            scope="col"
            class="
              tw-px-3
              tw-py-3.5
              tw-text-center
              tw-text-md
              tw-font-semibold
              tw-text-gray-900
            "
          >
            Systol
          </th>

          <th
            scope="col"
            class="
              tw-px-3
              tw-py-3.5
              tw-text-center
              tw-text-md
              tw-font-semibold
              tw-text-gray-900
            "
          >
            Diastol
          </th>
        </tr>
      </thead>
      <tbody
        :style="{
          backgroundColor: `${flagColor}`,
          color: 'white',
          size: '14px',
        }"
        class="tw-divide-y tw-divide-gray-200"
      >
        <tr class="tw-divide-x tw-divide-gray-200">
          <td class="text-h6">{{ $t('arm_right') }}</td>
          <td class="tw-text-center text-bold">
            {{ bloodPreResult.bp_sys_right }}
          </td>
          <td class="tw-text-center text-bold">
            <div>
              {{ bloodPreResult.bp_dias_right }}
            </div>
          </td>
        </tr>
        <tr class="tw-divide-x tw-divide-gray-200">
          <td class="text-h6">{{ $t('arm_left') }}</td>
          <td class="tw-text-center text-bold">
            <div>
              {{ bloodPreResult.bp_sys_left }}
            </div>
          </td>
          <td class="tw-text-center text-bold">
            <div>
              {{ bloodPreResult.bp_dias_left }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <q-separator class="tw-mt-2" />
    <div class="tw-flex tw-justify-left tw-mt-16">
      <q-btn @click="next" :label="$t('btnContinue')" color="blue" />
    </div>
  </div>
  <base-dialog
    v-model:open="showFormDialog"
    :title="$t('take_blood_presure')"
    @close="onFormDialogClose"
    :loading="formLoading"
    size="sm"
    persistent
  >
    <div class="tw-flex tw-justify-left"></div>
    <p>{{ $t('arm_right') }}</p>
    <base-input
      class="tw-m-1"
      type="number"
      :label="$t('systol')"
      v-model="bloodPre.bp_sys_right"
      :validator="v$.bloodPre.bp_sys_right"
    />

    <base-input
      class="tw-m-1"
      type="number"
      :label="$t('diastol')"
      v-model="bloodPre.bp_dias_right"
      :validator="v$.bloodPre.bp_dias_right"
    />

    <q-separator />
    <p>{{ $t('arm_left') }}</p>
    <base-input
      type="number"
      class="tw-m-1"
      :label="$t('systol')"
      v-model="bloodPre.bp_sys_left"
      :validator="v$.bloodPre.bp_sys_left"
    />
    <base-input
      type="number"
      class="tw-m-1"
      :label="$t('diastol')"
      v-model="bloodPre.bp_dias_left"
      :validator="v$.bloodPre.bp_dias_left"
    />

    <div class="tw-flex tw-justify-end">
      <q-btn
        @click="submit"
        class="tw-mt-4 tw-mr-5"
        :label="$t('btnSubmit')"
        color="blue"
      />
    </div>
  </base-dialog>
</template>

<script lang="ts">
import { useAppStore } from 'src/stores/appStor';
import { api } from 'src/boot/axios';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

import { BloodPresure } from '../../../components/models';
export default {
  emits: [],
  data() {
    return {
      selectedRowId: 0,
      formLoading: false,
      showFormDialog: false,
      bloodPre: {} as BloodPresure,
      bloodPreResult: {} as BloodPresure,
    };
  },
  validations() {
    return {
      bloodPre: {
        bp_sys_right: { required },
        bp_dias_right: { required },
        bp_sys_left: { required },
        bp_dias_left: { required },
      },
    };
  },
  methods: {
    onFormDialogClose() {
      this.showFormDialog = false;
    },
    EntrezBloodPre() {
      this.showFormDialog = true;
    },
    async submit() {
      if (await this.v$.bloodPre.$validate()) {
        if (this.store.bloodPre.id === undefined) {
          this.bloodPre.patient_id = this.store.currentPatient.id;
          this.bloodPre.vital_type = 'bloodPressure';
          this.$emit('isLoading', true);
          let { data } = await api.post('/vitals', this.bloodPre);
          this.$emit('isLoading', false);
          this.bloodPreResult = data.data;
          this.store.setBloddPre(data.data);
          this.showFormDialog = false;
        } else {
          this.bloodPre.patient_id = this.store.currentPatient.id;
          this.bloodPre.vital_type = 'bloodPressure';
          this.bloodPre.id = this.store.bloodPre.id;
          this.$emit('isLoading', true);
          let { data } = await api.post('/vitals', this.bloodPre);
          this.$emit('isLoading', false);
          this.bloodPreResult = data.data;
          this.store.setBloddPre(data.data);
          this.showFormDialog = false;
        }
      }
    },
    next() {
      if (this.bloodPreResult.id !== undefined) {
        this.$emit('next', 'medical_back');
        this.store.setTabs('medical_back');
      }
    },
  },
  computed: {
    flagColor() {
      if (Number(this.store.bloodPre?.vital_flag) === 0) {
        return 'green';
      } else if (Number(this.store.bloodPre?.vital_flag) === 1) {
        return 'orange';
      } else if (Number(this.store.bloodPre?.vital_flag) > 1) {
        return 'red';
      } else {
        return 'white';
      }
    },
  },
  created() {
    this.bloodPreResult = this.store.bloodPre;
  },
  setup() {
    return {
      store: useAppStore(),
      v$: useVuelidate(),
    };
  },
};
</script>
