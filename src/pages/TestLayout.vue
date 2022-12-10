<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
        </q-toolbar-title> 
         <q-btn color="primary" >
            <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>Deconnection</q-item-section>
            </q-item>
              <q-separator />
            <q-item clickable v-close-popup>
              <q-item-section>Parameters</q-item-section>
            </q-item>
            <q-separator />
          </q-list>
        </q-menu>
      </q-btn> 
      </q-toolbar>
       <q-tabs
        v-model="tab"
        dense
        class="bg-grey-2 text-teal"
      >
        <q-tab  icon="note_add" label="Add Patient" />
        <q-tab  icon="people" label="List Patient" />
        <q-tab icon="trending_up" label="Statistics" />
      </q-tabs>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },

      rightDrawerOpen,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  }
}
</script>