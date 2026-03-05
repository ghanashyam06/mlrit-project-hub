import React, { useState, useMemo } from 'react';
import { mockTeams, mockProjects, mockSections, mockUsers } from '@/lib/mock-data';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Mail, Phone, Github, Linkedin, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Teams: React.FC = () => {
  const { user } = useAuth();
  const canCreateTeams = user?.role === 'student_mentor' || user?.role === 'admin';
  const [createOpen, setCreateOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamSize, setNewTeamSize] = useState('4');
  const [newTeamLead, setNewTeamLead] = useState('');

  const filteredTeams = useMemo(() => {
    if (user?.role === 'student') {
      // Students see only their team
      return mockTeams.filter(t => t.members.some(m => m.id === user.id));
    } else if (user?.role === 'student_mentor') {
      // Mentor sees only assigned section teams
      const assignedSections = mockSections.filter(s => s.studentMentors.some(m => m.id === user.id));
      const sectionIds = assignedSections.map(s => s.id);
      return mockTeams.filter(t => sectionIds.includes(t.sectionId));
    } else if (user?.role === 'faculty') {
      const assignedSections = mockSections.filter(s => s.facultyMentor?.id === user.id);
      const sectionIds = assignedSections.map(s => s.id);
      return mockTeams.filter(t => sectionIds.includes(t.sectionId));
    }
    return mockTeams;
  }, [user]);

  const students = mockUsers.filter(u => u.role === 'student');

  // Student view: detailed team card
  if (user?.role === 'student' && filteredTeams.length > 0) {
    const team = filteredTeams[0];
    const lead = team.members.find(m => m.id === team.leadId);
    const project = mockProjects.find(p => p.id === team.projectId);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">My Team</h1>
          <p className="text-muted-foreground text-sm mt-1">Your team details</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-semibold">{team.name}</h2>
              {lead && <p className="text-sm text-muted-foreground">Lead: {lead.name}</p>}
            </div>
            {project && <div className="ml-auto"><StatusBadge status={project.status} /></div>}
          </div>

          {project && (
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50 mb-4">
              <p className="text-sm font-medium">{project.title}</p>
              <p className="text-xs text-muted-foreground">{project.domain}</p>
            </div>
          )}

          <h3 className="text-sm font-medium mb-3">Members</h3>
          <div className="space-y-3">
            {team.members.map(m => (
              <div key={m.id} className="p-3 rounded-lg border border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{m.name}</p>
                      {m.id === team.leadId && <Crown className="w-3.5 h-3.5 text-yellow-500" />}
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Teams</h1>
          <p className="text-muted-foreground text-sm mt-1">View and manage project teams</p>
        </div>
        {canCreateTeams && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Create Team</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Team Name</Label>
                  <Input value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="e.g. Team Gamma" />
                </div>
                <div className="space-y-2">
                  <Label>Team Size</Label>
                  <Select value={newTeamSize} onValueChange={setNewTeamSize}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6].map(n => <SelectItem key={n} value={String(n)}>{n} members</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Team Lead</Label>
                  <Select value={newTeamLead} onValueChange={setNewTeamLead}>
                    <SelectTrigger><SelectValue placeholder="Select team lead" /></SelectTrigger>
                    <SelectContent>
                      {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.rollNumber})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={() => setCreateOpen(false)}>Create Team</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeams.map(team => {
          const project = mockProjects.find(p => p.id === team.projectId);
          const lead = team.members.find(m => m.id === team.leadId);
          return (
            <div key={team.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold">{team.name}</h3>
                    <p className="text-xs text-muted-foreground">{team.members.length}/{team.teamSize} members {lead && `• Lead: ${lead.name}`}</p>
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
                    {m.id === team.leadId && <Crown className="w-3 h-3 text-yellow-500" />}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {filteredTeams.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-2 text-center py-8">No teams found</p>
        )}
      </div>
    </div>
  );
};

export default Teams;
