import type { Employee } from "./userType";

export type Payroll = {
  employee_id: number;
  month: number;
  year: number;
  base_salary: number;
  total_allowance: number;
  overtime_pay: number;
  total_deduction: number;
  total_salary: number;
  late_pay: number;
  absent_pay: number;
};

export type PayrollPreview = {
  late_pay: number;
  absent_pay: number;
  overtime_pay: number;
  base_salary: number;
  employee: Employee[];
};

export type Allowance = {
  id: number;
  allowance_name: string;
  description: string;
  amount: number;
};

export type Deduction = {
  id: number;
  deduction_name: string;
  description: string;
  amount: number;
};
