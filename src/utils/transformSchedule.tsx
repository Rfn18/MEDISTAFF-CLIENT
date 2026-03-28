export type TransformedEmployee = {
  employee_id: number;
  name: string;
  shifts: string[];
  detailIds: (number | null)[];
  shiftIds: (number | null)[];
};

export const transformSchedule = (
  data: any[],
  employees: any[],
  days: number,
): TransformedEmployee[] => {
  const result: Record<number, TransformedEmployee> = {};
  console.log(data);

  data.forEach((item, index) => {
    const employeeId = item.employee_id;
    const filteredName = employees.find(
      (employee) => employee.id === employeeId,
    )?.full_name;

    if (!result[employeeId]) {
      result[employeeId] = {
        employee_id: employeeId,
        name: filteredName ?? "Unknown",
        shifts: Array(days).fill(""),
        detailIds: Array(days).fill(null),
        shiftIds: Array(days).fill(null),
      };
    }

    console.log(result);

    const dayIndex = index % days;

    result[employeeId].detailIds[dayIndex] = item.id ?? null;
    result[employeeId].shiftIds[dayIndex] = item.shift_id ?? null;

    if (item.is_off) {
      result[employeeId].shifts[dayIndex] = "O";
    } else {
      result[employeeId].shifts[dayIndex] =
        item.shift_id === 1
          ? "P"
          : item.shift_id === 2
            ? "M"
            : item.shift_id === 3
              ? "S"
              : "";
    }
  });

  console.log(result);
  return Object.values(result);
};

export const shiftCodeToId = (
  code: string,
): { shift_id: number | null; is_off: boolean } => {
  switch (code) {
    case "P":
      return { shift_id: 1, is_off: false };
    case "M":
      return { shift_id: 2, is_off: false };
    case "S":
      return { shift_id: 3, is_off: false };
    case "O":
      return { shift_id: null, is_off: true };
    default:
      return { shift_id: null, is_off: false };
  }
};

/**
 * Extract unique months/years from schedule data
 * Returns sorted array of { month, year, label } objects
 */
export const extractAvailablePeriods = (
  scheduleData: any[],
): { month: number; year: number; label: string }[] => {
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const periods = new Map<string, { month: number; year: number }>();

  scheduleData.forEach((schedule: any) => {
    const date = new Date(schedule.start_date || schedule.created_at);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${year}-${month}`;
    if (!periods.has(key)) {
      periods.set(key, { month, year });
    }
  });

  return Array.from(periods.values())
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .map((p) => ({
      ...p,
      label: `${monthNames[p.month - 1]} ${p.year}`,
    }));
};

/**
 * Get number of days in a given month/year
 */
export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};
