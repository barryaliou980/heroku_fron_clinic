<template>
   <setting-layout :menus="menus" title="Statistics">
      <router-view />
   </setting-layout>
</template>

<script setup lang="ts">
import { MenuItem } from '../../components/models';


const menus: MenuItem[] = [
   { to: { name: 'admin.patient.statistics' }, label: 'PATIENT' },
   { to: { name: 'admin.patient.statistics' }, label: 'RDT TEST' },
   { to: { name: 'admin.patient.statistics' }, label: 'SICKNESS' },

];
</script>
