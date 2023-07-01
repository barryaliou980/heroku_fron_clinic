<template>
  <div>
    <!-- <q-splitter v-model="splitterModel"> -->
    <!-- <template v-slot:before> -->
    <div class="q-pa-md">
      <div class="row">
        <div class="col-3">
          <q-tree
            :nodes="persons"
            node-key="label"
            selected-color="primary"
            default-expand-all
          >
            <template v-slot:default-header="prop">
              <div class="row items-center">
                <div class="text-weight-bold text-primary">
                  {{
                    $t(prop.node.label.split(':')[0]) +
                    ' : ' +
                    prop.node.label.split(':')[1]
                  }}
                </div>
              </div>
            </template>
          </q-tree>
        </div>

        <div class="col-3">
          <q-tree
            :nodes="vitals"
            node-key="label"
            selected-color="primary"
            default-expand-all
          >
            <template v-slot:default-header="prop">
              <div class="row items-center">
                <div
                  v-if="prop.node.label.split(':').length == 2"
                  class="text-weight-bold text-primary"
                >
                  {{
                    $t(prop.node.label.split(':')[0]) +
                    ' : ' +
                    prop.node.label.split(':')[1]
                  }}
                </div>
                <div v-else class="text-weight-bold text-primary">
                  {{ $t(prop.node.label.split(':')[0]) }}
                </div>
              </div>
            </template>
          </q-tree>
        </div>

        <div class="col-3">
          <q-tree
            :nodes="covid"
            node-key="label"
            selected-color="primary"
            default-expand-all
          >
            <template v-slot:default-header="prop">
              <div class="row items-center">
                <div class="text-weight-bold text-primary">
                  {{
                    $t(prop.node.label.split(':')[0]) +
                    ' : ' +
                    prop.node.label.split(':')[1]
                  }}
                </div>
              </div>
            </template>
          </q-tree>
        </div>
        <div class="col-3">
          <q-tree :nodes="malaria" node-key="label" selected-color="primary">
            <template v-slot:default-header="prop">
              <div class="row items-center">
                <div class="text-weight-bold text-primary">
                  {{
                    $t(prop.node.label.split(':')[0]) +
                    ' : ' +
                    prop.node.label.split(':')[1]
                  }}
                </div>
              </div>
            </template>
          </q-tree>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="q-pa-md">
            <q-table
              class="my-sticky-header-column-table"
              title="Patient Covid"
              :rows="patientCovid"
              :columns="columns"
              row-key="name"
            >
              <template v-slot:header="props">
                <q-td
                  style="font-weight: bold"
                  v-for="head in props.cols"
                  :key="head.name"
                >
                  {{ $t(`${head.name}`) }}
                </q-td>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    <div v-if="col.name === 'patient_uid'">
                      <span>{{ props.row.patient.patient_uid }}</span>
                    </div>
                    <div v-else-if="col.name === 'name'">
                      <span>{{ props.row.patient.name }}</span>
                    </div>
                    <div v-else-if="col.name === 'phone_number'">
                      <span>{{ props.row.patient.phone_number }}</span>
                    </div>
                    <div
                      :class="
                        flagColor(props.row.patient.temperature[0].vital_flag)
                      "
                      v-else-if="col.name === 'temperature'"
                    >
                      <span>{{
                        $t(props.row.patient.temperature[0].temperature)
                      }}</span>
                    </div>
                    <div
                      :class="
                        col.name === 'oxygen'
                          ? flagColor(props.row.patient.oxygen[0].vital_flag)
                          : ''
                      "
                      v-else-if="col.name === 'oxygen'"
                    >
                      <span>{{
                        $t(props.row.patient.oxygen[0].oxygen_saturation)
                      }}</span>
                    </div>

                    <div
                      :class="flagColor(props.row.symptom.chills)"
                      v-else-if="col.name === 'chills'"
                    >
                      <span>{{ $t(props.row.symptom.chills) }}</span>
                    </div>
                    <div
                      :class="flagColorSymptome(props.row.symptom.cough)"
                      v-else-if="col.name === 'cough'"
                    >
                      <span>{{ $t(props.row.symptom.cough) }}</span>
                    </div>

                    <div
                      :class="flagColorSymptome(props.row.symptom.diarrhoea)"
                      v-else-if="col.name === 'diarrhoea'"
                    >
                      <span>{{ $t(props.row.symptom.diarrhoea) }}</span>
                    </div>

                    <div
                      :class="
                        flagColorSymptome(
                          props.row.symptom.difficulty_breathing
                        )
                      "
                      v-else-if="col.name === 'difficulty_breathing'"
                    >
                      <span>{{
                        $t(props.row.symptom.difficulty_breathing)
                      }}</span>
                    </div>
                    <div
                      :class="flagColorSymptome(props.row.symptom.fatigue)"
                      v-else-if="col.name === 'fatigue'"
                    >
                      <span>{{ $t(props.row.symptom.fatigue) }}</span>
                    </div>
                    <div
                      :class="flagColorSymptome(props.row.symptom.headaches)"
                      v-else-if="col.name === 'headaches'"
                    >
                      <span>{{ $t(props.row.symptom.headaches) }}</span>
                    </div>
                    <div
                      :class="
                        flagColorSymptome(
                          props.row.symptom.loss_of_sense_of_smell
                        )
                      "
                      v-else-if="col.name === 'loss_of_sense_of_smell'"
                    >
                      <span>{{
                        $t(props.row.symptom.loss_of_sense_of_smell)
                      }}</span>
                    </div>
                    <div
                      :class="
                        flagColorSymptome(props.row.symptom.muscle_or_join_pain)
                      "
                      v-else-if="col.name === 'muscle_or_join_pain'"
                    >
                      <span>{{
                        $t(props.row.symptom.muscle_or_join_pain)
                      }}</span>
                    </div>
                    <div
                      :class="
                        flagColorSymptome(props.row.symptom.nausea_and_vomiting)
                      "
                      v-else-if="col.name === 'nausea_and_vomiting'"
                    >
                      <span>{{
                        $t(props.row.symptom.nausea_and_vomiting)
                      }}</span>
                    </div>
                    <div
                      :class="flagColorSymptome(props.row.symptom.sore_throa)"
                      v-else-if="col.name === 'sore_throa'"
                    >
                      <span>{{ $t(props.row.symptom.sore_throa) }}</span>
                    </div>

                    <p v-else>{{ props.row.patient_id }}</p>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>
    <!-- </template> -->
    <!-- </q-splitter> -->
  </div>
</template>

<script>
import { ref } from 'vue';
import { api } from 'src/boot/axios';

export default {
  data() {
    return {
      persons: [
        {
          label: 'Patients:0',
          children: [
            {
              label: 'Males : 0',
            },
            {
              label: 'Females : 0',
              children: [
                {
                  label: 'Pregnant : 0',
                },
              ],
            },
            {
              label: 'Children : 0',
              children: [
                {
                  label: 'Males : 0',
                },
                {
                  label: 'Females : 0',
                },
              ],
            },
          ],
        },
      ],

      vitals: [
        {
          label: 'Vital Parameters',
          children: [
            {
              label: 'glucose : 0',
              children: [
                {
                  label: 'Normal : 0',
                },
                {
                  label: 'Low : 0',
                },
                {
                  label: 'Very Low : 0',
                },
              ],
            },
            {
              label: 'bloodPressure : 0',
              children: [
                {
                  label: 'Normal : 0',
                },
                {
                  label: 'Low : 0',
                },
                {
                  label: 'Very Low : 0',
                },
              ],
            },
            {
              label: 'malnutrition : 0',
            },
          ],
        },
      ],

      covid: [
        {
          label: 'Covid : 0',
          children: [
            {
              label: 'Positif : 0',
            },
            {
              label: 'Negatif : 0',
            },
            {
              label: 'Indeterminate : 0',
            },
            {
              label: 'Invalid : 0',
            },
            {
              label: 'Did not : 0',
            },
          ],
        },
      ],

      malaria: [
        {
          label: 'Malaria : 0',
          expanded: true,
          children: [
            {
              label: 'Positif : 0',
            },
            {
              label: 'Negatif : 0',
            },
            {
              label: 'Indeterminate : 0',
            },
            {
              label: 'Invalid : 0',
            },
            {
              label: 'Did not : 0',
            },
          ],
        },
      ],
      columns: [
        {
          name: 'name',
          align: 'center',
          label: 'name',
          field: 'calories',
          sortable: true,
        },
        {
          name: 'patient_uid',
          required: true,
          align: 'center',
          label: 'patient_uid',
          align: 'left',
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: 'phone_number',
          label: 'phone_number',
          align: 'center',
          field: 'fat',
          sortable: true,
        },

        {
          name: 'temperature',
          label: 'temperature',
          field: 'fat',
          align: 'center',
          sortable: true,
        },
        {
          name: 'oxygen',
          label: 'oxygen',
          field: 'fat',
          align: 'center',
          sortable: true,
        },
        {
          name: 'chills',
          label: 'chills',
          field: 'fat',
          sortable: true,
        },
        {
          name: 'nausea_and_vomiting',
          label: 'nausea_and_vomiting',
          field: 'fat',
          sortable: true,
        },
        {
          name: 'headaches',
          label: 'headaches',
          field: 'fat',
          sortable: true,
        },
        {
          name: 'muscle_or_join_pain',
          label: 'muscle_or_join_pain',
          field: 'fat',
          sortable: true,
        },
        {
          name: 'sore_throa',
          label: 'sore_throa',
          field: 'fat',
          sortable: true,
        },
        {
          name: 'cough',
          label: 'cough',
          field: 'fat',
          sortable: true,
        },
        {
          name: 'fatigue',
          label: 'fatigue',
          field: 'fat',
          sortable: true,
        },
        {
          name: 'loss_of_sense_of_smell',
          label: 'loss_of_sense_of_smell',
          field: 'fat',
          sortable: true,
        },

        {
          name: 'difficulty_breathing',
          label: 'difficulty_breathing',
          field: 'fat',
          sortable: true,
        },

        {
          name: 'diarrhoea',
          label: 'diarrhoea',
          field: 'fat',
          sortable: true,
        },
      ],
      patientCovid: [],
    };
  },
  methods: {
    statPersons(dataStatistics) {
      this.persons[0].label = 'Patient: ' + dataStatistics.totalPatient;
      this.persons[0].children[0].label = 'Males: ' + dataStatistics.mens;
      this.persons[0].children[1].label = 'Females: ' + dataStatistics.women;
      this.persons[0].children[1].children[0].label =
        'Pregnant: ' + dataStatistics.pregnant;

      this.persons[0].children[2].label =
        'Children: ' + dataStatistics.total_child;
      this.persons[0].children[2].children[0].label =
        'Males: ' + dataStatistics.total_child_boys;
      this.persons[0].children[2].children[1].label =
        'Females: ' + dataStatistics.total_child_girls;
    },
    statVitals(dataStatistics) {
      this.vitals[0].children[0].label = 'Glucose: ' + dataStatistics.glucose;

      this.vitals[0].children[0].children[0].label =
        'Normal: ' + dataStatistics.glDetails[0];

      this.vitals[0].children[0].children[1].label =
        'Low: ' + dataStatistics.glDetails[1];

      this.vitals[0].children[0].children[2].label =
        'Very Low: ' + dataStatistics.glDetails[2];

      this.vitals[0].children[1].label =
        'Blood Pressure: ' + dataStatistics.bloodPressure;

      this.vitals[0].children[1].children[0].label =
        'Normal: ' + dataStatistics.bpDetails[0];

      this.vitals[0].children[1].children[1].label =
        'Low: ' + dataStatistics.bpDetails[1];

      this.vitals[0].children[1].children[2].label =
        'Very Low: ' + dataStatistics.bpDetails[2];

      this.vitals[0].children[2].label =
        'Malnutrition: ' + dataStatistics.malnutrition;
    },
    statCovid(dataStatistics) {
      this.covid[0].label = 'Covid: ' + dataStatistics.total_covid;
      this.covid[0].children[0].label =
        'Positif: ' + dataStatistics.covid.positif;
      this.covid[0].children[1].label =
        'Negatif: ' + dataStatistics.covid.negatif;
      this.covid[0].children[2].label =
        'Indeterminate: ' + dataStatistics.covid.indeterminate;
      this.covid[0].children[3].label =
        'Invalid: ' + dataStatistics.covid.invalid;
      this.covid[0].children[4].label =
        'Did not: ' + dataStatistics.covid.didnot;
    },
    statMararia(dataStatistics) {
      this.malaria[0].label = 'Malaria: ' + dataStatistics.total_malaria;
      this.malaria[0].children[0].label =
        'Positif: ' + dataStatistics.malaria.positif;
      this.malaria[0].children[1].label =
        'Negatif: ' + dataStatistics.malaria.negatif;
      this.malaria[0].children[2].label =
        'Indeterminate: ' + dataStatistics.malaria.indeterminate;
      this.malaria[0].children[3].label =
        'Invalid: ' + dataStatistics.malaria.invalid;
      this.malaria[0].children[4].label =
        'Did not: ' + dataStatistics.malaria.didnot;
    },
    flagColor(flag) {
      if (Number(flag) === 0) {
        return 'text-center bg-positive text-white';
      } else if (Number(flag) === 1) {
        return 'text-center bg-warning text-white';
      } else if (Number(flag) > 1) {
        return 'text-center bg-negative text-white';
      } else {
        return 'text-center bg-white text-black';
      }
    },
    flagColorSymptome(flag) {
      if (flag === 'Yes') {
        return 'bg-negative text-center text-white';
      } else {
        return 'bg-white text-center text-black';
      }
    },
  },
  setup() {
    return {
      splitterModel: ref(50),
      selected: ref('Food'),
    };
  },
  async mounted() {
    const response = await api.get('/stats');
    const dataStatistics = response.data.data;

    this.patientCovid = dataStatistics.patientCovid;

    console.log('Smart ', dataStatistics);

    this.statPersons(dataStatistics);
    this.statVitals(dataStatistics);
    this.statCovid(dataStatistics);
    this.statMararia(dataStatistics);
  },
};
</script>

<style lang="sass">
.my-sticky-header-column-table
  /* height or max-height is important */

  /* specifying max-width so the example can
   highlight the sticky column on any browser window */

  td:first-child
    /* bg color is important for td; just specify one */
    background-color: #c1f4cd !important

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #fff

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child
    /* highest z-index */
    z-index: 3

  td:first-child
    z-index: 3

  td:first-child, th:first-child
    position: sticky
    left: 0
</style>
