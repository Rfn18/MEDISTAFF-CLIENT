export type Payroll = {
  employee_id: number;
  month: number;
  year: number;
  base_salary: number;
  allowance: number;
  overtime_pay: number;
  deduction: number;
  total_salary: number;
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
