<template>
  <q-form @submit.prevent="submit" class="tw-space-y-5">
    <base-select
      style="width: 380px; max-width: 400px"
      label="Value"
      :options="optionData"
      v-model="state.formData.value"
      :validator="v$.formData.value"
      :display-value="state.formData.value ? $t(`${state.formData.value}`) : ''"
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </base-select>
    <p v-if="state.formData.createdAt">Created on: state.formData.createdAt</p>
    <p v-if="state.formData.updatedAt">
      Last Updated: state.formData.updatedAt=
    </p>

    <div>
      <q-btn :label="$t('btnSubmit')" type="submit" color="primary" />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const props = defineProps<{
  initialData?: object;
  optionData: object;
}>();
const emit = defineEmits(['submit']);

const state = reactive({
  formData: {
    value: '',
    createdAt: '',
    updatedAt: '',
  },
});

const validationRules = {
  formData: {
    value: { required },
  },
};

const v$ = useVuelidate(validationRules, state);

if (props.initialData?.id) {
  state.formData = Object.assign(state.formData, props.initialData);
}

async function submit() {
  if (await v$.value.$validate()) {
    console.log('submit 1', state.formData);
    emit('submit', { ...state.formData });
  }
}
</script>
