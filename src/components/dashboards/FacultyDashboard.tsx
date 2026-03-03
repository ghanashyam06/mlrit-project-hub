import React from 'react';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { mockProjects, mockSections } from '@/lib/mock-data';
import { Layers, FileCheck, Clock, CheckCircle } from 'lucide-react';

const FacultyDashboard: React.FC = () => {
  const assignedSections = mockSections.filter(s => s.facultyMentor?.role === 'faculty');
  const pendingReviews = mockProjects.filter(p => p.status === 'Faculty Review').length;
  const approved = mockProjects.filter(p => p.status === 'Approved' || p.status === 'Completed').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">Faculty Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Prof. Anitha Sharma</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned Sections" value={assignedSections.length} icon={<Layers className="w-5 h-5" />} variant="blue" />
        <StatCard title="Total Projects" value={mockProjects.length} icon={<FileCheck className="w-5 h-5" />} variant="green" />
        <StatCard title="Pending Reviews" value={pendingReviews} icon={<Clock className="w-5 h-5" />} variant="red" />
        <StatCard title="Approved" value={approved} icon={<CheckCircle className="w-5 h-5" />} variant="green" />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading font-semibold mb-4">Projects Pending Review</h3>
        <div className="space-y-3">
          {mockProjects.filter(p => p.status === 'Faculty Review').map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{p.domain}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
          {mockProjects.filter(p => p.status === 'Faculty Review').length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No pending reviews</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
