import React from 'react';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { mockProjects, mockTeams, mockSections, mockTimetable } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { DayOfWeek } from '@/lib/types';
import { FolderKanban, FileCheck, Clock, Users, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const MentorDashboard: React.FC = () => {
  const { user } = useAuth();
  const assignedSections = mockSections.filter(s => s.studentMentors.some(m => m.id === user?.id));
  const sectionIds = assignedSections.map(s => s.id);
  const sectionTeams = mockTeams.filter(t => sectionIds.includes(t.sectionId));
  const sectionProjects = mockProjects.filter(p => sectionIds.includes(p.sectionId));
  const pendingReviews = sectionProjects.filter(p => p.status === 'Student Mentor Review').length;

  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()) as DayOfWeek;
  const todaysClasses = mockTimetable
    .filter(e => e.studentMentorIds.includes(user?.id || '') && e.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold">Student Mentor Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="My Teams" value={sectionTeams.length} icon={<FolderKanban className="w-5 h-5" />} variant="green" />
            <StatCard title="Students" value={sectionTeams.reduce((a, t) => a + t.members.length, 0)} icon={<Users className="w-5 h-5" />} variant="blue" />
            <StatCard title="Pending Reviews" value={pendingReviews} icon={<Clock className="w-5 h-5" />} variant="red" />
            <StatCard title="Total Projects" value={sectionProjects.length} icon={<FileCheck className="w-5 h-5" />} variant="green" />
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading font-semibold mb-4">Teams Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sectionTeams.map(t => {
                const project = mockProjects.find(p => p.id === t.projectId);
                return (
                  <div key={t.id} className="p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{t.name}</p>
                      {project && <StatusBadge status={project.status} />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{t.members.map(m => m.name).join(', ')}</p>
                    {project && <p className="text-sm mt-2 text-foreground/80 line-clamp-1">{project.title}</p>}
                  </div>
                );
              })}
              {sectionTeams.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8 col-span-2">No teams in your sections</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 relative overflow-hidden">
            <h3 className="text-sm font-heading font-bold text-primary flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4" /> Today's Schedule
            </h3>
            {todaysClasses.length > 0 ? (
              <div className="space-y-3">
                {todaysClasses.map(entry => (
                  <div key={entry.id} className="p-3 rounded-lg bg-white dark:bg-card border border-primary/10 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-primary">{entry.startTime} - {entry.endTime}</span>
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-bold">
                        {entry.room}
                      </span>
                    </div>
                    <p className="text-xs font-semibold truncate">
                      {entry.sectionName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic py-4 text-center">No classes today</p>
            )}
            <Link to="/timetable" className="block text-center text-[10px] font-bold text-primary mt-4 hover:underline">
              View Full Timetable
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
