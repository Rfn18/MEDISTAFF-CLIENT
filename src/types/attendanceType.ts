import type { ShiftType } from "../components/schedule/ShiftPalette";
import type { Employee } from "./userType";

export type StatusFilter = "all" | "present" | "late" | "checked-in";

export interface Attendance {
  id: number;
  employee_id: number;
  attendance_date: string;
  latitude: string;
  longitude: string;
  check_in_time: string;
  check_out_time: string;
  status: string;
  device_id: string;
  late_minutes: number;
  created_at: string;
  updated_at: string;
  employee: Employee;
  Shift: ShiftType;
  ShiftSchedule: [
    {
      id: number;
      shift_id: number;
      department_id: number;
      start_date: string;
      end_date: string;
      created_at: string;
      updated_at: string;
    },
  ];
}

export interface AttendanceSummary {
  employee_id: number;
  month: number;
  year: number;
  total_present: number;
  total_absent: number;
  total_late: number;
  total_off: number;
  total_sick: number;
}

export type QrToken = {
  qr_payload: string;
  device_id: string;
  longitude: number;
  latitude: number;
  user_id: number;
};

export interface LocationRecord {
  id: number;
  rs_name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  created_at?: string;
  updated_at?: string;
}

export interface FormState {
  rs_name: string;
  latitude: string;
  longitude: string;
  radius_meters: string;
}

export interface FieldError {
  rs_name?: string;
  latitude?: string;
  longitude?: string;
  radius_meters?: string;
}

export type ToastType = "success" | "error";

export const emptyForm: FormState = {
  rs_name: "",
  latitude: "",
  longitude: "",
  radius_meters: "",
};
