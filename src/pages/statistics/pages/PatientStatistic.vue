<template>
  <q-page class="q-pa-sm">
    <div class="q-pa-md">
      <div
        style="margin-left: 20%"
        class="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-3"
      >
        <div>
          <base-select
            filled
            :label="$t('patient.registered_by')"
            v-model="filters.user"
            :options="users"
            :display-value="
              filters.user
                ? `${filters.user.name}(` + `${filters.user.email})`
                : ''
            "
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{
                    $t(`${scope.opt.name}(` + `${scope.opt.email})`)
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </base-select>
        </div>
        <div>
          <base-input
            filled
            v-model="filters.dateOfFiltre"
            type="date"
            mask="date"
            :rules="['date']"
          />
        </div>
        <div>
          <q-btn
            style="width: 100%; height: 75%"
            color="white"
            text-color="black"
            :label="$t('filtered')"
            @click="find()"
          />
        </div>
      </div>
      <div class="q-pa-md row">
        <q-list
          bordered
          separator
          padding
          v-for="(stat, index) in statitisticData"
          :key="index"
          class="col-6"
          style="margin-bottom: 2%; magin-left: 0%"
        >
          <q-item-label class="text-h4 text-weight-bold" header>{{
            stat.name
          }}</q-item-label>

          <q-item v-ripple>
            <q-item-section avatar top>
              <q-avatar icon="folder" color="primary" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ $t('Patients') }}</q-item-label>
              <q-item-label caption> {{ getDate(stat.symptoms) }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-badge
                color="dimgray"
                text-color="white"
                :label="stat.patients"
              />
            </q-item-section>
          </q-item>

          <q-item v-ripple>
            <q-item-section avatar top>
              <q-avatar icon="folder" color="orange" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ $t('sidebar.rdt') }}</q-item-label>
              <q-item-label caption>{{ getDate(stat.rdts) }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-badge
                color="dimgray"
                text-color="white"
                :label="stat.rdts_count"
              />
              <!-- <q-icon name="info" /> -->
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { api } from 'src/boot/axios';
import moment from 'moment';

export default {
  data() {
    return {
      filters: {},
      statitisticData: [],
      users: [],
    };
  },
  methods: {
    getDate(value) {
      if (value.length > 0) {
        return moment(value[0].created_at).format('DD/MM/YYYY HH:mm:ss');
      } else {
        return moment(moment()).format('DD/MM/YYYY HH:mm:ss');
      }
    },
    find() {
      api
        .post('find', this.filters)
        .then((response) => {
          if (
            response.data.status !== undefined &&
            response.data.status === 'success'
          ) {
            console.log('bobo barry', response.data.data);
            this.statitisticData = response.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  async mounted() {
    const users = await api.get('v1/users');
    const response = await api.get('/count');
    this.statitisticData = response.data.data;
    this.users = users.data.data;
  },
};
</script>