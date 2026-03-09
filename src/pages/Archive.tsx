import React, { useState } from 'react';
import { mockProjects, mockTeams, mockUsers } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Archive as ArchiveIcon, Github, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ArchivePage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');

  const years = [...new Set(mockProjects.map(p => p.academicYear))];

  // All roles: only show approved projects in archive
  const filtered = mockProjects.filter(p => {
    if (p.status !== 'Approved') return false;
    const matchSearch = search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.domain.toLowerCase().includes(search.toLowerCase());
    const matchYear = yearFilter === 'all' || p.academicYear === yearFilter;
    return matchSearch && matchYear;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Project Archive</h1>
        <p className="text-muted-foreground text-sm mt-1">Browse approved projects</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by title, domain, or keyword..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filtered.map(p => {
          const team = mockTeams.find(t => t.id === p.teamId);
          return (
            <div key={p.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow animate-fade-in">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-heading font-semibold">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.domain} • {p.academicYear} • {p.semester}</p>
                </div>
              </div>

              {p.githubLink && (
                <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mb-3">
                  <Github className="w-3.5 h-3.5" /> {p.githubLink}
                </a>
              )}

              {team && (
                <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground">{team.name}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {team.members.map(m => (
                      <span key={m.id}>
                        {m.name} {m.rollNumber && `(${m.rollNumber})`} {m.department && `• ${m.department}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No approved projects found</p>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;
