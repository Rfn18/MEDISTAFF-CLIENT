import type { ShiftType } from "../components/schedule/ShiftPalette";
import type { Employee } from "./userType";

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
