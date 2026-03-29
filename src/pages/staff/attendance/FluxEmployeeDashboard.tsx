import { Download, ChevronLeft, ChevronRight, BarChart2, CalendarDays, Clock, ShieldAlert } from "lucide-react";
import Layout from "../../../components/layouts/DashboardLayout";
import { useAuth } from "../../../context/AuthContext";

export default function FluxEmployeeDashboard() {
  const { user } = useAuth();
  const userName = user?.employee?.full_name || user?.name || "Employee";

  // Dummy State for Table
  const dummyLogs = [
    { id: 1, date: "2023-10-01", in: "07:55", out: "17:05", status: "present", duration: "09:10" },
    { id: 2, date: "2023-10-02", in: "07:58", out: "17:00", status: "present", duration: "09:02" },
    { id: 3, date: "2023-10-03", in: "08:15", out: "17:30", status: "late", duration: "09:15" },
    { id: 4, date: "2023-10-04", in: "-", out: "-", status: "sick", duration: "00:00" },
    { id: 5, date: "2023-10-05", in: "08:00", out: "17:00", status: "present", duration: "09:00" },
    { id: 6, date: "2023-10-06", in: "07:45", out: "16:45", status: "present", duration: "09:00" },
    { id: 7, date: "2023-10-09", in: "08:02", out: "17:10", status: "late", duration: "09:08" },
    { id: 8, date: "2023-10-10", in: "07:50", out: "17:00", status: "present", duration: "09:10" }
  ];

  const getStatusDot = (status: string) => {
    switch(status) {
      case 'present': return <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span className="text-emerald-700 font-medium">Present</span></div>;
      case 'late': return <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span><span className="text-orange-700 font-medium">Late</span></div>;
      case 'sick': return <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span className="text-blue-700 font-medium">Sick</span></div>;
      case 'leave': return <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#0062FF]"></span><span className="text-[#0062FF] font-medium">Leave</span></div>;
      case 'absent': return <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="text-red-700 font-medium">Absent</span></div>;
      default: return <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span><span className="text-slate-500 font-medium">Unknown</span></div>;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-2 lg:px-4 font-sans text-slate-800 bg-[#F8FAFC] pb-12 animate-[fadeIn_0.3s_ease-out]">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back, {userName}</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2 font-medium">
              <CalendarDays size={18} className="text-[#0062FF]" /> October 2023 Recap
            </p>
          </div>
          
          <button className="bg-[#0062FF] hover:bg-[#0055DD] text-white px-5 min-h-[44px] rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#0062FF]/20 transition-all font-semibold active:scale-[0.98]">
            <Download size={18} />
            Output PDF Report
          </button>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
           
           {/* Card 1 */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
             <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Working Days</span>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                   <CalendarDays size={20} className="text-slate-600" />
                </div>
             </div>
             <p className="text-3xl font-bold text-slate-900">22<span className="text-lg font-medium text-slate-500 ml-1">Days</span></p>
           </div>

           {/* Card 2 */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
             <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Attendance Rate</span>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                   <BarChart2 size={20} className="text-emerald-500" />
                </div>
             </div>
             <p className="text-3xl font-bold text-emerald-600">95%</p>
           </div>

           {/* Card 3 */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
             <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Late Arrivals</span>
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                   <Clock size={20} className="text-orange-500" />
                </div>
             </div>
             <p className="text-3xl font-bold text-orange-600">2<span className="text-lg font-medium text-orange-500/70 ml-1">Times</span></p>
           </div>

           {/* Card 4 */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
             <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Leave/Sick Days</span>
                <div className="w-10 h-10 rounded-full bg-[#0062FF]/10 flex items-center justify-center">
                   <ShieldAlert size={20} className="text-[#0062FF]" />
                </div>
             </div>
             <p className="text-3xl font-bold text-[#0062FF]">1<span className="text-lg font-medium text-[#0062FF]/70 ml-1">Day</span></p>
           </div>

        </div>

        {/* Visualisation Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold text-slate-900">Daily Working Hours</h2>
              <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full font-semibold">October 1 - 31</span>
           </div>
           
           {/* Chart Placeholder Container */}
           <div className="w-full h-64 flex items-end gap-2 sm:gap-4 relative border-b border-l border-slate-200 pl-4 pb-2">
              {/* Dummy Y-axis labels */}
              <div className="absolute left-[-24px] top-0 h-full flex flex-col justify-between text-xs text-slate-400 pb-2">
                 <span>12h</span>
                 <span>9h</span>
                 <span>6h</span>
                 <span>3h</span>
                 <span>0h</span>
              </div>
              
              {/* Horizontal Grid lines */}
              <div className="absolute inset-0 pl-4 h-full flex flex-col justify-between z-0">
                 <div className="w-full border-b border-slate-100 border-dashed"></div>
                 <div className="w-full border-b border-slate-100 border-dashed"></div>
                 <div className="w-full border-b border-slate-100 border-dashed"></div>
                 <div className="w-full border-b border-slate-100 border-dashed"></div>
                 <div></div> {/* Bottom axis handled already */}
              </div>

              {/* Dummy Bars */}
              {[9.2, 9, 9.3, 0, 9, 9, 0, 0, 9.1, 9.2, 8.5, 9, 9, 0, 0, 9, 9.1, 9, 9, 8.8, 0, 0, 9].map((val, i) => (
                  <div key={i} className="relative flex-1 group z-10 flex flex-col items-center h-full justify-end">
                     {/* Tooltip on hover */}
                     <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
                        Oct {i+1}: {val === 0 ? '0h' : val + 'h'}
                     </div>
                     {/* Actual Bar */}
                     <div 
                         className={`w-full max-w-[24px] rounded-t-sm transition-all duration-300 ${val === 0 ? 'bg-slate-100' : 'bg-[#0062FF] hover:bg-[#004ACC]'}`}
                         style={{ height: `${(val / 12) * 100}%` }}
                     ></div>
                  </div>
              ))}
           </div>
        </div>

        {/* Detailed Log Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="text-lg font-bold text-slate-900">Attendance Log</h2>
                 <button className="text-[#0062FF] text-sm font-semibold hover:underline px-2 py-2 min-h-[44px] outline-none">
                    Filter by Status
                 </button>
            </div>
            
            <div className="w-full overflow-x-auto">
               <table className="w-full text-left text-sm text-slate-600 border-collapse min-w-[600px]">
                  <thead className="bg-[#F8FAFC]">
                     <tr>
                        <th className="font-semibold text-slate-500 uppercase tracking-widest text-xs px-6 py-4">Date</th>
                        <th className="font-semibold text-slate-500 uppercase tracking-widest text-xs px-6 py-4">Status</th>
                        <th className="font-semibold text-slate-500 uppercase tracking-widest text-xs px-6 py-4">Clock In</th>
                        <th className="font-semibold text-slate-500 uppercase tracking-widest text-xs px-6 py-4">Clock Out</th>
                        <th className="font-semibold text-slate-500 uppercase tracking-widest text-xs px-6 py-4">Duration</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {dummyLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#F8FAFC]/60 transition-colors group">
                           <td className="px-6 py-4 font-semibold text-slate-800">
                              {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                           </td>
                           <td className="px-6 py-4">
                              {getStatusDot(log.status)}
                           </td>
                           <td className="px-6 py-4 font-medium">{log.in}</td>
                           <td className="px-6 py-4 font-medium">{log.out}</td>
                           <td className="px-6 py-4 font-mono text-slate-500">{log.duration}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-white">
               <span className="px-2">Showing 1 to 8 of 22 entries</span>
               <div className="flex gap-2">
                  <button className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 hover:border-[#0062FF] hover:text-[#0062FF] bg-white transition-colors" aria-label="Previous Page">
                     <ChevronLeft size={18} />
                  </button>
                  <button className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-[#0062FF] text-white font-semibold transition-colors" aria-label="Page 1">
                     1
                  </button>
                  <button className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 hover:border-[#0062FF] hover:text-[#0062FF] bg-white transition-colors" aria-label="Page 2">
                     2
                  </button>
                  <button className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 hover:border-[#0062FF] hover:text-[#0062FF] bg-white transition-colors" aria-label="Page 3">
                     3
                  </button>
                  <button className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 hover:border-[#0062FF] hover:text-[#0062FF] bg-white transition-colors" aria-label="Next Page">
                     <ChevronRight size={18} />
                  </button>
               </div>
            </div>

        </div>

      </div>
    </Layout>
  );
}
