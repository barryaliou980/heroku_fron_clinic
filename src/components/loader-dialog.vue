<template>
   <q-dialog
      :model-value="open"
   >         <q-spinner
      color="white"
      size="3em"
      />
         
   </q-dialog>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
   props: {
      open: {
         type: Boolean,
         default: true,
      },
   },
});
</script>