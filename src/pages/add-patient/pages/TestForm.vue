<template>
      <div>
        <h1>Information test</h1>
     <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-3 ">
   
       <base-input
          label="Name"
          v-model="formData.name"
           :validator="v$.formData.name" 
        />
          <base-select
            label="Gender"
            v-model="formData.gender"
            :options="GenderOptions"
           @update:model-value="updateIsWoman"
            :validator="v$.formData.gender" 
         />
            <base-select
            label="Pregnant"
            v-model="formData.pregnant"
            :options="PregnantOptions"
            :disable="!isWoman"
            :validator="v$.formData.pregnant" 

         />
         <base-input   :validator="v$.formData.date_of_birth"  type="date" v-model="formData.date_of_birth"/>
          <base-input
          label="Town"
          v-model="formData.town"
          :validator="v$.formData.town"
        />
          <base-input
          label="Quartier"
          v-model="formData.quartier"
          :validator="v$.formData.quartier" 
        />
           <base-input
          label="Secteur"
          v-model="formData.sector"
            :validator="v$.formData.sector" 
        />
        <div/><div/>
         <div class="q-gutter-sm"> 
       <q-checkbox 
        :validator="v$.formData.do_you_have_access_to_telephone" 
            @update:model-value="updateHavePhone"
        v-model="formData.do_you_have_access_to_telephone" label="Do you have access to a phone?" />
       </div> <div/><div/>
        <phone-input
            label="Phone"
            v-model="formData.phone_number"
            :disable="!havePhone"
             :validator="v$.formData.phone_number" 
          />
      </div>
      </div>
</template>


<script lang="ts">
import { ref } from 'vue'
import { Patient } from '../../../components/models';
import { api } from 'src/boot/axios';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
export default {
    emits: [],
 data() {
    return {
      formData: {} as Patient,
      GenderOptions:['M', 'F'],
      isWoman: false,
      PregnantOptions:['Yes', 'No'],
      havePhone:false,
      educationLevels:[
        'illiterate',
        'Primary education',
        'Lower secondary education',
        'Upper secondary education',
        'Bachelor',
        'Master',
        'Doctorate'
      ],
      matrimonialStatus:[
        'Single',
        'Married',
        'Divorced',
      ],
    }
  },
   validations () {
    return {
      formData: {
      name: {required},
      gender: {required},
      date_of_birth: {required},

      photo: {required},
      town: {required},
      quartier: {required},
      sector: {required},
      do_you_have_access_to_telephone: {required},
      phone_number: {required},
    //   phone_type: {required},
    //   level_of_education:{required},
    //   profession: {required},
    //   daily_expenditure: {required},
    //   matrimonial_status: {required},
    //   access_to_drinking_water: {required},
    //   access_to_toilet: {required},
    //   rubbish_collection_services: {required},
    //   time_to_nearest_health_facility: {required},
    //   last_visit_to_doctor: {required},
    //   how_many_doctors_visits_in_last_12_months: {required},
    //   would_you_be_willing_to_subscribe: {required},
    //   would_you_like_medical_card: {required},
    //   testing_services_and_medical_for_free: {required},
      }
    }
  },
  methods:{
  updateIsWoman (value:string){
    if(value=='F'){
      this.isWoman = true
    }else{
      this.formData.pregnant=undefined
      this.isWoman = false
    }
    },
    updateHavePhone (value:boolean){
     this.havePhone = value
    },
   async onSubmit(ref:any,step:number){
    const result = await this.v$.$validate()
   if(result){ 

      if(step<3){

        ref.stepper.next()
      }else{
        console.log('form', this.formData)
        const data =await  api.get('/patients')
        console.log('data', data)
      }}
    }
    
    
  },
  
  setup () {
    return {
      step: ref(1),
      v$: useVuelidate() 
    }
  }
}
</script>
