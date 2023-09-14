  <template>
         <q-table
            :rows="rows"
            :columns="columnDefs"
            row-key="name"
            flat
            dense
            virtual-scroll
            :pagination="{
               rowsPerPage: 0,
            }"
            :rows-per-page-options="[0]"
         >
            <template v-slot:header="props">
               <q-tr :props="props">
                  <q-th
                     v-for="col in props.cols"
                     :key="col.name"
                     :props="props"
                     class="tw-h-10 tw-bg-gray-100 tw-text-sm tw-font-medium"
                  >
                     {{ col.label }}
                  </q-th>
               </q-tr>
            </template>

            <template v-slot:loading>
               <q-inner-loading showing color="primary" />
            </template>

            <!-- this is a passthrout for all table related slot that are but in parent -->
            <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
               <slot :name="slot" v-bind="{ ...scope }" />
            </template>

            <template #body-cell-actions="props">
               <q-td class="tw-space-x-5 tw-text-right">
                  <slot
                     name="action-start"
                     :row="props.row"

                  />
                  <q-btn
                     class="tw-font-semibold"
                     no-caps
                     rounded
                     color="black"
                     label="Edit"
                     border

                  />
                  <q-btn
                     class="tw-font-semibold"
                     no-caps
                     rounded
                     color="red"
                     label="Delete"
                  />

                  <slot
                     name="action-end"
                     :row="props.row"
                  />
               </q-td>
            </template>
         </q-table>

      </template>

<script lang="ts" setup>
import { reactive, watch, watchEffect } from 'vue';
import { useQuasar } from 'quasar';

const props = defineProps<{
   columnDefs:[]
   refreshData?: false;
   rows:[]
}>();

const emit = defineEmits(['edit', 'update:refreshData']);

const state = reactive({
   rows: [] as Array<Record<string, unknown>>,
   loading: true,
});
const $q = useQuasar();

watchEffect(() => {
   fetchData();
});

watch(
   () => props.refreshData,
   (current) => {
      if (current) {
         fetchData();
         emit('update:refreshData', false);
      }
   }
);

function fetchData() {
   state.loading = true;
}


</script>
