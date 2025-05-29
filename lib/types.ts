export type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';
export type Gender = 'male' | 'female' | 'other';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  specialization: string;
  license_number: string;
  is_available: boolean;
  profile?: Profile;
}

export interface Patient {
  id: string;
  date_of_birth: string;
  gender: Gender;
  blood_group?: string;
  contact_number?: string;
  address?: string;
  profile?: Profile;
}

export interface Staff {
  id: string;
  department: string;
  position: string;
  hire_date: string;
  profile?: Profile;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  record_date: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: string;
  target_user_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

export interface UserSummary {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_onboarded: boolean;
  created_at: string;
  department_or_specialization?: string;
  additional_info?: string;
} 