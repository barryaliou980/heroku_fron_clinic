<template>
   <q-scroll-area class="fit">
      <q-toolbar class="GPL__toolbar">
         <q-toolbar-title class="row items-center text-grey-8">
            <img class="q-pl-md" src="../assets/logo.jpg" />
         </q-toolbar-title>
      </q-toolbar>

      <q-list padding>
         <template v-for="(links, index) in menusGroup" :key="index">
            <q-item
               v-for="link in links"
               :key="link.text"
               clickable
               :to="link.to"
            >
               <q-item-section avatar>
                  <q-icon :name="link.icon" />
               </q-item-section>
               <q-item-section>
                  <q-item-label>{{ link.text }}</q-item-label>
               </q-item-section>
            </q-item>
            <q-separator size="lg" class="tw-my-3" />
         </template>
      </q-list>
   </q-scroll-area>
</template>

<script lang="ts" setup>
const menusGroup = [
   [
      {
         icon: 'dashboard_customize',
         text: 'Dashboard',
         to: { name: 'admin.dashboard' },
      },
        {
         icon: 'people',
         text: 'Patient',
         to: { name: 'admin.patient' },
      },
      {
         icon: 'analytics',
         text: 'Reports',
         to: { name: 'admin.reports' },
      },
    
   ],
   [
      {
         icon: 'settings_suggest',
         text: 'App Settings',
         to: { name: 'admin.settings' },
      },
   
   ],
];


</script>
