<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title> {{ $t('layout.appName') }} </q-toolbar-title>

        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable @click="logOut">
                  <q-item-section>{{ $t('layout.logout') }}</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup>
                  <q-item-section>{{ $t('layout.settings') }}</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>{{ $t('layout.language') }}</q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right" />
                  </q-item-section>

                  <q-menu anchor="top end" self="top start">
                    <q-list>
                      <q-item dense clickable>
                        <q-item-section
                          @click="setLanguage('en-Us')"
                          class="tw-mt-5"
                          color="primary"
                          >{{ $t('layout.english') }}</q-item-section
                        >
                      </q-item>
                      <q-item dense clickable>
                        <q-item-section
                          @click="setLanguage('fr')"
                          class="tw-mt-5"
                          color="primary"
                          >{{ $t('layout.french') }}</q-item-section
                        >
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>
                <q-separator />
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-primary text-white"
    >
      <q-list>
        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('sidebar.dashboard') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/add-patient" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="note_add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('sidebar.addNewPatient') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/list-patients" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('sidebar.patient_list') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="store.loggedUser.user_type === 'admin'"
          to="/users"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('sidebar.users') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/statistics" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="trending_up" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('sidebar.statistics') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/consultations" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="supervised_user_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('sidebar.consultations') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/list-referals" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="trending_up" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('sidebar.referals') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/list-followup" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="trending_up" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('sidebar.followup') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// import EssentialLink from '../components/EssentialLink.vue'
// import Messages from './Messages.vue';
// import {useQuasar} from 'quasar';

import { defineComponent, ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import { LocalStorage } from 'quasar';

export default defineComponent({
  name: 'MainLayout',

  components: {
    // Messages
  },
  methods: {
    async logOut() {
      await this.store.logout();
      window.location.reload();
    },
    setLanguage(langue) {
      this.$i18n.locale = langue;
      LocalStorage.set('anty-locale', langue);
    },
  },

  setup() {
    const leftDrawerOpen = ref(false);

    //  const $q = useQuasar()

    return {
      store: useUserStore(),
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
