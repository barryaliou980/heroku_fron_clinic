<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          align="left"
          class="shadow-2"
          :breakpoint="0"
        >
          <q-tab name="mails" icon="recent_actors" />
          <q-tab name="alarms" icon="grid_view" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="mails">
            <table-custom-grid
              @find="data = $event"
              :data="data"
              class="q-mt-lg"
            >
            </table-custom-grid>
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <CustomPatient :data="data" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { api } from 'src/boot/axios';
import { defineAsyncComponent, ref } from 'vue';
export default {
  components: {
    TableCustomGrid: defineAsyncComponent(
      () => import('src/components/CustomGridTable.vue')
    ),
    CustomPatient: defineAsyncComponent(
      () => import('src/components/CustomePatientTable.vue')
    ),
  },
  data() {
    return {
      data: [],
    };
  },
  async created() {
    const { data } = await api.get('/patients');
    this.data = data;
  },
  setup() {
    return {
      tab: ref('mails'),
    };
  },
};
</script>

