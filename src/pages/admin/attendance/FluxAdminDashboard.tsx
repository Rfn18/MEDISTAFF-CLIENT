import { useState } from "react";
import { Search, ChevronDown, Filter, AlertCircle, BarChart3, ChevronRight, Activity, CalendarDays, Ghost } from "lucide-react";
import Layout from "../../../components/layouts/DashboardLayout";

// Dummy Data
const DEPARTMENTS = ["All Departments", "Engineering", "Operations", "Human Resources", "Marketing"];
const MONTHS = ["January 2023", "February 2023", "March 2023", "October 2023", "November 2023"];

const DUMMY_EMPLOYEES = [
  { id: 1, name: "Sarah Jenkins", dept: "Engineering", present: 20, late: 2, sick: 0, absent: 0, score: 92, photo: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0062FF&color=fff" },
  { id: 2, name: "Michael Chen", dept: "Operations", present: 22, late: 0, sick: 0, absent: 0, score: 100, photo: "https://ui-avatars.com/api/?name=Michael+Chen&background=0062FF&color=fff" },
  { id: 3, name: "Emily Watson", dept: "Marketing", present: 18, late: 3, sick: 1, absent: 0, score: 85, photo: "https://ui-avatars.com/api/?name=Emily+Watson&background=0062FF&color=fff" },
  { id: 4, name: "David Kim", dept: "Engineering", present: 15, late: 5, sick: 0, absent: 2, score: 65, flag: true, photo: null },
  { id: 5, name: "Lisa Wong", dept: "Human Resources", present: 21, late: 1, sick: 0, absent: 0, score: 95, photo: "https://ui-avatars.com/api/?name=Lisa+Wong&background=0062FF&color=fff" },
  { id: 6, name: "James Miller", dept: "Operations", present: 14, late: 6, sick: 0, absent: 2, score: 55, flag: true, photo: "https://ui-avatars.com/api/?name=James+Miller&background=0062FF&color=fff" },
];

export default function FluxAdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[3]);

  const filteredEmployees = DUMMY_EMPLOYEES.filter(emp => 
    (selectedDept === "All Departments" || emp.dept === selectedDept) &&
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-2 lg:px-4 text-slate-800 bg-[#F8FAFC] pb-12 animate-[fadeIn_0.3s_ease-out]">
        
        {/* Global Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sticky top-4 z-20 flex flex-col md:flex-row gap-4 items-center justify-between mt-4">
           <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 flex-1">
              
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[250px]">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-slate-400" size={18} />
                 </div>
                 <input 
                    type="text"
                    placeholder="Search employee names..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 min-h-[44px] border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF] transition-all text-sm"
                 />
              </div>

           </div>

           <div className="flex w-full md:w-auto gap-3">
              {/* Department Filter */}
              <div className="relative flex-1 sm:flex-none">
                 <select 
                   className="block w-full sm:w-[180px] pl-4 pr-10 min-h-[44px] appearance-none border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF] transition-all text-sm font-medium cursor-pointer"
                   value={selectedDept}
                   onChange={(e) => setSelectedDept(e.target.value)}
                 >
                   {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                 </select>
                 <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                    <Filter size={16} />
                 </div>
              </div>

              {/* Month Selector */}
              <div className="relative flex-1 sm:flex-none">
                 <select 
                   className="block w-full sm:w-[160px] pl-4 pr-10 min-h-[44px] appearance-none border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF] transition-all text-sm font-bold text-[#0062FF] cursor-pointer"
                   value={selectedMonth}
                   onChange={(e) => setSelectedMonth(e.target.value)}
                 >
                   {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                 </select>
                 <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#0062FF]">
                    <CalendarDays size={16} />
                 </div>
              </div>
           </div>
        </div>

        {/* Admin Insights Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Card 1: Company Attendance Avg */}
           <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow lg:col-span-1">
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                       <BarChart3 size={20} />
                    </div>
                    <h3 className="font-semibold text-slate-500 uppercase tracking-wider text-sm">Company Attendance Avg.</h3>
                 </div>
                 <p className="text-sm text-slate-400 mt-1">Based on global active employees</p>
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                 <span className="text-6xl font-black text-slate-900 tracking-tighter">91.4%</span>
                 <span className="flex items-center text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                   +2.1%
                 </span>
              </div>
           </div>

           {/* Card 2: Anomaly Flag */}
           <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow lg:col-span-2 relative overflow-hidden">
               {/* Decorative background element */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
               
               <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                     <AlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Anomaly Flag</h3>
                    <p className="text-sm text-slate-500 font-medium">Top employees with highest lateness/absence</p>
                  </div>
               </div>

               <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                  {[...DUMMY_EMPLOYEES].filter(e => e.flag).concat(DUMMY_EMPLOYEES[2]).slice(0,3).map((emp, i) => (
                      <div key={i} className="bg-white border border-red-100/50 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:border-red-200 transition-colors">
                         <div className="flex items-center gap-3">
                            <img src={emp.photo || "https://ui-avatars.com/api/?name="+emp.name+"&background=f1f5f9"} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white" />
                            <div>
                               <p className="font-bold text-sm text-slate-900 line-clamp-1">{emp.name}</p>
                               <p className="text-xs text-slate-500">{emp.dept}</p>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            {emp.late > 0 && <span className="text-xs font-semibold bg-orange-50 text-orange-600 px-2 py-1 rounded border border-orange-100">{emp.late} Late</span>}
                            {emp.absent > 0 && <span className="text-xs font-semibold bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100">{emp.absent} Absent</span>}
                         </div>
                      </div>
                  ))}
               </div>
           </div>
        </div>

        {/* Master Attendance Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                 <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                       <Activity size={20} className="text-[#0062FF]" /> Master Attendance Log
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">Showing overview across all departments</p>
                 </div>
                 <button className="text-slate-500 hover:text-[#0062FF] font-semibold text-sm transition-colors min-h-[44px] px-2 outline-none border border-transparent focus:border-[#0062FF] rounded-lg">
                    Export CSV
                 </button>
            </div>
            
            <div className="w-full overflow-x-auto min-h-[300px]">
               {filteredEmployees.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-16 text-center animate-[fadeIn_0.3s_ease-out]">
                     <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                        <Ghost size={32} />
                     </div>
                     <h3 className="text-lg font-bold text-slate-800">No records found</h3>
                     <p className="text-slate-500 mt-1 max-w-sm text-sm">We couldn't find any employees matching your current filters. Try adjusting your search query or department.</p>
                     
                     <button 
                        onClick={() => { setSearchQuery(""); setSelectedDept(DEPARTMENTS[0]); }}
                        className="mt-6 text-[#0062FF] font-semibold text-sm min-h-[44px] px-4 rounded-xl border border-[#0062FF]/20 hover:bg-[#0062FF]/5 transition-colors"
                     >
                        Clear all filters
                     </button>
                  </div>
               ) : (
                 <table className="w-full text-left text-sm text-slate-600 border-collapse min-w-[900px]">
                    <thead className="bg-[#F8FAFC]">
                       <tr>
                          <th className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] px-6 py-4 cursor-pointer hover:text-[#0062FF] transition-colors">Employee <ChevronDown size={14} className="inline opacity-50"/></th>
                          <th className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] px-6 py-4">Department</th>
                          <th className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] px-4 py-4 text-center">Present</th>
                          <th className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] px-4 py-4 text-center">Late</th>
                          <th className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] px-4 py-4 text-center">Sick/Leave</th>
                          <th className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] px-4 py-4 text-center">Absent</th>
                          <th className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] px-6 py-4 cursor-pointer hover:text-[#0062FF] transition-colors">Score <ChevronDown size={14} className="inline opacity-50"/></th>
                          <th className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {filteredEmployees.map((emp) => (
                          <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors group">
                             <td className="px-6 py-4 flex items-center gap-3">
                                <img src={emp.photo || "https://ui-avatars.com/api/?name="+emp.name+"&background=f1f5f9"} alt={emp.name} className="w-9 h-9 rounded-full object-cover" />
                                <div>
                                   <p className="font-bold text-slate-800">{emp.name}</p>
                                   <p className="text-xs text-slate-500">EMP-{String(emp.id).padStart(4, '0')}</p>
                                </div>
                             </td>
                             <td className="px-6 py-4 font-medium text-slate-600">{emp.dept}</td>
                             <td className="px-4 py-4 text-center">
                                <span className={`font-semibold ${emp.present > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>{emp.present}</span>
                             </td>
                             <td className="px-4 py-4 text-center">
                                <span className={`font-semibold ${emp.late > 0 ? 'text-orange-500' : 'text-slate-400'}`}>{emp.late}</span>
                             </td>
                             <td className="px-4 py-4 text-center">
                                <span className={`font-semibold ${emp.sick > 0 ? 'text-[#0062FF]' : 'text-slate-400'}`}>{emp.sick}</span>
                             </td>
                             <td className="px-4 py-4 text-center">
                                <span className={`font-semibold ${emp.absent > 0 ? 'text-red-500' : 'text-slate-400'}`}>{emp.absent}</span>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                   <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                      <div 
                                        className={`h-full rounded-full ${emp.score >= 90 ? 'bg-emerald-500' : emp.score >= 70 ? 'bg-orange-400' : 'bg-red-500'}`} 
                                        style={{ width: `${emp.score}%` }}
                                      ></div>
                                   </div>
                                   <span className={`text-xs font-bold w-6 ${emp.score >= 90 ? 'text-emerald-600' : emp.score >= 70 ? 'text-orange-500' : 'text-red-500'}`}>{emp.score}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <button className="inline-flex items-center justify-center gap-1 min-h-[36px] px-3 font-semibold text-sm bg-white border border-slate-200 text-slate-700 rounded-lg hover:border-[#0062FF] hover:text-[#0062FF] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20">
                                   Details <ChevronRight size={14} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
               )}
            </div>
            
            {/* Pagination Placeholder */}
            {filteredEmployees.length > 0 && (
               <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-white">
                  <span className="px-2 font-medium">Showing {filteredEmployees.length} entries for {selectedMonth}</span>
               </div>
            )}
        </div>

      </div>
    </Layout>
  );
}
