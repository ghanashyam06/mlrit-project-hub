import React, { useState } from 'react';
import { mockAnnouncements as initialAnnouncements } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Plus, Megaphone, Download, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Announcement } from '@/lib/types';

const Announcements: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isMentor = user?.role === 'faculty' || user?.role === 'student_mentor';
  const canCreate = isAdmin || isMentor;

  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'mentors_only'>('all');

  const filteredAnnouncements = announcements.filter(a => {
    if (isAdmin || isMentor) return true;
    return a.targetAudience === 'all';
  });

  const handleCreate = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const newAnnouncement: Announcement = {
      id: `a-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: user?.name || 'Admin',
      createdAt: new Date().toLocaleDateString('en-GB'),
      targetAudience: targetAudience,
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setIsOpen(false);
    setNewTitle('');
    setNewContent('');
    setTargetAudience('all');
    toast({ 
      title: 'Announcement created', 
      description: targetAudience === 'all' ? 'Your message has been posted to all users.' : 'Your message has been posted to mentors only.' 
    });
  };

  const handleExport = () => {
    const headers = ['ID', 'Title', 'Content', 'Author', 'Created At', 'Audience'];
    const csvData = announcements.map(a => [
      a.id,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.content.replace(/"/g, '""')}"`,
      a.author,
      a.createdAt,
      a.targetAudience
    ]);

    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "announcements_export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Export complete', description: 'Announcements have been downloaded as CSV.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Announcements</h1>
          <p className="text-muted-foreground text-sm mt-1">Important notices and updates</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" /> Export Excel
            </Button>
          )}
          {canCreate && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" /> New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={newTitle} 
                      onChange={e => setNewTitle(e.target.value)} 
                      placeholder="e.g. Project Phase 1 Submission"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      id="content" 
                      value={newContent} 
                      onChange={e => setNewContent(e.target.value)} 
                      placeholder="Enter the announcement details..."
                      rows={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select value={targetAudience} onValueChange={(value: 'all' | 'mentors_only') => setTargetAudience(value)}>
                      <SelectTrigger id="audience">
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users (Students & Mentors)</SelectItem>
                        <SelectItem value="mentors_only">Mentors Only (Admin & Mentors)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreate}>Post Announcement</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredAnnouncements.map(a => (
          <div key={a.id} className="rounded-xl border border-border bg-card p-6 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-semibold">{a.title}</h3>
                    {a.targetAudience === 'mentors_only' && (
                      <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-500 py-0.5 px-2 rounded-full border border-amber-500/20">
                        <EyeOff className="w-3 h-3" /> Mentors Only
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{a.createdAt}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{a.content}</p>
                <p className="text-xs text-muted-foreground mt-3">— {a.author}</p>
              </div>
            </div>
          </div>
        ))}
        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-xl border-border/50">
            <Megaphone className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No announcements found</h3>
            <p className="text-sm text-muted-foreground/60">Check back later for updates</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
