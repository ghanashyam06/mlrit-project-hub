import React from 'react';
import { mockTeams, mockProjects } from '@/lib/mock-data';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Teams: React.FC = () => {
  const { user } = useAuth();
  const canCreateTeams = user?.role === 'student_mentor' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Teams</h1>
          <p className="text-muted-foreground text-sm mt-1">View and manage project teams</p>
        </div>
        {canCreateTeams && (
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Create Team
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockTeams.map(team => {
          const project = mockProjects.find(p => p.id === team.projectId);
          return (
            <div key={team.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold">{team.name}</h3>
                    <p className="text-xs text-muted-foreground">{team.members.length} members</p>
                  </div>
                </div>
                {project && <StatusBadge status={project.status} />}
              </div>

              {project && (
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50 mb-3">
                  <p className="text-sm font-medium">{project.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{project.domain}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {team.members.map(m => (
                  <div key={m.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
                      {m.name.charAt(0)}
                    </div>
                    {m.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Teams;
