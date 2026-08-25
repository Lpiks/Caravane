'use client';

import { ArrowUpRight, CarFront, Cuboid, Users, MessageSquare, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Mon', inquiries: 4, designs: 12 },
  { name: 'Tue', inquiries: 7, designs: 18 },
  { name: 'Wed', inquiries: 5, designs: 15 },
  { name: 'Thu', inquiries: 9, designs: 25 },
  { name: 'Fri', inquiries: 6, designs: 22 },
  { name: 'Sat', inquiries: 14, designs: 35 },
  { name: 'Sun', inquiries: 10, designs: 28 },
];

const recentActions = [
  { id: 1, icon: Cuboid, color: 'text-blue-400', bg: 'bg-blue-500/10', text: 'Karim S. submitted a new 3D Layout', time: '10 mins ago' },
  { id: 2, icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-500/10', text: 'New inquiry from Sarah L.', time: '1 hour ago' },
  { id: 3, icon: PlusCircle, color: 'text-terracotta-400', bg: 'bg-terracotta-500/10', text: 'Added new vehicle: Ford Transit', time: '3 hours ago' },
  { id: 4, icon: Cuboid, color: 'text-blue-400', bg: 'bg-blue-500/10', text: 'Youssef B. submitted a new 3D Layout', time: '5 hours ago' },
  { id: 5, icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-500/10', text: 'New inquiry from Amine T.', time: 'Yesterday' },
];

const kpis = [
  { label: 'Total Fleet', value: '14', icon: CarFront, trend: '+2 this month' },
  { label: 'Studio Designs', value: '128', icon: Cuboid, trend: '+15 this week' },
  { label: 'Active Inquiries', value: '24', icon: Users, trend: '4 pending' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#181A1D] border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-300">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardClient() {
  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Welcome back. Here is what is happening today.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={64} />
              </div>
              <div className="relative z-10">
                <div className="text-slate-400 text-sm font-medium mb-4 flex items-center gap-2">
                  <Icon size={16} />
                  {kpi.label}
                </div>
                <div className="text-4xl font-bold text-white mb-2">{kpi.value}</div>
                <div className="text-blue-400 text-sm font-medium flex items-center gap-1">
                  <ArrowUpRight size={14} />
                  {kpi.trend}
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm lg:col-span-2 flex flex-col min-h-[400px]">
          <h2 className="text-lg font-semibold text-white mb-6">Weekly Activity</h2>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDesigns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="designs" name="3D Designs Saved" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorDesigns)" />
                <Area type="monotone" dataKey="inquiries" name="New Inquiries" stroke="#f87171" strokeWidth={2} fillOpacity={1} fill="url(#colorInquiries)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col min-h-[400px]">
          <h2 className="text-lg font-semibold text-white mb-6">Recent Actions</h2>
          <div className="flex-1 flex flex-col justify-start">
            {recentActions.map((action, i) => {
              const ActionIcon = action.icon;
              return (
                <div key={action.id} className={`flex items-start gap-4 py-4 ${i !== recentActions.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className={`p-2 rounded-full ${action.bg}`}>
                    <ActionIcon size={16} className={action.color} />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm text-slate-200">{action.text}</p>
                    <p className="text-xs text-slate-500 mt-1">{action.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
