
import { CheckCircle2, AlertCircle, Users } from "lucide-react";
import type { Department } from "../../types/userType";

type DepartmentStatusGridProps = {
  departments: Department[];
  employeeData: any[];
  hasScheduleFn: (deptId: number) => boolean;
  onGenerateClick: (deptId: number) => void;
  onViewClick: (deptId: number) => void;
  monthLabel: string;
  yearLabel: string | number;
};

export default function DepartmentStatusGrid({
  departments,
  employeeData,
  hasScheduleFn,
  onGenerateClick,
  onViewClick,
  monthLabel,
  yearLabel
}: DepartmentStatusGridProps) {
  
  const completedCount = departments.filter((d) => hasScheduleFn(d.id)).length;
  const totalCount = departments.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <div className="bg-white rounded-xl border border-border p-5 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center bg-blue-50 rounded-full border-[6px] border-blue-100">  
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-blue-primary/20 stroke-current"
              strokeWidth="4"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-blue-primary stroke-current"
              strokeWidth="4"
              strokeDasharray={`${percentage}, 100`}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{ transition: "stroke-dasharray 1s ease-out" }}
            />
          </svg>
          <div className="relative flex flex-col items-center">
            <span className="text-xl font-bold font-mono text-blue-dark leading-none">{percentage}%</span>
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-blue-dark">Status Jadwal: {monthLabel} {yearLabel}</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Terdapat <span className="font-semibold text-blue-primary">{completedCount} dari {totalCount}</span> departemen 
            yang sudah memiliki jadwal shift pada periode ini.
          </p>
        </div>
      </div>

      {/* Grid of Departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const hasSchedule = hasScheduleFn(dept.id);
          const empCount = employeeData.filter((e) => e.department_id === dept.id).length;
          
          return (
            <div 
              key={dept.id} 
              className={`rounded-xl border p-5 transition-all hover:shadow-md
                ${hasSchedule ? "bg-white border-border" : "bg-red-50/30 border-red-100"}
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-blue-dark line-clamp-1 flex-1 pr-2" title={dept.department_name}>
                  {dept.department_name}
                </h4>
                {hasSchedule ? (
                  <div className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                    <CheckCircle2 size={12} />
                    <span>Selesai</span>
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                    <AlertCircle size={12} />
                    <span>Kosong</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                <Users size={16} className="text-blue-primary/60" />
                <span>{empCount} Karyawan</span>
              </div>
              
              <div className="mt-auto pt-4 border-t border-border/70 flex justify-end">
                {hasSchedule ? (
                  <button 
                    onClick={() => onViewClick(dept.id)}
                    className="text-sm font-semibold text-blue-primary hover:text-blue-700 hover:underline px-2 py-1"
                  >
                    Lihat Jadwal &rarr;
                  </button>
                ) : (
                  <button 
                    onClick={() => onGenerateClick(dept.id)}
                    className="text-sm font-semibold bg-blue-primary text-white hover:bg-blue-600 px-4 py-1.5 rounded-lg transition-colors"
                  >
                    Buat Jadwal
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
