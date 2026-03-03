import React from 'react';
import { mockProjects } from '@/lib/mock-data';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Download, Filter, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Projects: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">Track and manage all micro projects</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          {isAdmin && (
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> Export Excel
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Domain</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Updated</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockProjects.map(project => (
                <tr key={project.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <p className="font-medium">{project.title}</p>
                  </td>
                  <td className="p-4 text-muted-foreground">{project.domain}</td>
                  <td className="p-4"><StatusBadge status={project.status} /></td>
                  <td className="p-4 text-muted-foreground">{project.updatedAt}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Projects;
