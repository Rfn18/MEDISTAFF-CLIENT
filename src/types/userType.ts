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
  last_login_at: string;
  employee: {
    id: number;
    full_name: string;
  };
  role: {
    id: number;
    role_name: string;
  };
};

export type Position = {
  id: number;
  position_name: string;
  description: string;
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
