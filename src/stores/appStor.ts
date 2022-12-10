import { defineStore } from 'pinia';
import { RdTestResult, MedicalBackground, Symptom } from '../components/models';
import {
  Patient,
  Temperature,
  Oxygen,
  Glucose,
  BloodPresure,
} from '../components/models';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    currentPatient: {} as Patient,
    temperature: {},
    oxygen: {},
    glucose: {},
    symptom: {
      chills: 'No',
      nausea_and_vomiting: 'No',
      headaches: 'No',
      muscle_or_join_pain: 'No',
      sore_throa: 'No',
      cough: 'No',
      fatigue: 'No',
      loss_of_sense_of_smell: 'No',
      difficulty_breathing: 'No',
      diarrhoea: 'No',
    } as Symptom,
    testMalaria: false,
    testCovid: false,
    malnutrition: {},
    bloodPre: {},
    covidResult: {} as RdTestResult,
    malariaResult: {} as RdTestResult,
    medicalBackground: {} as MedicalBackground,
    tabs: ['mails'],
  }),
  persist: true,
  actions: {
    init(payload: Patient) {
      this.currentPatient = payload;
    },
    setTemperature(payload: Temperature) {
      this.temperature = payload;
    },
    setOxygen(payload: Oxygen) {
      this.oxygen = payload;
    },
    setSymptom(payload: Symptom) {
      this.symptom = payload;
    },
    setMalariaTest(payload: boolean) {
      this.testMalaria = payload;
    },
    setCovidTest(payload: boolean) {
      this.testCovid = payload;
    },
    setGlucose(payload: Glucose) {
      this.glucose = payload;
    },
    setMalnutrition(payload: Glucose) {
      this.malnutrition = payload;
    },
    setBloddPre(payload: BloodPresure) {
      this.bloodPre = payload;
    },
    setMalariaResult(payload: RdTestResult) {
      this.malariaResult = payload;
    },
    setCovidResult(payload: RdTestResult) {
      this.covidResult = payload;
    },
    setMedicalBackground(payload: MedicalBackground) {
      this.medicalBackground = payload;
    },
    setTabs(payload) {
      let tab = [];
      tab = this.tabs;
      if (!tab.includes(payload)) {
        tab.push(payload);
        this.tabs = tab;
      }
    },
    resetStore() {
      this.currentPatient = {} as Patient;
      this.temperature = {};
      this.oxygen = {};
      this.glucose = {};
      this.symptom = {
        chills: 'No',
        nausea_and_vomiting: 'No',
        headaches: 'No',
        muscle_or_join_pain: 'No',
        sore_throa: 'No',
        cough: 'No',
        fatigue: 'No',
        loss_of_sense_of_smell: 'No',
        difficulty_breathing: 'No',
        diarrhoea: 'No',
      } as Symptom;
      this.testMalaria = false;
      this.testCovid = false;
      this.malnutrition = {};
      this.bloodPre = {};
      this.covidResult = {} as RdTestResult;
      this.malariaResult = {} as RdTestResult;
      this.medicalBackground = {};
      this.tabs = ['mails'];
    },
  },
  getters: {},
});
