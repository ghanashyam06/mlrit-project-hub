import React, { useState, useMemo } from 'react';
import { mockProjects, mockTeams, mockSections } from '@/lib/mock-data';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, ExternalLink, Github, Video, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectStatus } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

const statusOptions: ProjectStatus[] = ['Draft', 'Student Mentor Review', 'Faculty Review', 'Approved', 'Submitted to CIE', 'Completed'];

const Projects: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isMentor = user?.role === 'student_mentor' || user?.role === 'faculty';
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [semesterFilter, setSemesterFilter] = useState<string>('all');

  // Editable fields for student project view
  const [editGithub, setEditGithub] = useState('');
  const [editVideo, setEditVideo] = useState('');
  const [editingProject, setEditingProject] = useState(false);

  const filteredProjects = useMemo(() => {
    let projects = mockProjects;

    if (user?.role === 'student') {
      const myTeam = mockTeams.find(t => t.members.some(m => m.id === user.id));
      projects = projects.filter(p => p.teamId === myTeam?.id);
    } else if (user?.role === 'student_mentor') {
      const assignedSections = mockSections.filter(s => s.studentMentors.some(m => m.id === user.id));
      const sectionIds = assignedSections.map(s => s.id);
      projects = projects.filter(p => sectionIds.includes(p.sectionId));
    } else if (user?.role === 'faculty') {
      const assignedSections = mockSections.filter(s => s.facultyMentor?.id === user.id);
      const sectionIds = assignedSections.map(s => s.id);
      projects = projects.filter(p => sectionIds.includes(p.sectionId));
    }

    if (yearFilter !== 'all') projects = projects.filter(p => p.academicYear === yearFilter);
    if (semesterFilter !== 'all') projects = projects.filter(p => p.semester === semesterFilter);

    return projects;
  }, [user, yearFilter, semesterFilter]);

  const years = [...new Set(mockProjects.map(p => p.academicYear))];
  const semesters = [...new Set(mockProjects.map(p => p.semester))];

  const handleSaveProjectLinks = () => {
    toast({ title: 'Links updated', description: 'Your GitHub and video links have been saved.' });
    setEditingProject(false);
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    toast({ title: 'Status updated', description: `Project status changed to "${newStatus}".` });
  };

  // Student view: detailed project card with editable github/video links
  if (user?.role === 'student' && filteredProjects.length > 0) {
    const project = filteredProjects[0];
    const team = mockTeams.find(t => t.id === project.teamId);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">My Project</h1>
          <p className="text-muted-foreground text-sm mt-1">Your project details and submission status</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold">{project.title}</h2>
            <StatusBadge status={project.status} />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Domain:</span> <span className="font-medium">{project.domain}</span></div>
            <div><span className="text-muted-foreground">Academic Year:</span> <span className="font-medium">{project.academicYear}</span></div>
            <div><span className="text-muted-foreground">Semester:</span> <span className="font-medium">{project.semester}</span></div>
            <div><span className="text-muted-foreground">Last Updated:</span> <span className="font-medium">{project.updatedAt}</span></div>
          </div>

          {/* Editable GitHub and Video links */}
          <div className="mt-5 p-4 rounded-lg bg-muted/30 border border-border/50 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Project Links</p>
              {!editingProject ? (
                <Button variant="outline" size="sm" onClick={() => {
                  setEditGithub(project.githubLink || '');
                  setEditVideo(project.videoLink || '');
                  setEditingProject(true);
                }}>Edit Links</Button>
              ) : (
                <Button size="sm" onClick={handleSaveProjectLinks}>
                  <Save className="w-3.5 h-3.5 mr-1.5" /> Save
                </Button>
              )}
            </div>
            {editingProject ? (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs">GitHub Repository Link</Label>
                  <Input value={editGithub} onChange={e => setEditGithub(e.target.value)} placeholder="https://github.com/..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Prototype Video Link</Label>
                  <Input value={editVideo} onChange={e => setEditVideo(e.target.value)} placeholder="https://youtube.com/..." />
                </div>
              </>
            ) : (
              <>
                {project.githubLink ? (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Github className="w-4 h-4" /> {project.githubLink}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground flex items-center gap-2"><Github className="w-4 h-4" /> No GitHub link added</p>
                )}
                {project.videoLink ? (
                  <a href={project.videoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Video className="w-4 h-4" /> {project.videoLink}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground flex items-center gap-2"><Video className="w-4 h-4" /> No video link added</p>
                )}
              </>
            )}
          </div>

          {project.abstract && <p className="mt-4 text-sm text-muted-foreground">{project.abstract}</p>}
          {project.feedback && (
            <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs text-muted-foreground font-medium mb-1">Feedback</p>
              <p className="text-sm">{project.feedback}</p>
            </div>
          )}

          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-xs text-muted-foreground font-medium mb-3">Submission Checklist</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { label: 'Abstract', done: !!project.abstract },
                { label: 'PPT', done: !!project.pptFile },
                { label: 'Project Report', done: !!project.reportFile },
                { label: 'Yukthi File', done: !!project.yukthiFile },
                { label: 'GitHub Link', done: !!project.githubLink },
                { label: 'Video Link', done: !!project.videoLink },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border-2 ${item.done ? 'bg-primary border-primary' : 'border-border'}`} />
                  <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">Track and manage all micro projects</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> Export Excel
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Academic Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={semesterFilter} onValueChange={setSemesterFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            {semesters.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Domain</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Year</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Updated</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(project => (
                <tr key={project.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4"><p className="font-medium">{project.title}</p></td>
                  <td className="p-4 text-muted-foreground">{project.domain}</td>
                  <td className="p-4">
                    {isMentor ? (
                      <Select defaultValue={project.status} onValueChange={(val) => handleStatusChange(project.id, val as ProjectStatus)}>
                        <SelectTrigger className="w-44 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <StatusBadge status={project.status} />
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground">{project.academicYear}</td>
                  <td className="p-4 text-muted-foreground">{project.updatedAt}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No projects found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Projects;
