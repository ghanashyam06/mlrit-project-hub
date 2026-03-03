import React from 'react';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { mockProjects, mockTeams } from '@/lib/mock-data';
import { FolderKanban, FileCheck, Clock, Users } from 'lucide-react';

const MentorDashboard: React.FC = () => {
  const pendingReviews = mockProjects.filter(p => p.status === 'Student Mentor Review').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">Student Mentor Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Sai Kiran M</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Teams" value={mockTeams.length} icon={<FolderKanban className="w-5 h-5" />} variant="green" />
        <StatCard title="Students" value={mockTeams.reduce((a, t) => a + t.members.length, 0)} icon={<Users className="w-5 h-5" />} variant="blue" />
        <StatCard title="Pending Reviews" value={pendingReviews} icon={<Clock className="w-5 h-5" />} variant="red" />
        <StatCard title="Total Projects" value={mockProjects.length} icon={<FileCheck className="w-5 h-5" />} variant="green" />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-heading font-semibold mb-4">Teams Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockTeams.map(t => {
            const project = mockProjects.find(p => p.id === t.projectId);
            return (
              <div key={t.id} className="p-4 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{t.name}</p>
                  {project && <StatusBadge status={project.status} />}
                </div>
                <p className="text-xs text-muted-foreground">{t.members.map(m => m.name).join(', ')}</p>
                {project && <p className="text-sm mt-2 text-foreground/80">{project.title}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
