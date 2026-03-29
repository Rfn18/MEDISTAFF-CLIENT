type RoleName = "HR admin" | "Staff";

export type Employee = {
  id: number;
  nip: string;
  nik: string;
  full_name: string;
  gender: string;
  birth_place: string;
  birth_date: string;
  address: string;
  phone_number: string;
  email: string;
  photo?: string;
  hire_date: string;
  employee_status: string;
  position_id: number;
  department_id: number;
  department: {
    id: number;
    department_name: string;
  };
  position: {
    id: number;
    position_name: string;
  };
};

export type User = {
  id?: number;
  name: string;
  email: string;
  password: string;
  is_active: number;
  device_id: string;
  role_id: number;
  employee_id: number;
  department_id?: number;
  last_login_at: string;
  employee: {
    id: number;
    full_name: string;
    photo?: string;
    email?: string;
    department_id?: number;
    department?: {
      id: number;
      department_name: string;
    };
    position?: {
      id: number;
      position_name: string;
    };
  };
  role: {
    id: number;
    role_name: RoleName;
  };
};

export type AuthData = {
  datas: {
    token: string;
    user: User;
  };
  message: string;
  status: string;
};

export type Position = {
  id: number;
  position_name: string;
  description: string;
  base_salary: number;
};

export type Department = {
  id: number;
  department_name: string;
  description: string;
};

export type Role = {
  id: number;
  role_name: string;
  description: string;
};

export type LeaveRequest = {
  id: number;
  employee_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  leave_type: {
    id: number;
    leave_type_name: string;
  };
  employee?: {
    id: number;
    full_name: string;
    photo?: string;
    email?: string;
    position: {
      id: number;
      position_name: string;
    };
    department: {
      id: number;
      department_name: string;
    };
  };
  approved_by: number;
  approved_at: string;
  created_at: string;
  updated_at: string;
};

export type LeaveType = {
  id: number;
  leave_type_name: string;
  description: string;
};

export type Payroll = {
  id: number;
  employee_id: number;
  month: number;
  year: number;
  base_salary?: number;
  status?: string;
  created_at?: string;
};
