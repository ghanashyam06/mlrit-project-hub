import React, { useState, useMemo } from 'react';
import StatCard from '@/components/StatCard';
import { mockProjects, mockSections, mockUsers, mockAnnouncements } from '@/lib/mock-data';
import { Users, Layers, FileCheck, Clock, Megaphone, UserPlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ProjectStatus } from '@/lib/types';

const statusColors: Record<ProjectStatus, string> = {
  'Draft': 'hsl(0, 0%, 60%)',
  'Student Mentor Review': 'hsl(38, 92%, 50%)',
  'Faculty Review': 'hsl(215, 80%, 50%)',
  'Approved': 'hsl(145, 63%, 42%)',
  'Submitted to CIE': 'hsl(280, 60%, 50%)',
  'Completed': 'hsl(145, 63%, 32%)',
};

const AdminDashboard: React.FC = () => {
  const totalStudents = mockUsers.filter(u => u.role === 'student').length;
  const pendingApprovals = mockProjects.filter(p => p.status === 'Faculty Review' || p.status === 'Student Mentor Review').length;

  const [createFacultyOpen, setCreateFacultyOpen] = useState(false);
  const [newFacultyName, setNewFacultyName] = useState('');
  const [newFacultyEmail, setNewFacultyEmail] = useState('');
  const [newFacultyDept, setNewFacultyDept] = useState('');
  const [newFacultyPassword, setNewFacultyPassword] = useState('');

  // Section-wise project status analysis
  const sectionProjectData = useMemo(() => {
    return mockSections.map(section => {
      const sectionProjects = mockProjects.filter(p => p.sectionId === section.id);
      const entry: Record<string, any> = { name: section.name };
      const statuses: ProjectStatus[] = ['Draft', 'Student Mentor Review', 'Faculty Review', 'Approved', 'Submitted to CIE', 'Completed'];
      statuses.forEach(s => {
        entry[s] = sectionProjects.filter(p => p.status === s).length;
      });
      return entry;
    });
  }, []);

  const handleCreateFaculty = () => {
    toast({ title: 'Faculty mentor created', description: `Credentials created for ${newFacultyName}.` });
    setCreateFacultyOpen(false);
    setNewFacultyName('');
    setNewFacultyEmail('');
    setNewFacultyDept('');
    setNewFacultyPassword('');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back, Dr. Rajesh Kumar</p>
        </div>
        <Dialog open={createFacultyOpen} onOpenChange={setCreateFacultyOpen}>
          <DialogTrigger asChild>
            <Button><UserPlus className="w-4 h-4 mr-2" /> Add Faculty Mentor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Faculty Mentor Credentials</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={newFacultyName} onChange={e => setNewFacultyName(e.target.value)} placeholder="Prof. Name" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={newFacultyEmail} onChange={e => setNewFacultyEmail(e.target.value)} placeholder="email@mlrit.ac.in" />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={newFacultyDept} onChange={e => setNewFacultyDept(e.target.value)} placeholder="CSE" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={newFacultyPassword} onChange={e => setNewFacultyPassword(e.target.value)} placeholder="Initial password" />
              </div>
              <Button className="w-full" onClick={handleCreateFaculty}>Create Credentials</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={mockUsers.length} subtitle={`${totalStudents} students`} icon={<Users className="w-5 h-5" />} variant="green" />
        <StatCard title="Sections" value={mockSections.length} subtitle="Active sections" icon={<Layers className="w-5 h-5" />} variant="blue" />
        <StatCard title="Projects" value={mockProjects.length} subtitle="This year" icon={<FileCheck className="w-5 h-5" />} variant="green" />
        <StatCard title="Pending" value={pendingApprovals} subtitle="Awaiting review" icon={<Clock className="w-5 h-5" />} variant="red" />
      </div>

      {/* Section-wise project status chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading font-semibold mb-4">Section-wise Project Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sectionProjectData}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {Object.entries(statusColors).map(([status, color]) => (
              <Bar key={status} dataKey={status} stackId="a" fill={color} radius={0} />
            ))}
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
  );
};

export default AdminDashboard;
