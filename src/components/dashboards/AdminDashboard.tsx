import React from 'react';
import StatCard from '@/components/StatCard';
import { mockProjects, mockSections, mockUsers, domainStats, mockAnnouncements } from '@/lib/mock-data';
import { Users, Layers, FileCheck, Clock, Megaphone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import StatusBadge from '@/components/StatusBadge';

const AdminDashboard: React.FC = () => {
  const totalStudents = mockUsers.filter(u => u.role === 'student').length;
  const totalMentors = mockUsers.filter(u => u.role === 'faculty' || u.role === 'student_mentor').length;
  const pendingApprovals = mockProjects.filter(p => p.status === 'Faculty Review' || p.status === 'Student Mentor Review').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Dr. Rajesh Kumar</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={mockUsers.length} subtitle={`${totalStudents} students`} icon={<Users className="w-5 h-5" />} variant="green" />
        <StatCard title="Sections" value={mockSections.length} subtitle="Active sections" icon={<Layers className="w-5 h-5" />} variant="blue" />
        <StatCard title="Projects" value={mockProjects.length} subtitle="This year" icon={<FileCheck className="w-5 h-5" />} variant="green" />
        <StatCard title="Pending" value={pendingApprovals} subtitle="Awaiting review" icon={<Clock className="w-5 h-5" />} variant="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Domain chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading font-semibold mb-4">Projects by Domain</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={domainStats}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {domainStats.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent announcements */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="w-4 h-4 text-primary" />
            <h3 className="font-heading font-semibold">Announcements</h3>
          </div>
          <div className="space-y-3">
            {mockAnnouncements.map(a => (
              <div key={a.id} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.content}</p>
                <p className="text-[10px] text-muted-foreground mt-2">{a.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent projects */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading font-semibold mb-4">Recent Projects</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-muted-foreground">Title</th>
                <th className="pb-3 font-medium text-muted-foreground">Domain</th>
                <th className="pb-3 font-medium text-muted-foreground">Status</th>
                <th className="pb-3 font-medium text-muted-foreground">Updated</th>
              </tr>
            </thead>
            <tbody>
              {mockProjects.map(p => (
                <tr key={p.id} className="border-b border-border/50 last:border-0">
                  <td className="py-3 font-medium">{p.title}</td>
                  <td className="py-3 text-muted-foreground">{p.domain}</td>
                  <td className="py-3"><StatusBadge status={p.status} /></td>
                  <td className="py-3 text-muted-foreground">{p.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
