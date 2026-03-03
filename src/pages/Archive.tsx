import React from 'react';
import { mockProjects } from '@/lib/mock-data';
import StatusBadge from '@/components/StatusBadge';
import { Input } from '@/components/ui/input';
import { Search, Archive as ArchiveIcon } from 'lucide-react';

const ArchivePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Project Archive</h1>
        <p className="text-muted-foreground text-sm mt-1">Browse previous year projects</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by title, domain, or keyword..." className="pl-9" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <ArchiveIcon className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-semibold">2024-25 Projects</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockProjects.map(p => (
            <div key={p.id} className="p-4 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors">
              <p className="font-medium text-sm">{p.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{p.domain}</p>
              <div className="mt-2"><StatusBadge status={p.status} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;
