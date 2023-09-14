<template>
  <div class="q-pa-md">
    <q-splitter v-model="splitterModel" style="height: auto">
      <template v-slot:before>
        <q-tabs
          v-model="tab"
          indicator-color="yellow"
          vertical
          class="bg-teal text-grey-5 shadow-2"
        >
          <q-tab
            name="followUp"
            icon="phone"
            class="text-orange"
            :label="$t('Follow_up_patient')"
          />
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
          <q-tab-panel name="followUp">
            <div class="text-h4 q-mb-md">
              <p>
                {{ $t('patient.name') }} :
                <span style="font-weight: bold">{{
                  patientFollowUp.name
                }}</span>
              </p>
              <q-separator class="tw-mt-2" />
              <p>
                {{ $t('patient.phone_number') }} :
                <span style="font-weight: bold">{{
                  patientFollowUp.phone_number == 'N/A'
                    ? $t("don't have")
                    : patientFollowUp.phone_number
                }}</span>
              </p>
              <q-separator class="tw-mt-2" />
              <p>
                {{ $t('patient.town') }} :
                <span style="font-weight: bold">{{
                  patientFollowUp.town
                }}</span>
              </p>
              <q-separator class="tw-mt-2" />
              <p>
                {{ $t('patient.quartier') }} :
                <span style="font-weight: bold">{{
                  patientFollowUp.quartier
                }}</span>
              </p>
              <q-separator class="tw-mt-2" />
            </div>
            <base-select
              style="margin-bottom: 2%"
              filled
              :label="$t('patient_attended_chc')"
              :validator="v$.patient_attended_chc"
              v-model="patient_attended_chc"
              :options="Qoptions"
              :display-value="
                patient_attended_chc ? $t(`${patient_attended_chc}`) : ''
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

            <div v-show="patient_attended_chc == 'Yes'" id="followUpForm">
              <div class="row" id="bloodGlucose" v-show="showFollowUpBGForm">
                <div
                  class="col-2"
                  style="margin-right: 1.5%; margin-bottom: 2%"
                >
                  <base-select
                    readonly
                    filled
                    :label="$t('referal_type')"
                    :validator="v$.bgFollowUp.referal_type"
                    v-model="bgFollowUp.referal_type"
                    :options="Qoptions"
                    :display-value="
                      bgFollowUp.referal_type
                        ? $t(`${bgFollowUp.referal_type}`)
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
                </div>

                <div
                  class="col-4"
                  style="margin-right: 1.5%; margin-bottom: 2%"
                >
                  <base-select
                    filled
                    :label="$t('patient_receiv_care_chc')"
                    :validator="v$.bgFollowUp.patient_receiv_care_chc"
                    v-model="bgFollowUp.patient_receiv_care_chc"
                    :options="Qoptions"
                    :display-value="
                      bgFollowUp.patient_receiv_care_chc
                        ? $t(`${bgFollowUp.patient_receiv_care_chc}`)
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
                </div>

                <div class="col-4">
                  <base-select
                    filled
                    new-value-mode="add"
                    use-input
                    :label="$t('why_didnot_receiv_care_chc')"
                    :validator="v$.bgFollowUp.why_didnot_receiv_care_chc"
                    v-model="bgFollowUp.why_didnot_receiv_care_chc"
                    :options="raisonDidNotReceivedCare"
                    v-show="bgFollowUp.patient_receiv_care_chc == 'No'"
                    :display-value="
                      bgFollowUp.why_didnot_receiv_care_chc
                        ? $t(`${bgFollowUp.why_didnot_receiv_care_chc}`)
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
                </div>

                <div class="col-1" style="margin-left: 1%; margin-top: 1%">
                  <q-btn
                    style="margin-right: 14%; margin-top: 1%; width: 40px"
                    v-bind:disable="!showEndConfirmed"
                    color="green"
                    :label="$t('ok')"
                    :loading="loadingBG"
                    @click="savePatientBgFollowUp"
                  />
                  <q-icon
                    v-show="loadingSBG"
                    name="done"
                    color="green"
                    size="20px"
                  />
                </div>
              </div>

              <div class="row" id="bloodPressure" v-show="showFollowUpBPForm">
                <div
                  class="col-2"
                  style="margin-right: 1.5%; margin-bottom: 2%"
                >
                  <base-select
                    readonly
                    filled
                    :label="$t('referal_type')"
                    :validator="v$.bpFollowUp.referal_type"
                    v-model="bpFollowUp.referal_type"
                    :options="Qoptions"
                    :display-value="
                      bpFollowUp.referal_type
                        ? $t(`${bpFollowUp.referal_type}`)
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
                </div>

                <div
                  class="col-4"
                  style="margin-right: 1.5%; margin-bottom: 2%"
                >
                  <base-select
                    filled
                    :label="$t('patient_receiv_care_chc')"
                    :validator="v$.bpFollowUp.patient_receiv_care_chc"
                    v-model="bpFollowUp.patient_receiv_care_chc"
                    :options="Qoptions"
                    :display-value="
                      bpFollowUp.patient_receiv_care_chc
                        ? $t(`${bpFollowUp.patient_receiv_care_chc}`)
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
                </div>

                <div class="col-4">
                  <base-select
                    filled
                    new-value-mode="add"
                    use-input
                    :label="$t('why_didnot_receiv_care_chc')"
                    :validator="v$.bpFollowUp.why_didnot_receiv_care_chc"
                    v-model="bpFollowUp.why_didnot_receiv_care_chc"
                    :options="raisonDidNotReceivedCare"
                    v-show="bpFollowUp.patient_receiv_care_chc == 'No'"
                    :display-value="
                      bpFollowUp.why_didnot_receiv_care_chc
                        ? $t(`${bpFollowUp.why_didnot_receiv_care_chc}`)
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
                </div>

                <div class="col-1" style="margin-left: 1%; margin-top: 1%">
                  <q-btn
                    style="margin-right: 14%; margin-top: 1%; width: 40px"
                    v-bind:disable="!showEndConfirmed"
                    color="green"
                    :label="$t('ok')"
                    :loading="loadingBP"
                    @click="savePatientBPFollowUp"
                  />
                  <q-icon
                    v-show="loadingSBP"
                    name="done"
                    color="green"
                    size="20px"
                  />
                </div>
              </div>

              <div class="row" id="Covid" v-show="showFollowUpCovForm">
                <div
                  class="col-2"
                  style="margin-right: 1.5%; margin-bottom: 2%"
                >
                  <base-select
                    readonly
                    filled
                    :label="$t('referal_type')"
                    :validator="v$.covidFollowUp.referal_type"
                    v-model="covidFollowUp.referal_type"
                    :options="Qoptions"
                    :display-value="
                      covidFollowUp.referal_type
                        ? $t(`${covidFollowUp.referal_type}`)
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
                </div>

                <div
                  class="col-4"
                  style="margin-right: 1.5%; margin-bottom: 2%"
                >
                  <base-select
                    filled
                    :label="$t('patient_receiv_care_chc')"
                    :validator="v$.covidFollowUp.patient_receiv_care_chc"
                    v-model="covidFollowUp.patient_receiv_care_chc"
                    :options="Qoptions"
                    :display-value="
                      covidFollowUp.patient_receiv_care_chc
                        ? $t(`${covidFollowUp.patient_receiv_care_chc}`)
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
                </div>

                <div class="col-4">
                  <base-select
                    filled
                    new-value-mode="add"
                    use-input
                    :label="$t('why_didnot_receiv_care_chc')"
                    :validator="v$.covidFollowUp.why_didnot_receiv_care_chc"
                    v-model="covidFollowUp.why_didnot_receiv_care_chc"
                    :options="raisonDidNotReceivedCare"
                    v-show="covidFollowUp.patient_receiv_care_chc == 'No'"
                    :display-value="
                      covidFollowUp.why_didnot_receiv_care_chc
                        ? $t(`${covidFollowUp.why_didnot_receiv_care_chc}`)
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
                </div>

                <div class="col-1" style="margin-left: 1%; margin-top: 1%">
                  <q-btn
                    style="margin-right: 14%; margin-top: 1%; width: 40px"
                    v-bind:disable="!showEndConfirmed"
                    color="green"
                    :label="$t('ok')"
                    :loading="loadingBP"
                    @click="savePatientCovFollowUp"
                  />
                  <q-icon
                    v-show="loadingSCov"
                    name="done"
                    color="green"
                    size="20px"
                  />
                </div>
              </div>

              <div class="row" id="malaria" v-show="showFollowUpMalaForm">
                <div
                  class="col-2"
                  style="margin-right: 1.5%; margin-bottom: 2%"
                >
                  <base-select
                    readonly
                    filled
                    :label="$t('referal_type')"
                    :validator="v$.malariaFollowUp.referal_type"
                    v-model="malariaFollowUp.referal_type"
                    :options="Qoptions"
                    :display-value="
                      malariaFollowUp.referal_type
                        ? $t(`${malariaFollowUp.referal_type}`)
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
                </div>

                <div
                  class="col-4"
                  style="margin-right: 1.5%; margin-bottom: 2%"
                >
                  <base-select
                    filled
                    :label="$t('patient_receiv_care_chc')"
                    :validator="v$.malariaFollowUp.patient_receiv_care_chc"
                    v-model="malariaFollowUp.patient_receiv_care_chc"
                    :options="Qoptions"
                    :display-value="
                      malariaFollowUp.patient_receiv_care_chc
                        ? $t(`${malariaFollowUp.patient_receiv_care_chc}`)
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
                </div>

                <div class="col-4">
                  <base-select
                    filled
                    new-value-mode="add"
                    use-input
                    :label="$t('why_didnot_receiv_care_chc')"
                    :validator="v$.malariaFollowUp.why_didnot_receiv_care_chc"
                    v-model="malariaFollowUp.why_didnot_receiv_care_chc"
                    :options="raisonDidNotReceivedCare"
                    v-show="malariaFollowUp.patient_receiv_care_chc == 'No'"
                    :display-value="
                      malariaFollowUp.why_didnot_receiv_care_chc
                        ? $t(`${malariaFollowUp.why_didnot_receiv_care_chc}`)
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
                </div>

                <div class="col-1" style="margin-left: 1%; margin-top: 1%">
                  <q-btn
                    style="margin-right: 14%; margin-top: 1%; width: 40px"
                    v-bind:disable="!showEndConfirmed"
                    color="green"
                    :label="$t('ok')"
                    :loading="loadingMala"
                    @click="savePatientMalariaFollowUp"
                  />
                  <q-icon
                    v-show="loadingSMala"
                    name="done"
                    color="green"
                    size="20px"
                  />
                </div>
              </div>

              <div class="row" id="malnutrition" v-show="showFollowUpMalnForm">
                <div
                  class="col-2"
                  style="margin-right: 1.5%; margin-bottom: 2%"
                >
                  <base-select
                    readonly
                    filled
                    :label="$t('referal_type')"
                    :validator="v$.malnutritionFollowUp.referal_type"
                    v-model="malnutritionFollowUp.referal_type"
                    :options="Qoptions"
                    :display-value="
                      malnutritionFollowUp.referal_type
                        ? $t(`${malnutritionFollowUp.referal_type}`)
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
                </div>

                <div
                  class="col-4"
                  style="margin-right: 1.5%; margin-bottom: 2%"
                >
                  <base-select
                    filled
                    :label="$t('patient_receiv_care_chc')"
                    :validator="v$.malnutritionFollowUp.patient_receiv_care_chc"
                    v-model="malnutritionFollowUp.patient_receiv_care_chc"
                    :options="Qoptions"
                    :display-value="
                      malnutritionFollowUp.patient_receiv_care_chc
                        ? $t(`${malnutritionFollowUp.patient_receiv_care_chc}`)
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
                </div>

                <div class="col-4">
                  <base-select
                    filled
                    new-value-mode="add"
                    use-input
                    :label="$t('why_didnot_receiv_care_chc')"
                    :validator="
                      v$.malnutritionFollowUp.why_didnot_receiv_care_chc
                    "
                    v-model="malnutritionFollowUp.why_didnot_receiv_care_chc"
                    :options="raisonDidNotReceivedCare"
                    v-show="
                      malnutritionFollowUp.patient_receiv_care_chc == 'No'
                    "
                    :display-value="
                      malnutritionFollowUp.why_didnot_receiv_care_chc
                        ? $t(
                            `${malnutritionFollowUp.why_didnot_receiv_care_chc}`
                          )
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
                </div>

                <div class="col-1" style="margin-left: 1%; margin-top: 1%">
                  <q-btn
                    style="margin-right: 14%; margin-top: 1%; width: 40px"
                    v-bind:disable="!showEndConfirmed"
                    color="green"
                    :label="$t('ok')"
                    :loading="loadingMaln"
                    @click="savePatientMalnFollowUp"
                  />
                  <q-icon
                    v-show="loadingSMaln"
                    name="done"
                    color="green"
                    size="20px"
                  />
                </div>
              </div>
            </div>

            <div class="row" v-show="patient_attended_chc == 'No'">
              <div class="col-10">
                <base-select
                  filled
                  ref="smartAdd"
                  new-value-mode="add"
                  use-input
                  :label="$t('why_did_not_attd')"
                  :validator="v$.why_did_not_attd"
                  v-model="why_did_not_attd"
                  :options="raisonDidNotAttendCHCForCare"
                  :display-value="
                    why_did_not_attd ? $t(`${why_did_not_attd}`) : ''
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
              </div>

              <div class="col-2">
                <q-btn
                  v-bind:disable="!showEndConfirmed"
                  style="margin-top: 8%; margin-left: 48%"
                  color="green"
                  :label="$t('ok')"
                  :loading="loadingNotGo"
                  @click="savePatientNotGo"
                />
                <q-icon
                  v-show="loadingSNotGo"
                  name="done"
                  color="green"
                  size="20px"
                />
              </div>
            </div>
          </q-tab-panel>

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
            </div>

            <div class="text-h6 tw-mt-3 msg" v-if="msgShow">
              {{ $t('success_refer_message') }}
            </div>
          </q-tab-panel>

          <q-tab-panel name="malnutrition">
            <div class="text-h4 q-mb-md">
              {{ $t('malnutrition') }}

              <div class="tw-mb-3 float-right">
                <q-btn
                  color="green"
                  icon="visibility"
                  @click="showData('malnutrition')"
                />
              </div>
            </div>

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
            </div>

            <div class="text-h6 tw-mt-3 msg" v-if="msgShow">
              {{ $t('success_refer_message') }}
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <q-btn
          v-show="showEndConfirmed"
          class="tw-mt-3 float-right"
          color="green"
          :label="$t('Confirmed_Follow')"
          :loading="loadingBtnConfirmed"
          v-bind:disable="disabledEndConfirmed"
          @click="confirmCloseFollowing"
        />
      </template>
    </q-splitter>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="inception" no-backdrop-dismiss>
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t('confirm_patient_follow') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ $t('are_you_sure_confirm_follow_patient') }}
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('submit_follow')" @click="OKFollowed" />
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
          <div class="text-h6">{{ $t('patient_follow_success') }}</div>
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
          {{ $t('patient_followed_submit_msg') }}
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup @click="Go" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="conditionData.show"
      no-backdrop-dismiss
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-negative text-white">
        <q-card-section>
          <div class="text-h6">{{ $t(`${conditionData.title}`) }}</div>
          <div v-show="conditionData.title == 'malnutrition'" class="text-5">
            <p>
              {{ $t('arm_circumference') }} :
              {{ malnutritionData.arm_circumference }}
            </p>
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

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup @click="close" />
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
import { Notify, useQuasar } from 'quasar';
import moment from 'moment';

export default {
  data() {
    return {
      patient_attended_chc: '',
      why_did_not_attd: '',
      disabledEnd: false,
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

      bgFollowUp: {},
      covidFollowUp: {},
      malariaFollowUp: {},
      malnutritionFollowUp: {},
      bpFollowUp: {},
      followUpData: {},

      tab: ref(null),
      bpReferLevel3: {},
      bpLevel: 0,
      isChildMedication: false,
      msgShow: false,
      loadingNotGo: false,
      loadingBG: false,
      loadingSBG: false,
      loadingBP: false,
      loadingSBP: false,
      loadingCov: false,
      loadingSCov: false,
      loadingSNotGo: false,
      loadingMala: false,
      loadingSMala: false,
      loadingMaln: false,
      loadingSMaln: false,
      loadingBtn: false,
      patientReferalTabs: [],
      confirmReferal: {},
      Qoptions: ['Yes', 'No'],
      raisonDidNotReceivedCare: [
        'Raison 1',
        'Raison 2',
        'Raison 3',
        'Raison 4',
      ],
      raisonDidNotAttendCHCForCare: [
        'Raison 1',
        'Raison 2',
        'Raison 3',
        'Raison 4',
      ],
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
      patientFollowUp: [],
      showFollowUpBGForm: false,
      showFollowUpBPForm: false,
      showFollowUpCovForm: false,
      showFollowUpMalaForm: false,
      showFollowUpMalnForm: false,

      loadingBtnConfirmed: false,
      disabledEndConfirmed: false,
      showEndConfirmed: true,
      conditionData: {},
      glucoseData: {},
      bloodPresureData: {},
      malnutritionData: {},
    };
  },
  methods: {
    showData(condition) {
      this.conditionData.show = true;
      this.conditionData.title = condition;
      console.log(this.conditionData);
    },
    getDataCondition() {
      api.get(`/conditions/${this.$route.params.id}`).then((response) => {
        const patientVitalsData = response.data.data[0].vitals;
        console.log(response.data.data[0]);
        patientVitalsData.forEach((element, index) => {
          if (element.vital_type == 'glucose') {
            this.glucoseData = element;
          }
          if (element.vital_type == 'bloodPressure') {
            this.bloodPresureData = element;
          }
          if (element.vital_type == 'malnutrition') {
            this.malnutritionData = element;
            console.log('Mal', this.malnutritionData);
          }
        });
      });
    },
    confirmCloseFollowing() {
      this.inception = true;
    },
    OKFollowed() {
      this.loadingBtnConfirmed = true;
      api
        .post('/confirmfollow', { patient_id: this.patient_id })
        .then((response) => {
          this.secondDialog = true;
          this.inception = false;
          this.loadingBtnConfirmed = false;
          this.patient_uid = response.data.data.patient_uid;
          this.name = response.data.data.name;
          this.date_of_birth = response.data.data.date_of_birth;
          this.phone_number = response.data.data.phone_number;
          this.disabledEndConfirmed = true;
        });
    },
    Go() {
      this.$router.replace({ name: 'admin.list.followup' });
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
    changeSelectedTab(type) {
      this.msgShow = false;
    },
    getAllPatientFollowData() {
      api.get(`/follow/${this.$route.params.id}`).then((response) => {
        this.canWeCloseFollowUp(response.data.data[1]);
        this.showConfirmBtn(response.data.data[2]);
        response.data.data[0].forEach((element, index) => {
          this.loading(element.referal_type);
          if (element.referal_type == 'glucose') {
            this.patient_attended_chc = element.patient_attended_chc;
            this.bgFollowUp = element;
          } else if (element.referal_type == 'bloodPressure') {
            this.patient_attended_chc = element.patient_attended_chc;
            this.bpFollowUp = element;
          } else if (element.referal_type == 'covid') {
            this.patient_attended_chc = element.patient_attended_chc;
            this.covidFollowUp = element;
          } else if (element.referal_type == 'malnutrition') {
            this.patient_attended_chc = element.patient_attended_chc;
            this.malnutritionFollowUp = element;
          } else if (element.referal_type == 'malaria') {
            this.patient_attended_chc = element.patient_attended_chc;
            this.malariaFollowUp = element;
          } else {
            this.patient_attended_chc = element.patient_attended_chc;
            this.why_did_not_attd = element.why_did_not_attd;
            this.followUpData = element;
          }
        });
      });
    },
    getFollowUpPatient() {
      api.get('/follows').then((response) => {
        response.data.data.forEach((element, index) => {
          if (element.id == this.$route.params.id) {
            this.patientFollowUp = element;
          }
        });
      });
    },

    canWeCloseFollowUp(status) {
      if (status == 1) {
        this.disabledEndConfirmed = false;
      } else {
        this.disabledEndConfirmed = true;
      }
    },

    showConfirmBtn(status) {
      if (status == 1) {
        this.showEndConfirmed = false;
      } else {
        this.showEndConfirmed = true;
      }
    },

    saveFollowUpData(data) {
      if (this.$route.params.id !== undefined)
        data.patient_id = this.$route.params.id;
      api
        .post('follow', data)
        .then((response) => {
          if (
            response.data.status !== undefined &&
            response.data.status === 'success'
          ) {
            this.canWeCloseFollowUp(response.data.data[1]);
            // this.showConfirmBtn(response.data.data[2]);
            if (response.data.data[0].referal_type == 'glucose') {
              this.bgFollowUp = response.data.data[0];
            } else if (response.data.data[0].referal_type == 'bloodPressure') {
              this.bpFollowUp = response.data.data[0];
            } else if (response.data.data[0].referal_type == 'covid') {
              this.covidFollowUp = response.data.data[0];
            } else if (response.data.data[0].referal_type == 'malnutrition') {
              this.malnutritionFollowUp = response.data.data[0];
            } else if (response.data.data[0].referal_type == 'malaria') {
              this.malariaFollowUp = response.data.data[0];
            } else {
              this.followUpData = response.data.data[0];
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(data);
    },

    savePatientBgFollowUp() {
      this.bgFollowUp.patient_attended_chc = this.patient_attended_chc;
      this.loadingBG = true;
      this.unLoading('glucose');
      if (this.patient_attended_chc == 'Yes') {
        if (
          this.bgFollowUp.patient_receiv_care_chc != undefined &&
          this.v$.bgFollowUp.patient_receiv_care_chc.$validate()
        ) {
          if (this.bgFollowUp.patient_receiv_care_chc == 'No') {
            if (
              this.bgFollowUp.why_didnot_receiv_care_chc != undefined &&
              this.v$.bgFollowUp.why_didnot_receiv_care_chc.$validate()
            ) {
              this.saveFollowUpData(this.bgFollowUp);
              this.loadingBG = false;
              this.loading('glucose');
            } else {
              this.showNotif('fields_required');
            }
          } else {
            this.saveFollowUpData(this.bgFollowUp);
            this.loadingBG = false;
            this.loading('glucose');
          }
        } else {
          this.showNotif('fields_required');
        }
      } else {
        if (this.v$.why_did_not_attd.$validate()) {
          this.bgFollowUp.why_did_not_attd = this.why_did_not_attd;
          this.saveFollowUpData(this.bgFollowUp);
          this.loadingBG = false;
          this.loading('glucose');
        }
      }
    },
    savePatientBPFollowUp() {
      this.bpFollowUp.patient_attended_chc = this.patient_attended_chc;
      this.loadingBP = true;
      this.unLoading('bloodPressure');
      if (this.patient_attended_chc == 'Yes') {
        if (
          this.bpFollowUp.patient_receiv_care_chc != undefined &&
          this.v$.bpFollowUp.patient_receiv_care_chc.$validate()
        ) {
          if (this.bpFollowUp.patient_receiv_care_chc == 'No') {
            if (
              this.bpFollowUp.why_didnot_receiv_care_chc != undefined &&
              this.v$.bpFollowUp.why_didnot_receiv_care_chc.$validate()
            ) {
              this.saveFollowUpData(this.bpFollowUp);
              this.loadingBP = false;
              this.loading('bloodPressure');
            } else {
              this.showNotif('fields_required');
            }
          } else {
            this.saveFollowUpData(this.bpFollowUp);
            this.loadingBP = false;
            this.loading('bloodPressure');
          }
        } else {
          this.showNotif('fields_required');
        }
      } else {
        if (this.v$.why_did_not_attd.$validate()) {
          this.bpFollowUp.why_did_not_attd = this.why_did_not_attd;
          this.saveFollowUpData(this.bpFollowUp);
          this.loadingBP = false;
          this.loading('bloodPressure');
        }
      }
    },
    savePatientCovFollowUp() {
      this.covidFollowUp.patient_attended_chc = this.patient_attended_chc;
      this.loadingCov = true;
      this.unLoading('covid');
      if (this.patient_attended_chc == 'Yes') {
        if (
          this.covidFollowUp.patient_receiv_care_chc != undefined &&
          this.v$.covidFollowUp.patient_receiv_care_chc.$validate()
        ) {
          if (this.covidFollowUp.patient_receiv_care_chc == 'No') {
            if (
              this.covidFollowUp.why_didnot_receiv_care_chc != undefined &&
              this.v$.covidFollowUp.why_didnot_receiv_care_chc.$validate()
            ) {
              this.saveFollowUpData(this.covidFollowUp);
              this.loadingCov = false;
              this.loading('covid');
            } else {
              this.showNotif('fields_required');
            }
          } else {
            this.saveFollowUpData(this.covidFollowUp);
            this.loadingCov = false;
            this.loading('covid');
          }
        } else {
          this.showNotif('fields_required');
        }
      } else {
        if (this.v$.why_did_not_attd.$validate()) {
          this.covidFollowUp.why_did_not_attd = this.why_did_not_attd;
          this.saveFollowUpData(this.covidFollowUp);
          this.loadingCov = false;
          this.loading('covid');
        }
      }
    },
    // savePatientCovFollowUp() {
    //   this.covidFollowUp.patient_attended_chc = this.patient_attended_chc;
    //   this.loadingCov = true;
    //   this.unLoading('covid');
    //   if (this.patient_attended_chc == 'Yes') {
    //     if (
    //       this.covidFollowUp.patient_receiv_care_chc != undefined &&
    //       this.v$.covidFollowUp.patient_receiv_care_chc.$validate()
    //     ) {
    //       if (this.covidFollowUp.patient_receiv_care_chc == 'No') {
    //         if (
    //           this.covidFollowUp.why_didnot_receiv_care_chc != undefined &&
    //           this.v$.covidFollowUp.why_didnot_receiv_care_chc.$validate()
    //         ) {
    //           this.saveFollowUpData(this.covidFollowUp);
    //           this.loadingCov = false;
    //           this.loading('covid');
    //         } else {
    //           this.showNotif('fields_required');
    //         }
    //       } else {
    //         this.saveFollowUpData(this.covidFollowUp);
    //         this.loadingCov = false;
    //         this.loading('covid');
    //       }
    //     } else {
    //       this.showNotif('fields_required');
    //     }
    //   } else {
    //     if (this.v$.why_did_not_attd.$validate()) {
    //       this.covidFollowUp.why_did_not_attd = this.why_did_not_attd;
    //       this.saveFollowUpData(this.covidFollowUp);
    //       this.loadingCov = false;
    //       this.loading('covid');
    //     }
    //   }
    // },

    savePatientMalnFollowUp() {
      this.malnutritionFollowUp.patient_attended_chc =
        this.patient_attended_chc;
      this.loadingMaln = true;
      this.unLoading('malnutrition');
      if (this.patient_attended_chc == 'Yes') {
        if (
          this.malnutritionFollowUp.patient_receiv_care_chc != undefined &&
          this.v$.malnutritionFollowUp.patient_receiv_care_chc.$validate()
        ) {
          if (this.malnutritionFollowUp.patient_receiv_care_chc == 'No') {
            if (
              this.malnutritionFollowUp.why_didnot_receiv_care_chc !=
                undefined &&
              this.v$.malnutritionFollowUp.why_didnot_receiv_care_chc.$validate()
            ) {
              this.saveFollowUpData(this.malnutritionFollowUp);
              this.loadingMaln = false;
              this.loading('malnutrition');
            } else {
              this.showNotif('fields_required');
            }
          } else {
            this.saveFollowUpData(this.malnutritionFollowUp);
            this.loadingMaln = false;
            this.loading('malnutrition');
          }
        } else {
          this.showNotif('fields_required');
        }
      } else {
        if (this.v$.why_did_not_attd.$validate()) {
          this.malnutritionFollowUp.why_did_not_attd = this.why_did_not_attd;
          this.saveFollowUpData(this.malnutritionFollowUp);
          this.loadingMaln = false;
          this.loading('malnutrition');
        }
      }
    },

    savePatientMalariaFollowUp() {
      this.malariaFollowUp.patient_attended_chc = this.patient_attended_chc;
      this.loadingMala = true;
      this.unLoading('malaria');
      if (this.patient_attended_chc == 'Yes') {
        if (
          this.malariaFollowUp.patient_receiv_care_chc != undefined &&
          this.v$.malariaFollowUp.patient_receiv_care_chc.$validate()
        ) {
          if (this.malariaFollowUp.patient_receiv_care_chc == 'No') {
            if (
              this.malariaFollowUp.why_didnot_receiv_care_chc != undefined &&
              this.v$.malariaFollowUp.why_didnot_receiv_care_chc.$validate()
            ) {
              this.saveFollowUpData(this.malariaFollowUp);
              this.loadingMala = false;
              this.loading('malaria');
            } else {
              this.showNotif('fields_required');
            }
          } else {
            this.saveFollowUpData(this.malariaFollowUp);
            this.loadingMala = false;
            this.loading('malaria');
          }
        } else {
          this.showNotif('fields_required');
        }
      } else {
        if (this.v$.why_did_not_attd.$validate()) {
          this.malariaFollowUp.why_did_not_attd = this.why_did_not_attd;
          this.saveFollowUpData(this.malariaFollowUp);
          this.loadingMala = false;
          this.loading('malaria');
        }
      }
    },

    savePatientNotGo() {
      this.loadingNotGo = true;
      this.unLoading('not_attd_chc');
      if (this.patient_attended_chc == 'No') {
        if (
          this.why_did_not_attd != undefined &&
          this.why_did_not_attd != '' &&
          this.why_did_not_attd != null &&
          this.v$.why_did_not_attd.$validate()
        ) {
          this.followUpData.patient_attended_chc = this.patient_attended_chc;
          this.followUpData.why_did_not_attd = this.why_did_not_attd;
          this.saveFollowUpData(this.followUpData);
          this.loadingNotGo = false;
          this.loading('not_attd_chc');
        } else {
          this.showNotif('fields_required');
          this.disabledAllLoaders();
        }
      }
    },

    savePatientFollowUp() {
      console.log('bobo', this.v$);
    },

    disabledAllLoaders() {
      setTimeout(() => {
        this.loadingBG = false;
        this.loadingBP = false;
        this.loadingCov = false;
        this.loadingMala = false;
        this.loadingMaln = false;
        this.loadingNotGo = false;
      }, 3000);
    },

    loading(referal_type) {
      if (referal_type == 'glucose') {
        this.loadingSBG = true;
      } else if (referal_type == 'bloodPressure') {
        this.loadingSBP = true;
      } else if (referal_type == 'covid') {
        this.loadingSCov = true;
      } else if (referal_type == 'malnutrition') {
        this.loadingSMaln = true;
      } else if (referal_type == 'malaria') {
        this.loadingSMala = true;
      } else {
        this.loadingSNotGo = true;
      }
    },
    unLoading(referal_type) {
      if (referal_type == 'glucose') {
        this.loadingSBG = false;
      } else if (referal_type == 'bloodPressure') {
        this.loadingSBP = false;
      } else if (referal_type == 'covid') {
        this.loadingSCov = false;
      } else if (referal_type == 'malnutrition') {
        this.loadingSMaln = false;
      } else if (referal_type == 'malaria') {
        this.loadingSMala = false;
      } else {
        this.loadingSNotGo = false;
      }
    },
  },
  created() {
    this.getFollowUpPatient();
    this.getAllPatientFollowData();
    this.getDataCondition();
    if (this.$route.params.id !== undefined) {
      this.patient_id = this.$route.params.id;
      api.get(`/refer/${this.$route.params.id}`).then((response) => {
        this.tab = 'followUp';
        response.data.forEach((element, index) => {
          if (element.referal_type == 'glucose') {
            this.showFollowUpBGForm = true;
            this.bgRefer = element;
            this.bgFollowUp.referal_type = element.referal_type;
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
            this.bpFollowUp.referal_type = element.referal_type;
            this.showFollowUpBPForm = true;
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
            this.covidFollowUp.referal_type = element.referal_type;
            this.showFollowUpCovForm = true;
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
            this.malariaFollowUp.referal_type = element.referal_type;
            this.showFollowUpMalaForm = true;
            this.isChild();
            this.malariaRefer = element;
          }
          if (element.referal_type == 'malnutrition') {
            this.malnutritionFollowUp.referal_type = element.referal_type;
            this.showFollowUpMalnForm = true;
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
      });
    }
  },
  validations() {
    return {
      patient_attended_chc: { required },
      why_did_not_attd: { required },
      bgFollowUp: {
        patient_receiv_care_chc: { required },
        referal_type: { required },
        why_didnot_receiv_care_chc: { required },
      },
      covidFollowUp: {
        patient_receiv_care_chc: { required },
        referal_type: { required },
        why_didnot_receiv_care_chc: { required },
      },
      malnutritionFollowUp: {
        patient_receiv_care_chc: { required },
        referal_type: { required },
        why_didnot_receiv_care_chc: { required },
      },
      bpFollowUp: {
        patient_receiv_care_chc: { required },
        referal_type: { required },
        why_didnot_receiv_care_chc: { required },
      },

      malariaFollowUp: {
        patient_receiv_care_chc: { required },
        referal_type: { required },
        why_didnot_receiv_care_chc: { required },
      },

      bpReferLevel3: {
        specialist_name: { required },
        specialist_number: { required },
        patient_call_specialist: { required },
      },

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
    const $q = useQuasar();
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
      showNotif(msg) {
        $q.notify({
          message: msg,
          icon: 'report_problem',
          color: 'negative',
        });
      },
    };
  },
};
</script>

<style>
.msg {
  text-align: center;
}
</style>
