<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" >
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="agent" label="Agents" />
           <q-tab name="admins" label="Admins" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="agent">
              <table-actions 
                type="agent"
            title="Agents" 
            :data="agents" 
            class="q-mt-lg"
            @getData="getData"
          
            />
          </q-tab-panel>
          <q-tab-panel name="admins">
           <table-actions 
            title="Admins" 
            :data="admins"
            type="admin"
            class="q-mt-lg"
            @getData="getData"
             
            />
          </q-tab-panel>

        

        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script>
import { api } from 'src/boot/axios'
import { ref,defineAsyncComponent } from 'vue'

export default {
    components:{
            TableActions: defineAsyncComponent(() => import('components/user-table.vue')),
    },
    data(){
        return{
        agents : [],
        admins:[]
        }
    },
    methods:{
      async getData(){
      const  agents = await api.get('/v1/agent')
      console.log('data', agents.data.data)
      this.agents= agents.data.data
      const admins = await api.get('/v1/admin')
      this.admins = admins.data.data
      console.log('data', admins.data.data)
      }
    },
    async created(){
      const  agents = await api.get('/v1/agent')
      console.log('data', agents.data.data)
      this.agents= agents.data.data
      const admins = await api.get('/v1/admin')
      this.admins = admins.data.data
      console.log('data', admins.data.data)

    },
  setup () {
    return {
      tab: ref('agent')
    }
  }
}
</script>
