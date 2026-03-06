import React from 'react';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { mockProjects, mockTeams } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { FolderKanban, FileCheck, Clock, Crown, Phone, Mail, Github, Linkedin } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const myTeam = mockTeams.find(t => t.members.some(m => m.id === user?.id));
  const myProject = mockProjects.find(p => p.id === myTeam?.projectId);
  const lead = myTeam?.members.find(m => m.id === myTeam.leadId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">Team Portal</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Team" value={myTeam?.name || 'N/A'} icon={<FolderKanban className="w-5 h-5" />} variant="green" />
        <StatCard title="Team Size" value={myTeam?.members.length || 0} icon={<FolderKanban className="w-5 h-5" />} variant="blue" />
        <StatCard title="Project Status" value={myProject?.status || 'N/A'} icon={<FileCheck className="w-5 h-5" />} variant="green" />
        <StatCard title="Deadline" value="Jan 15" subtitle="CIE Submission" icon={<Clock className="w-5 h-5" />} variant="red" />
      </div>

      {myTeam && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold">My Team — {myTeam.name}</h3>
            {lead && <span className="text-xs text-muted-foreground">Lead: {lead.name}</span>}
          </div>
          <div className="space-y-3">
            {myTeam.members.map(m => (
              <div key={m.id} className="p-3 rounded-lg border border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{m.name}</p>
                      {m.id === myTeam.leadId && <Crown className="w-3.5 h-3.5 text-yellow-500" />}
                    </div>
                    {m.rollNumber && <p className="text-xs text-muted-foreground">{m.rollNumber}</p>}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {m.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {m.phone}</span>}
                  {m.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {m.email}</span>}
                  {m.githubLink && <a href={m.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary"><Github className="w-3 h-3" /> GitHub</a>}
                  {m.linkedinLink && <a href={m.linkedinLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary"><Linkedin className="w-3 h-3" /> LinkedIn</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {myProject && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold">My Project</h3>
            <StatusBadge status={myProject.status} />
          </div>
          <h4 className="text-lg font-medium">{myProject.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">Domain: {myProject.domain}</p>

          <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-xs text-muted-foreground font-medium mb-2">Submission Checklist</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { label: 'Abstract', done: !!myProject.abstract },
                { label: 'PPT', done: !!myProject.pptFile },
                { label: 'Project Report', done: !!myProject.reportFile },
                { label: 'Yukthi File', done: !!myProject.yukthiFile },
                { label: 'GitHub Link', done: !!myProject.githubLink },
                { label: 'Video Link', done: !!myProject.videoLink },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border-2 ${item.done ? 'bg-primary border-primary' : 'border-border'}`} />
                  <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
