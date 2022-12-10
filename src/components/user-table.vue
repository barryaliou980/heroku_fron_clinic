<template>
        <div class="q-pa-md">
  <q-card>
    <q-card-section>
    <q-btn @click="addUser" color="primary" :label="('Creer un  '+title)"/>
      <div class="text-h5 text-center text-grey-8">
        Gestion des {{type}}
      </div>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <q-table :rows="data" :columns="columns" >
        <template v-slot:body-cell-Name="props">
          <q-td :props="props">
            <q-item style="max-width: 420px">
              <q-item-section avatar>
                <q-avatar>
                  <img src="../assets/default.png">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ props.row.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>
          <template v-slot:body-cell-Crated_Date="props">
          <q-td :props="props">
           {{dateFormat(props.row.created_at)}}
          </q-td>
        </template>
        <!-- <template v-slot:body-cell-Action="props">
          <q-td :props="props">
            <q-btn @click="addUser(props.row)" color="blue" icon="edit" size="sm" flat dense/>
            <q-btn @click="showDeleDialog(props.row)" color="red" icon="delete" size="sm" class="q-ml-sm" flat dense/>
          </q-td>
        </template> -->
      </q-table>
    </q-card-section>
  </q-card>
    <base-dialog
        v-model:open="showFormDialog"
        :title="`Creer un ${title}`"
        @close="onFormDialogClose"
         size="sm"
         persistent
      >
        <base-input
        label="Nom"
        class="tw-m-1"
        v-model="formData.name"
       :validator="v$.formData.name"
        />
        <base-input
         label="Email"
        class="tw-m-1"
        v-model="formData.email"
        :validator="v$.formData.email"

        />
  
       <div class=" tw-mt-5 tw-flex tw-justify-right">
       <q-btn @click="onFormDialogClose" class="tw-m-1" color="red" label="Cancel"/>
       <q-btn @click="onSubmit" class="tw-m-1" color="blue"  label="Submit"/>
       </div>

    </base-dialog>
      <q-dialog v-model="open" persistent color="red">
          <q-card
          
          >
            <q-card-section >
              <div class="text-h6">Voulez-vous supprimer cet utilisateur</div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn label="Valider" color="blue" @click="onDelete" />
              <q-btn label="Cancel" color="red" @click="(deleteId=0 ,open=false)"/>
            </q-card-actions>
          </q-card>
        </q-dialog>

      </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import moment from 'moment';
import { api } from 'src/boot/axios';
import { useUserStore } from '../stores/userStore';
export default ({
  name: 'TableActions',
  props:['data', 'title', 'type'],
  data(){
    return {
    columns :[
    {name: 'Name',  label: 'Nom', field: 'name', sortable: true, align: 'left'},
    {name: 'Project', label: 'Email', field: 'email', sortable: true, align: 'left'},
    // {name: 'Telephone', label: 'Telephone', field: 'phone_number', sortable: true, align: 'left'},
    {name: 'Crated_Date', label: 'Date de creation', field: 'created_at', sortable: true, align: 'left'},
    {name: 'Action', label: '', field: 'Action', sortable: false, align: 'center'}
    ],
     default_image: '../assets/default.png',
    showFormDialog:false,
    open:false,
    deleteId:0,
    formData:{},
   }
  },
  validations(){
    return {
        formData:{
            name:{required},
            email:{required, email},
        }
    }
  },
  methods:{
    addUser(row = null){
      console.log('Store',this.store.loggedUser.user_type)
        if(row.id===undefined){
            console.log(' null', row.id)
             this.formData = {}
        }else{
            this.formData = row
            console.log('not null', row.id)
        }
        this.showFormDialog = true
    },
    showDeleDialog(row){
        console.log('Delete', this.deleteId)
        this.deleteId = row.id
        this.open = true

    },
    async onDelete(){
        console.log('delete it')
    },
    onFormDialogClose(){
     this.showFormDialog = false
    },
    async onSubmit(){
        const validation =  await this.v$.formData.$validate()
        if(validation){
          console.log('type', this.title)
          this.formData.password= 'test1234'
          this.formData.user_type= this.type
           const {data} = await api.post('/v1/register', this.formData)
           this.showFormDialog = false
            this.$emit('getData')

        }

    },
    dateFormat(date){

     return moment(date).locale('fr').fromNow();
    },
  },
  setup() {
    return {
         v$: useVuelidate(),
          store: useUserStore(),
    }
  }
})
</script>

<style scoped>

</style>