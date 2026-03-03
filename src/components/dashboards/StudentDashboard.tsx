import React from 'react';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { mockProjects, mockTeams } from '@/lib/mock-data';
import { FolderKanban, FileCheck, Clock, Github } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const myTeam = mockTeams[0];
  const myProject = mockProjects.find(p => p.id === myTeam?.projectId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Akhil Sharma</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Team" value={myTeam?.name || 'N/A'} icon={<FolderKanban className="w-5 h-5" />} variant="green" />
        <StatCard title="Team Size" value={myTeam?.members.length || 0} icon={<FolderKanban className="w-5 h-5" />} variant="blue" />
        <StatCard title="Project Status" value={myProject?.status || 'N/A'} icon={<FileCheck className="w-5 h-5" />} variant="green" />
        <StatCard title="Deadline" value="Jan 15" subtitle="CIE Submission" icon={<Clock className="w-5 h-5" />} variant="red" />
      </div>

      {myProject && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold">My Project</h3>
            <StatusBadge status={myProject.status} />
          </div>
          <h4 className="text-lg font-medium">{myProject.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">Domain: {myProject.domain}</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs text-muted-foreground font-medium mb-2">Submission Checklist</p>
              <div className="space-y-2 text-sm">
                {['Abstract', 'PPT', 'Project Report', 'Yukthi File', 'GitHub Link', 'Video Link'].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-border" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs text-muted-foreground font-medium mb-2">Team Members</p>
              <div className="space-y-2">
                {myTeam?.members.map(m => (
                  <div key={m.id} className="flex items-center gap-2 text-sm">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-[10px] text-muted-foreground">{m.rollNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
