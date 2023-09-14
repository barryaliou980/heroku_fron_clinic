<template>
  <div class="q-pa-md">
    <q-splitter v-model="splitterModel" style="height: auto">
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="bg-primary text-white shadow-2">
          <q-tab
            v-for="referCond in patientReferalTabs"
            @click="changeSelectedTab(referCond.referal_type)"
            :key="referCond.referal_type"
            :name="referCond.referal_type"
            :label="$t(referCond.referal_type)"
          />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
          ref="tabbox"
        >
          <q-tab-panel name="bloodPressure">
            <div class="text-h4 q-mb-md">{{ $t('bloodPressure') }}</div>
            <div
              class="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-3"
              v-if="bpLevel == 1 || bpLevel == 2"
            >
              <base-select
                filled
                :label="$t('counselling_completed')"
                :validator="v$.bpRefer.counselling_completed"
                v-model="bpRefer.counselling_completed"
                :options="Qoptions"
                :display-value="
                  bpRefer.counselling_completed
                    ? $t(`${bpRefer.counselling_completed}`)
                    : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('chc_refered')"
                :validator="v$.bpRefer.chc_refered"
                v-model="bpRefer.chc_refered"
                :options="Qoptions"
                :display-value="
                  bpRefer.chc_refered ? $t(`${bpRefer.chc_refered}`) : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('raison_not_refered')"
                use-chips
                multiple
                v-show="bpRefer.chc_refered == 'No'"
                :validator="v$.bpRefer.raison_not_refered"
                v-model="BPraisonNotRefered"
                :options="raisonNotReferedOptions"
                :display-value="
                  BPraisonNotRefered ? $t(`${BPraisonNotRefered}`) : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('patient_intends_to_refer')"
                :validator="v$.bpRefer.patient_intends_to_refer"
                v-model="bpRefer.patient_intends_to_refer"
                :options="Qoptions"
                :display-value="
                  bpRefer.patient_intends_to_refer
                    ? $t(`${bpRefer.patient_intends_to_refer}`)
                    : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('reason_if_no_attend')"
                v-show="bpRefer.patient_intends_to_refer == 'No'"
                :validator="v$.bpRefer.reason_if_no_attend"
                v-model="BPraisonNotIntends"
                :options="reasonIfNoAttendOptions"
                use-chips
                multiple
                :display-value="
                  BPraisonNotIntends ? $t(`${BPraisonNotIntends}`) : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <q-btn
                class="tw-mt-3"
                @click="submitBloodPresure"
                color="blue"
                :label="$t('btnSubmit')"
                v-bind:disable="disabledEnd"
              />
            </div>

            <div
              v-else
              class="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-3"
            >
              <base-select
                filled
                :label="$t('specialist_name')"
                :validator="v$.bpReferLevel3.specialist_name"
                v-model="bpReferLevel3.specialist_name"
                :options="specialistes"
                @update:model-value="choiseSpecialist"
                :display-value="
                  bpReferLevel3.specialist_name
                    ? $t(`${bpReferLevel3.specialist_name.name}`)
                    : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt.name}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <phone-input
                :label="$t('specialist_number')"
                v-model="bpReferLevel3.specialist_number"
                :validator="v$.bpReferLevel3.specialist_number"
              />

              <base-select
                filled
                :label="$t('patient_call_specialist')"
                :validator="v$.bpReferLevel3.patient_call_specialist"
                v-model="bpReferLevel3.patient_call_specialist"
                :options="Qoptions"
                :display-value="
                  bpReferLevel3.patient_call_specialist
                    ? $t(`${bpReferLevel3.patient_call_specialist}`)
                    : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <q-btn
                class="tw-mt-3"
                @click="submitBloodPresure"
                color="blue"
                :label="$t('btnSubmit')"
                :loading="loadingBtn"
                v-bind:disable="disabledEnd"
              />
            </div>

            <div class="text-h6 tw-mt-3 msg" v-if="msgShow">
              {{ $t('success_refer_message') }}
            </div>
          </q-tab-panel>

          <q-tab-panel name="glucose">
            <div class="text-h4 q-mb-md">{{ $t('glucose') }}</div>
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-3">
              <base-select
                filled
                :label="$t('counselling_completed')"
                :validator="v$.bgRefer.counselling_completed"
                v-model="bgRefer.counselling_completed"
                :options="Qoptions"
                :display-value="
                  bgRefer.counselling_completed
                    ? $t(`${bgRefer.counselling_completed}`)
                    : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('chc_refered')"
                :validator="v$.bgRefer.chc_refered"
                v-model="bgRefer.chc_refered"
                :options="Qoptions"
                :display-value="
                  bgRefer.chc_refered ? $t(`${bgRefer.chc_refered}`) : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('raison_not_refered')"
                use-chips
                multiple
                v-show="bgRefer.chc_refered == 'No'"
                :validator="v$.bgRefer.raison_not_refered"
                v-model="BGraisonNotRefered"
                :options="raisonNotReferedOptions"
                :display-value="
                  BGraisonNotRefered ? $t(`${BGraisonNotRefered}`) : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('patient_intends_to_refer')"
                :validator="v$.bgRefer.patient_intends_to_refer"
                v-model="bgRefer.patient_intends_to_refer"
                :options="Qoptions"
                :display-value="
                  bgRefer.patient_intends_to_refer
                    ? $t(`${bgRefer.patient_intends_to_refer}`)
                    : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('reason_if_no_attend')"
                v-show="bgRefer.patient_intends_to_refer == 'No'"
                :validator="v$.bgRefer.reason_if_no_attend"
                v-model="BGraisonNotIntends"
                :options="reasonIfNoAttendOptions"
                use-chips
                multiple
                :display-value="
                  BGraisonNotIntends ? $t(`${BGraisonNotIntends}`) : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <q-btn
                class="tw-mt-3"
                @click="submitBloodGlucose"
                color="blue"
                :label="$t('btnSubmit')"
                :loading="loadingBtn"
                v-bind:disable="disabledEnd"
              />
            </div>

            <div class="text-h6 tw-mt-3 msg" v-if="msgShow">
              {{ $t('success_refer_message') }}
            </div>
          </q-tab-panel>

          <q-tab-panel name="malaria">
            <div class="text-h4 q-mb-md">{{ $t('malaria') }}</div>
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-3">
              <base-select
                readonly
                hint="Readonly"
                filled
                :label="$t('medication_recomdt')"
                :validator="v$.malariaRefer.medication_recomdt"
                v-model="malariaRefer.medication_recomdt"
                :options="medication"
                :display-value="
                  malariaRefer.medication_recomdt
                    ? $t(`${malariaRefer.medication_recomdt}`)
                    : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('posology')"
                :validator="v$.malariaRefer.posology"
                v-model="malariaRefer.posology"
                readonly
                hint="Readonly"
                :options="medicationPosology"
                :display-value="
                  malariaRefer.posology ? $t(`${malariaRefer.posology}`) : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('received_medic')"
                :validator="v$.malariaRefer.received_medic"
                v-model="malariaRefer.received_medic"
                :options="Qoptions"
                :display-value="
                  malariaRefer.received_medic
                    ? $t(`${malariaRefer.received_medic}`)
                    : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('reason_not_received_medic')"
                :validator="v$.malariaRefer.reason_not_received_medic"
                v-show="malariaRefer.received_medic == 'No'"
                v-model="malariaRefer.reason_not_received_medic"
                :options="reasonNotReceivedMedocOptions"
                :display-value="
                  malariaRefer.reason_not_received_medic
                    ? $t(`${malariaRefer.reason_not_received_medic}`)
                    : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <q-btn
                class="tw-mt-3"
                @click="submitMalaria"
                color="blue"
                :label="$t('btnSubmit')"
                :loading="loadingBtn"
                v-bind:disable="disabledEnd"
              />
            </div>

            <div class="text-h6 tw-mt-3 msg" v-if="msgShow">
              {{ $t('success_refer_message') }}
            </div>
          </q-tab-panel>

          <q-tab-panel name="covid">
            <div class="text-h4 q-mb-md">{{ $t('covid') }}</div>
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-3">
              <base-select
                filled
                :label="$t('counselling_completed')"
                :validator="v$.covidRefer.counselling_completed"
                v-model="covidRefer.counselling_completed"
                :options="Qoptions"
                :display-value="
                  covidRefer.counselling_completed
                    ? $t(`${covidRefer.counselling_completed}`)
                    : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('chc_refered')"
                :validator="v$.covidRefer.chc_refered"
                v-model="covidRefer.chc_refered"
                :options="Qoptions"
                :display-value="
                  covidRefer.chc_refered ? $t(`${covidRefer.chc_refered}`) : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('raison_not_refered')"
                use-chips
                multiple
                v-show="covidRefer.chc_refered == 'No'"
                :validator="v$.covidRefer.raison_not_refered"
                v-model="CovRaisonNotRefered"
                :options="raisonNotReferedOptions"
                :display-value="
                  CovRaisonNotRefered ? $t(`${CovRaisonNotRefered}`) : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('patient_intends_to_refer')"
                :validator="v$.covidRefer.patient_intends_to_refer"
                v-model="covidRefer.patient_intends_to_refer"
                :options="Qoptions"
                :display-value="
                  covidRefer.patient_intends_to_refer
                    ? $t(`${covidRefer.patient_intends_to_refer}`)
                    : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('reason_if_no_attend')"
                v-show="covidRefer.patient_intends_to_refer == 'No'"
                :validator="v$.covidRefer.reason_if_no_attend"
                v-model="CovRaisonNotIntends"
                :options="reasonIfNoAttendOptions"
                use-chips
                multiple
                :display-value="
                  CovRaisonNotIntends ? $t(`${CovRaisonNotIntends}`) : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <q-btn
                class="tw-mt-3"
                @click="submitCovid"
                color="blue"
                :label="$t('btnSubmit')"
                :loading="loadingBtn"
                v-bind:disable="disabledEnd"
              />
            </div>

            <div class="text-h6 tw-mt-3 msg" v-if="msgShow">
              {{ $t('success_refer_message') }}
            </div>
          </q-tab-panel>

          <q-tab-panel name="malnutrition">
            <div class="text-h4 q-mb-md">{{ $t('malnutrition') }}</div>
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-3">
              <base-select
                filled
                :label="$t('counselling_completed')"
                :validator="v$.malnutritionRefer.counselling_completed"
                v-model="malnutritionRefer.counselling_completed"
                :options="Qoptions"
                :display-value="
                  malnutritionRefer.counselling_completed
                    ? $t(`${malnutritionRefer.counselling_completed}`)
                    : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('chc_refered')"
                :validator="v$.malnutritionRefer.chc_refered"
                v-model="malnutritionRefer.chc_refered"
                :options="Qoptions"
                :display-value="
                  malnutritionRefer.chc_refered
                    ? $t(`${malnutritionRefer.chc_refered}`)
                    : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('raison_not_refered')"
                use-chips
                multiple
                v-show="malnutritionRefer.chc_refered == 'No'"
                :validator="v$.malnutritionRefer.raison_not_refered"
                v-model="MalnRaisonNotRefered"
                :options="raisonNotReferedOptions"
                :display-value="
                  MalnRaisonNotRefered ? $t(`${MalnRaisonNotRefered}`) : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('patient_intends_to_refer')"
                :validator="v$.malnutritionRefer.patient_intends_to_refer"
                v-model="malnutritionRefer.patient_intends_to_refer"
                :options="Qoptions"
                :display-value="
                  malnutritionRefer.patient_intends_to_refer
                    ? $t(`${malnutritionRefer.patient_intends_to_refer}`)
                    : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <base-select
                filled
                :label="$t('reason_if_no_attend')"
                v-show="malnutritionRefer.patient_intends_to_refer == 'No'"
                :validator="v$.malnutritionRefer.reason_if_no_attend"
                v-model="MalnRaisonNotIntends"
                :options="reasonIfNoAttendOptions"
                use-chips
                multiple
                :display-value="
                  MalnRaisonNotIntends ? $t(`${MalnRaisonNotIntends}`) : ''
                "
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(`${scope.opt}`) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </base-select>

              <q-btn
                class="tw-mt-3"
                @click="submitMalnutrition"
                color="blue"
                :label="$t('btnSubmit')"
                :loading="loadingBtn"
                v-bind:disable="disabledEnd"
              />
            </div>

            <div class="text-h6 tw-mt-3 msg" v-if="msgShow">
              {{ $t('success_refer_message') }}
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>

      <q-btn
        v-show="btnConfirmRefer"
        class="tw-mt-3 float-right"
        color="green"
        :label="$t('Confirmed_Referal')"
        :loading="loadingBtnConfirmed"
        v-bind:disable="disabledEndConfirmed"
        @click="confirmPatientReferal"
      />
    </q-splitter>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="inception" no-backdrop-dismiss>
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t('confirm_patient_refer') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ $t('are_you_sure_confirm_refer_patient') }}
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('submit_refer')" @click="OkReferred" />
          <q-btn flat :label="$t('cancel')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="secondDialog"
      no-backdrop-dismiss
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-teal text-white" style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">{{ $t('patient_refer_success') }}</div>
          <div v-show="patient_uid != ''" class="text-h4">
            {{ $t('patient_uid : ') }} {{ patient_uid }}
          </div>
          <div v-show="name != ''" class="text-h5">
            {{ $t('name') }} : {{ name }}
          </div>
          <div v-show="date_of_birth != ''" class="text-h5">
            {{ $t('patient.date_of_birth') }} : {{ date_of_birth }}
          </div>
          <div v-show="phone_number != ''" class="text-h5">
            {{ $t('phone_number') }} : {{ phone_number }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ $t('patient_refer_submit_msg') }}
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup @click="Go" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { api } from 'src/boot/axios';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import moment from 'moment';

export default {
  data() {
    return {
      disabledEnd: false,
      loadingBtnConfirmed: false,
      disabledEndConfirmed: false,
      patient_id: '',
      patient_uid: '',
      name: '',
      date_of_birth: '',
      phone_number: '',
      bgRefer: {},
      covidRefer: {},
      malariaRefer: {},
      malnutritionRefer: {},
      bpRefer: {},
      tab: ref(null),
      bpReferLevel3: {},
      bpLevel: 0,
      isChildMedication: false,
      msgShow: false,
      loadingBtn: false,
      patientReferalTabs: [],
      confirmReferal: {},
      btnConfirmRefer: true,
      Qoptions: ['Yes', 'No'],
      raisonNotReferedOptions: ['CHC closed', 'Service not available', 'Other'],
      reasonIfNoAttendOptions: ['Distance', 'Cost', 'Access', 'Other'],
      medication: ['Artefan', 'Coartem'],
      medicationPosology: [
        '4 tablets morning and evening',
        '2 tablets morning and evening',
        '1 tablets morning and evening',
      ],
      reasonNotReceivedMedocOptions: [
        'Medication not available on site',
        'Patient does not want to take medication',
        'Other',
      ],
      specialistes: [
        { name: 'Alpha Oumar Bah', phone: '620 23 23 56' },
        { name: 'Bobo Barry', phone: '620 90 87 56' },
        { name: 'Nasser Diallo', phone: '666 53 63 86' },
        { name: 'Paula Barry', phone: '622 22 10 10' },
      ],
    };
  },
  methods: {
    changeSelectedTab(type) {
      this.msgShow = false;
    },
    async submitBloodGlucose() {
      this.loadingBtn = true;
      if (
        (await this.v$.bgRefer.counselling_completed.$validate()) &&
        (await this.v$.bgRefer.chc_refered.$validate()) &&
        (await this.v$.bgRefer.patient_intends_to_refer.$validate())
      ) {
        if (this.bgRefer.chc_refered == 'No') {
          if (this.BGraisonNotRefered == null) {
            this.loadingBtn = false;
            return false;
          }
        }
        if (this.bgRefer.patient_intends_to_refer == 'No') {
          if (this.BGraisonNotIntends == null) {
            this.loadingBtn = false;
            return false;
          }
        }
        if (this.BGraisonNotRefered != null) {
          this.bgRefer.raison_not_refered = this.BGraisonNotRefered.toString();
        }

        if (this.BGraisonNotIntends != null) {
          this.bgRefer.reason_if_no_attend = this.BGraisonNotIntends.toString();
        }

        this.bgRefer.patient_id = this.patient_id;
        this.bgRefer.referal_type = 'glucose';
        await api.post('/referal', this.bgRefer);

        this.msgShow = true;
        this.loadingBtn = false;
        this.confirmRefer();
      }
    },
    async submitCovid() {
      this.loadingBtn = true;
      if (
        (await this.v$.covidRefer.counselling_completed.$validate()) &&
        (await this.v$.covidRefer.chc_refered.$validate()) &&
        (await this.v$.covidRefer.patient_intends_to_refer.$validate())
      ) {
        if (this.covidRefer.chc_refered == 'No') {
          if (this.CovRaisonNotRefered == null) {
            this.loadingBtn = false;
            return false;
          }
        }
        if (this.covidRefer.patient_intends_to_refer == 'No') {
          if (this.CovRaisonNotIntends == null) {
            this.loadingBtn = false;
            return false;
          }
        }
        if (this.CovRaisonNotRefered != null) {
          this.covidRefer.raison_not_refered =
            this.CovRaisonNotRefered.toString();
        }

        if (this.CovRaisonNotIntends != null) {
          this.covidRefer.reason_if_no_attend =
            this.CovRaisonNotIntends.toString();
        }
        this.covidRefer.patient_id = this.patient_id;
        this.covidRefer.referal_type = 'covid';
        await api.post('/referal', this.covidRefer);
        this.msgShow = true;
        this.loadingBtn = false;
        this.confirmRefer();
      }
    },
    async submitMalaria() {
      this.loadingBtn = true;
      if (
        (await this.v$.malariaRefer.medication_recomdt.$validate()) &&
        (await this.v$.malariaRefer.posology.$validate()) &&
        (await this.v$.malariaRefer.received_medic.$validate())
      ) {
        if (this.malariaRefer.received_medic == 'No') {
          if (this.malariaRefer.reason_not_received_medic == '') {
            this.loadingBtn = false;
            return false;
          }
        }
        this.malariaRefer.patient_id = this.patient_id;
        this.malariaRefer.referal_type = 'malaria';
        this.malariaRefer.chc_refered = 'N/A';
        this.malariaRefer.counselling_completed = 'N/A';
        this.malariaRefer.patient_intends_to_refer = 'N/A';
        // this.malariaRefer.reason_not_received_medic = 'malaria';

        await api.post('/referal', this.malariaRefer);
        this.isChild();
        this.msgShow = true;
        this.loadingBtn = false;
        this.confirmRefer();
      }
    },
    async submitMalnutrition() {
      this.loadingBtn = true;
      if (
        (await this.v$.malnutritionRefer.counselling_completed.$validate()) &&
        (await this.v$.malnutritionRefer.chc_refered.$validate()) &&
        (await this.v$.malnutritionRefer.patient_intends_to_refer.$validate())
      ) {
        if (this.malnutritionRefer.chc_refered == 'No') {
          if (this.MalnRaisonNotRefered == null) {
            this.loadingBtn = false;
            return false;
          }
        }
        if (this.malnutritionRefer.patient_intends_to_refer == 'No') {
          if (this.MalnRaisonNotIntends == null) {
            this.loadingBtn = false;
            return false;
          }
        }
        if (this.MalnRaisonNotRefered != null) {
          this.malnutritionRefer.raison_not_refered =
            this.MalnRaisonNotRefered.toString();
        }

        if (this.MalnRaisonNotIntends != null) {
          this.malnutritionRefer.reason_if_no_attend =
            this.MalnRaisonNotIntends.toString();
        }

        this.malnutritionRefer.patient_id = this.patient_id;
        this.malnutritionRefer.referal_type = 'malnutrition';
        await api.post('/referal', this.malnutritionRefer);
        this.msgShow = true;
        this.loadingBtn = false;
        this.confirmRefer();
      }
    },
    async submitBloodPresure() {
      this.loadingBtn = true;
      if (this.bpLevel < 3) {
        if (
          (await this.v$.bpRefer.counselling_completed.$validate()) &&
          (await this.v$.bpRefer.chc_refered.$validate()) &&
          (await this.v$.bpRefer.patient_intends_to_refer.$validate())
        ) {
          if (this.bpRefer.chc_refered == 'No') {
            if (this.BPraisonNotRefered == null) {
              this.loadingBtn = false;
              return false;
            }
          }
          if (this.bpRefer.patient_intends_to_refer == 'No') {
            if (this.BPraisonNotIntends == null) {
              this.loadingBtn = false;
              return false;
            }
          }
          if (this.BPraisonNotRefered != null) {
            this.bpRefer.raison_not_refered =
              this.BPraisonNotRefered.toString();
          }

          if (this.BPraisonNotIntends != null) {
            this.bpRefer.reason_if_no_attend =
              this.BPraisonNotIntends.toString();
          }
          this.bpRefer.patient_id = this.patient_id;
          this.bpRefer.referal_type = 'bloodPressure';
          await api.post('/referal', this.bpRefer);
          this.msgShow = true;
          this.loadingBtn = false;
          this.confirmRefer();
        }
      } else {
        if (
          (await this.v$.bpReferLevel3.specialist_name.$validate()) &&
          (await this.v$.bpReferLevel3.specialist_number.$validate()) &&
          (await this.v$.bpReferLevel3.patient_call_specialist.$validate())
        ) {
          this.bpReferLevel3.patient_id = this.patient_id;
          this.bpReferLevel3.specialist_name =
            this.bpReferLevel3.specialist_name.name;
          this.bpReferLevel3.referal_type = 'bloodPressure';
          this.bpReferLevel3.chc_refered = 'bp';
          this.bpReferLevel3.patient_intends_to_refer = 'N/A';
          this.bpReferLevel3.counselling_completed = 'N/A';
          await api.post('/referal', this.bpReferLevel3);
          const specialist = new Object();
          specialist.name = this.bpReferLevel3.specialist_name;
          specialist.phone = this.bpReferLevel3.specialist_number;
          this.bpReferLevel3.specialist_name = specialist;
          this.msgShow = true;
          this.loadingBtn = false;
          this.confirmRefer();
        }
      }
    },
    choiseSpecialist(specialist) {
      this.bpReferLevel3.specialist_number = specialist.phone;
    },
    isChild() {
      api.get(`/patients/${this.$route.params.id}`).then((response) => {
        const patient = response.data.data;
        this.isChildMedication = moment().diff(patient.date_of_birth, 'years');

        if (this.isChildMedication <= 5) {
          this.malariaRefer.posology = this.medicationPosology[2];
          this.malariaRefer.medication_recomdt = this.medication[1];
        }
        if (this.isChildMedication > 5 && this.isChildMedication <= 12) {
          this.malariaRefer.posology = this.medicationPosology[1];
          this.malariaRefer.medication_recomdt = this.medication[1];
        }
        if (this.isChildMedication > 12) {
          this.malariaRefer.posology = this.medicationPosology[0];
          this.malariaRefer.medication_recomdt = this.medication[0];
        }
      });
    },
    confirmRefer() {
      if (this.$route.params.id !== undefined) {
        this.patient_id = this.$route.params.id;
        let counter = 0;
        api.get(`/refer/${this.$route.params.id}`).then((response) => {
          response.data.forEach((referCondition) => {
            if (referCondition.refered_by == null) {
              counter++;
            }
          });
          if (counter == 0) {
            this.btnConfirmRefer = true;
          }
          if (counter > 0) {
            this.btnConfirmRefer = false;
          }
        });
      }
    },
    confirmPatientReferal() {
      this.inception = true;
    },

    OkReferred() {
      this.loadingBtnConfirmed = true;
      api.post('/confirm', { patient_id: this.patient_id }).then((response) => {
        this.secondDialog = true;
        this.inception = false;
        this.loadingBtnConfirmed = false;
        this.patient_uid = response.data.data.patient_uid;
        this.name = response.data.data.name;
        this.date_of_birth = response.data.data.date_of_birth;
        this.phone_number = response.data.data.phone_number;
        this.disabledEnd = true;
        this.disabledEndConfirmed = true;
      });
    },
    IsReferConfirmed(patient) {
      api.get(`/referOK/${this.$route.params.id}`).then((response) => {
        if (response.data.length > 0) {
          this.disabledEndConfirmed = true;
        }
      });
    },
    Go() {
      this.$router.replace({ name: 'admin.list.patient' });
    },
  },
  created() {
    if (this.$route.params.id !== undefined) {
      this.IsReferConfirmed(this.$route.params.id);
      this.patient_id = this.$route.params.id;
      api.get(`/refer/${this.$route.params.id}`).then((response) => {
        response.data.forEach((element, index) => {
          if (index == 0) {
            this.tab = element.referal_type;
          }

          if (element.referal_type == 'glucose') {
            this.bgRefer = element;
            this.BGraisonNotRefered =
              element.raison_not_refered != null
                ? element.raison_not_refered.split(',')
                : null;
            this.BGraisonNotIntends =
              element.reason_if_no_attend != null
                ? element.reason_if_no_attend.split(',')
                : null;
          }
          if (element.referal_type == 'bloodPressure') {
            this.bpLevel = element.bp_level;
            if (this.bpLevel <= 2) {
              this.bpRefer = element;
              this.BPraisonNotRefered =
                element.raison_not_refered != null
                  ? element.raison_not_refered.split(',')
                  : null;
              this.BPraisonNotIntends =
                element.reason_if_no_attend != null
                  ? element.reason_if_no_attend.split(',')
                  : null;
            } else {
              this.bpReferLevel3 = element;
              const specialist = new Object();
              specialist.name = element.specialist_name;
              specialist.phone = element.specialist_number;
              this.bpReferLevel3.specialist_name = specialist;
            }
          }
          if (element.referal_type == 'covid') {
            this.covidRefer = element;
            this.CovRaisonNotRefered =
              element.raison_not_refered != null
                ? element.raison_not_refered.split(',')
                : null;
            this.CovRaisonNotIntends =
              element.reason_if_no_attend != null
                ? element.reason_if_no_attend.split(',')
                : null;
          }
          if (element.referal_type == 'malaria') {
            this.isChild();
            this.malariaRefer = element;
          }
          if (element.referal_type == 'malnutrition') {
            this.malnutritionRefer = element;
            this.MalnRaisonNotRefered =
              element.raison_not_refered != null
                ? element.raison_not_refered.split(',')
                : null;
            this.MalnRaisonNotIntends =
              element.reason_if_no_attend != null
                ? element.reason_if_no_attend.split(',')
                : null;
          }
        });
        this.patientReferalTabs = response.data;
        this.confirmRefer();
      });
    }
  },
  validations() {
    return {
      bgRefer: {
        counselling_completed: { required },
        chc_refered: { required },
        raison_not_refered: { required },
        patient_intends_to_refer: { required },
        reason_if_no_attend: { required },
      },
      covidRefer: {
        counselling_completed: { required },
        chc_refered: { required },
        raison_not_refered: { required },
        patient_intends_to_refer: { required },
        reason_if_no_attend: { required },
      },
      malnutritionRefer: {
        counselling_completed: { required },
        chc_refered: { required },
        raison_not_refered: { required },
        patient_intends_to_refer: { required },
        reason_if_no_attend: { required },
      },
      bpRefer: {
        counselling_completed: { required },
        chc_refered: { required },
        raison_not_refered: { required },
        patient_intends_to_refer: { required },
        reason_if_no_attend: { required },
      },
      bpReferLevel3: {
        specialist_name: { required },
        specialist_number: { required },
        patient_call_specialist: { required },
      },
      malariaRefer: {
        medication_recomdt: { required },
        posology: { required },
        received_medic: { required },
        reason_not_received_medic: { required },
      },
    };
  },
  setup() {
    return {
      inception: ref(false),
      secondDialog: ref(false),
      BGraisonNotRefered: ref(null),
      BPraisonNotRefered: ref(null),
      MalnRaisonNotRefered: ref(null),
      MalarRaisonNotRefered: ref(null),
      CovRaisonNotRefered: ref(null),

      BGraisonNotIntends: ref(null),
      BPraisonNotIntends: ref(null),
      MalnRaisonNotIntends: ref(null),
      MalarRaisonNotIntends: ref(null),
      CovRaisonNotIntends: ref(null),
      v$: useVuelidate(),
      splitterModel: ref(20),
    };
  },
};
</script>

<style>
.msg {
  text-align: center;
}
</style>
