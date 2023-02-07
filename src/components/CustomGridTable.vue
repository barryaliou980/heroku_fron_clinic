
<template>
  <q-card>
    <div class="row">
      <q-card-section class="col-10">
        <div class="text-h6 text-grey-8">{{ $t('sidebar.patient_list') }}</div>
      </q-card-section>

      <q-card-section class="col-2">
        <div class="text-h6 text-grey-8">
          <q-btn
            text-color="black"
            glossy
            unelevated
            icon="print"
            :label="$t('sidebar.print')"
            to="/card"
          />
        </div>
      </q-card-section>
    </div>

    <q-separator />

    <div class="row">
      <q-card-section class="col-12">
        <div>
          <q-input
            filled
            :model-value="
              filters.dateRange != null
                ? `${filters.dateRange.from} - ${filters.dateRange.to}`
                : '-'
            "
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="filters.dateRange" range>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div>
          <q-btn
            style="width: 100%; height: 75%"
            color="white"
            text-color="black"
            :label="$t('filtered')"
            @click="find()"
            :loading="loadingBtn"
          />
        </div>
      </q-card-section>
    </div>
    <q-card-section class="q-pa-none tw-px-4 tw-py-4">
      <q-table grid :rows="data" :filter="filter">
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <card-profile :row="props.row"></card-profile>
          </div>
        </template>
        <template v-slot:top-right>
          <q-input
            v-if="show_filter"
            filled
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-btn
            class="q-ml-sm"
            icon="filter_list"
            @click="show_filter = !show_filter"
            flat
          />
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>


<script>
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { defineComponent } from 'vue';
import CardProfile from './cards/CardProfile.vue';

export default defineComponent({
  name: 'TableCustomGrid',
  props: ['data'],
  data() {
    return {
      loadingBtn: false,
      filter: ref(''),
      show_filter: false,
      filters: {},
      dateRange: {
        from: '',
        to: '',
      },
    };
  },
  methods: {
    find() {
      this.loadingBtn = true;
      api
        .post('filter', this.filters)
        .then((response) => {
          if (response.data.length > 0) {
            this.loadingBtn = false;
            this.$emit('find', response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  components: { CardProfile },
});
</script>
