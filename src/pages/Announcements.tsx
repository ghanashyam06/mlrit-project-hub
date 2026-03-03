import React from 'react';
import { mockAnnouncements } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Plus, Megaphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Announcements: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Announcements</h1>
          <p className="text-muted-foreground text-sm mt-1">Important notices and updates</p>
        </div>
        {isAdmin && (
          <Button>
            <Plus className="w-4 h-4 mr-2" /> New Announcement
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {mockAnnouncements.map(a => (
          <div key={a.id} className="rounded-xl border border-border bg-card p-6 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold">{a.title}</h3>
                  <span className="text-xs text-muted-foreground">{a.createdAt}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{a.content}</p>
                <p className="text-xs text-muted-foreground mt-3">— {a.author}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
