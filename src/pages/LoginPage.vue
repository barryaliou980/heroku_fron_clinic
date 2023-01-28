<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card class="lg:tw-w-150 tw-w-1/2">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="../assets/logo.jpg" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Log in</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="onLogin">
              <base-input
                filled
                v-model="state.formData.email"
                label="Email"
                :validator="v$.formData.email"
                lazy-rules
              />

              <base-input
                type="password"
                filled
                :validator="v$.formData.password"
                v-model="state.formData.password"
                label="Password"
                lazy-rules
              />

              <div>
                <q-btn
                  class="tw-w-full tw-text-lg"
                  label="Sign in"
                  color="secondary"
                  type="submit"
                  :loading="state.loading"
                  :disable="state.loading"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useQuasar, LocalStorage } from 'quasar';
import { api } from 'src/boot/axios';
import { useUserStore } from '../stores/userStore';

const $q = useQuasar();
const router = useRouter();
const userStore = useUserStore();

const state = reactive({
  loading: false,
  showPassword: false,
  formData: {
    email: '',
    password: '',
  },
});
const validationRules = {
  formData: {
    email: { required },
    password: { required },
  },
};

const v$ = useVuelidate(validationRules, state);

async function onLogin() {
  console.log('State', state.formData);
  if (await v$.value.$validate()) {
    state.loading = true;
    // await api.get('/sanctum/csrf-cookie');
    try {
      const { data } = await api.post('/v1/login', { ...state.formData });
      console.log('DEATa', data);
      if (data.data.user.id) {
        userStore.$patch({
          loggedUser: data.data.user,
          isLogged: true,
          token: data.data.token,
        });
        console.log('slim', data.data.token);
        LocalStorage.set('token', data.data.token);
        console.log('slim + 1', LocalStorage.getItem('token'));
        router.push({ name: 'admin.dashboard' });
      } else {
        $q.notify({
          type: 'negative',
          position: 'bottom',
          timeout: 10000,
          message: 'You have entered an invalid username or password.',
        });
      }
    } catch (error) {
      state.loading = false;
      $q.notify({
        type: 'negative',
        position: 'bottom',
        timeout: 10000,
        message: 'You have entered an invalid username or password.',
      });
    }

    state.loading = false;
  }
}
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #29282b 0%, #524c4f 100%);
}
</style>
