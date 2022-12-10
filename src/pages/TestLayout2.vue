<template>
   <q-layout view="hHh LpR lFr" class="tw-h-screen tw-w-screen tw-bg-gray-100">
      <q-header class="app-header tw-bg-primary tw-text-white">
         <q-toolbar class="tw-h-16">
            <q-btn
               size="lg"
               dense
               flat
               round
               icon="menu"
               @click="state.leftDrawerOpen = !state.leftDrawerOpen"
            />

            <q-toolbar-title>
               <img
                  alt="Logo"
                  style="height: 2rem !important"
                  src="../assets/logo.jpg"
               />
            </q-toolbar-title>

            <q-space />

            <div class="tw-mt-6 tw-flex tw-items-center tw-space-x-3 sm:tw-mt-0 sm:tw-ml-2">
               <base-input
                  class="header-search-input tw-rounded-md tw-bg-white"
                  dense
                  v-model="state.searchWord"
                  placeholder="Search"
               >
                  <template v-slot:prepend>
                     <q-icon v-if="state.searchWord === ''" name="search" />
                     <q-icon
                        v-else
                        name="clear"
                        class="cursor-pointer"
                        @click="state.searchWord = ''"
                     />
                  </template>
               </base-input>

               <q-btn
                  flat
                  round
                  dense
                  size="xl"
                  icon="account_circle"
               >
                  <q-tooltip>Account</q-tooltip>
               </q-btn>

               <q-btn
                  flat
                  round
                  dense
                  size="lg"
                  icon="logout"
               >
                  <q-tooltip>Logout</q-tooltip>
               </q-btn>
            </div>
         </q-toolbar>
      </q-header>

      <q-drawer
         v-model="state.leftDrawerOpen"
         bordered
         behavior="mobile"
         @click="state.leftDrawerOpen = false"
      >
         <left-drawer />
      </q-drawer>

      <q-page-container class="tw-flex tw-justify-around">
         <q-page class="tw-w-screen tw-max-w-screen-3xl tw-overflow-hidden tw-p-5">
            <div class="tw-flex tw-justify-around tw-overflow-auto" style="height: calc(100vh - 160px)">
               <router-view />
            </div>
         </q-page>
      </q-page-container>

      <q-footer class="tw-bg-gray-100 tw-text-gray-800">
         <div class="tw-pb-5 tw-text-center">
            <span class="tw-mr-1 tw-font-semibold">Beyond Build-to-Suit</span>
            <span class="tw-font-medium">
               {{ '|' }} Copyright © {{ new Date().getFullYear() }}
               <a
                  href="https://www.plazastreetpartners.com/"
                  target="__blank"
                  class="tw-hover:underline"
               >
                  > Plaza Street Partners
               </a>
            </span>
         </div>

         <q-page-sticky position="bottom-right" :offset="[20, 0]">
            <q-btn
               fab
               color="secondary"
               size="xl"
               icon="add"
            />
         </q-page-sticky>
      </q-footer>
   </q-layout>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import LeftDrawer from './left-drawer.vue';


// const userStore = useUserStore();
// const router = useRouter();
const state = reactive({
   searchWord: '',
   leftDrawerOpen: false,
});

// function logout() {
//    http.post('/logout').then(() => {
//       userStore.$reset();
//       router.push({ name: 'login' });
//    });
// }
</script>

<style>
.app-header .q-tab {
   padding: 3px 9px !important;
}
</style>
