export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface MenuItem {
  icon?: string;
  label: string;
  to?: string | Record<string, unknown>;
  children?: MenuItem[];
}

export interface Patient {
  id?: number;
  name: string;
  gender: string;
  pregnant?: string;
  do_you_know_date_of_birth?: boolean;
  date_of_birth: Date;
  date_of_registration: Date;
  photo: string;
  town: string;
  quartier: string;
  sector: string;
  do_you_have_access_to_telephone: boolean;
  phone_number: string;
  phone_type: string;
  level_of_education: string;
  profession: string;
  daily_expenditure: string;
  matrimonial_status: string;
  access_to_drinking_water: string;
  access_to_toilet: string;
  rubbish_collection_services: string;
  time_to_nearest_health_facility: string;
  hmd_visits_in_last_year: string;
  how_many_doctors_visits_in_last_12_months: string;
  would_you_be_willing_to_subscribe: string;
  would_you_like_medical_card: string;
  testing_services_and_medical_for_free: string;
}

export interface Temperature {
  created_at?: Date;
  date_of_checking?: Date;
  id?: number;
  is_active?: boolean;
  patient_id?: number;
  temperature?: string;
  time_of_checking?: string;
  updated_at?: Date;
  vital_flag?: string;
  vital_type?: string;
}
export interface Oxygen {
  created_at?: Date;
  date_of_checking?: Date;
  id?: number;
  is_active?: boolean;
  patient_id?: number;
  oxygen_saturation: string;
  time_of_checking?: string;
  updated_at?: Date;
  vital_flag?: string;
  vital_type?: string;
}
export interface Symptom {
  patient_id?: number;
  chills: string;
  nausea_and_vomiting: string;
  headaches: string;
  muscle_or_join_pain: string;
  sore_throa: string;
  caugh: string;
  fatigue: string;
  loss_of_sense_of_smell: string;
  difficulty_breathing: string;
  diarrhoea: string;
}
export interface BloodPresure {
  created_at?: Date;
  date_of_checking?: Date;
  id?: number;
  is_active?: boolean;
  patient_id?: number;
  bp_sys_right: string;
  bp_dias_right: string;
  bp_sys_left: string;
  bp_dias_left: string;
  time_of_checking?: string;
  updated_at?: Date;
  vital_flag?: string;
  vital_type?: string;
}
export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
export interface UserStoreInitPayload {
  users: User[];
}
