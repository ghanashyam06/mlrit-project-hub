import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockTimetable, mockSections, mockUsers } from '@/lib/mock-data';
import { TimetableEntry, DayOfWeek, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger
} from '@/components/ui/dialog';
import {
  Calendar as CalendarIcon, Clock, MapPin, Plus, Trash2, Pencil,
  ChevronLeft, ChevronRight, Bell, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SESSIONS = [
  { id: '1', label: 'Session 1', start: '10:20', end: '12:20' },
  { id: '2', label: 'Session 2', start: '14:10', end: '16:10' }
];

const Timetable: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isFacultyOrMentor = user?.role === 'faculty' || user?.role === 'student_mentor';

  const [entries, setEntries] = useState<TimetableEntry[]>(mockTimetable);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<TimetableEntry>>({
    day: 'Monday',
    startTime: SESSIONS[0].start,
    endTime: SESSIONS[0].end,
    dept: '',
    sectionName: '',
    facultyMentorId: '',
    studentMentorIds: [],
    room: ''
  });

  const facultyList = mockUsers.filter(u => u.role === 'faculty');
  const studentMentorList = mockUsers.filter(u => u.role === 'student_mentor');
  const allMentors = [...facultyList, ...studentMentorList];

  const assignedStudentIds = useMemo(() => 
    entries.filter(e => e.id !== editingEntry?.id).flatMap(e => e.studentMentorIds),
    [entries, editingEntry]
  );
  
  const assignedFacultyIds = useMemo(() => 
    entries.filter(e => e.id !== editingEntry?.id).map(e => e.facultyMentorId),
    [entries, editingEntry]
  );

  // Filtering for Faculty/Mentor
  const myEntries = useMemo(() => {
    if (isFacultyOrMentor && user) {
      if (user.role === 'faculty') {
        return entries.filter(e => e.facultyMentorId === user.id);
      } else {
        return entries.filter(e => e.studentMentorIds.includes(user.id));
      }
    }
    return entries;
  }, [entries, user, isFacultyOrMentor]);

  // Today's summary for non-admins
  const todaysClasses = useMemo(() => {
    const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()) as DayOfWeek;
    return myEntries.filter(e => e.day === today).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [myEntries]);

  const handleSave = () => {
    if (!formData.dept || !formData.sectionName || !formData.facultyMentorId || !formData.room) return;

    if (editingEntry) {
      setEntries(prev => prev.map(e => e.id === editingEntry.id ? { ...e, ...formData } as TimetableEntry : e));
    } else {
      const newEntry: TimetableEntry = {
        ...formData,
        id: `tt-${Date.now()}`
      } as TimetableEntry;
      setEntries(prev => [...prev, newEntry]);
    }
    setDialogOpen(false);
    setEditingEntry(null);
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const openEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormData(entry);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" />
            Time Table
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isAdmin ? 'Manage project classes and mentor schedules' : 'View your assigned class schedule'}
          </p>
        </div>

        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { 
                setEditingEntry(null); 
                setFormData({ 
                  day: 'Monday', 
                  startTime: SESSIONS[0].start, 
                  endTime: SESSIONS[0].end, 
                  dept: '', 
                  sectionName: '', 
                  facultyMentorId: '', 
                  studentMentorIds: [], 
                  room: '' 
                }); 
              }}>
                <Plus className="w-4 h-4 mr-2" /> Add Schedule Slot
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingEntry ? 'Edit Slot' : 'Add New Schedule Slot'}</DialogTitle>
                <DialogDescription>Setup a class timing for a section and mentor.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={formData.day}
                      onChange={e => setFormData({ ...formData, day: e.target.value as DayOfWeek })}
                    >
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Room / Location</Label>
                    <Input
                      placeholder="e.g. LHC-101"
                      value={formData.room}
                      onChange={e => setFormData({ ...formData, room: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Session</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={SESSIONS.find(s => s.start === formData.startTime)?.id || '1'}
                    onChange={e => {
                      const session = SESSIONS.find(s => s.id === e.target.value);
                      if (session) {
                        setFormData({ ...formData, startTime: session.start, endTime: session.end });
                      }
                    }}
                  >
                    {SESSIONS.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.label} ({s.start} - {s.end})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input
                      placeholder="e.g. CSE"
                      value={formData.dept}
                      onChange={e => setFormData({ ...formData, dept: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Section Name</Label>
                    <Input
                      placeholder="e.g. Section A"
                      value={formData.sectionName}
                      onChange={e => setFormData({ ...formData, sectionName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Faculty Mentor</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={formData.facultyMentorId}
                    onChange={e => setFormData({ ...formData, facultyMentorId: e.target.value })}
                  >
                    <option value="">Select Faculty</option>
                    {facultyList.map(f => {
                      const isAssigned = assignedFacultyIds.includes(f.id);
                      return (
                        <option key={f.id} value={f.id} disabled={isAssigned}>
                          {f.name} {isAssigned ? '(Already Assigned)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Student Mentors</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                    {studentMentorList.map(m => {
                      const isAssigned = assignedStudentIds.includes(m.id);
                      const isSelected = formData.studentMentorIds?.includes(m.id);
                      return (
                        <label 
                          key={m.id} 
                          className={cn(
                            "flex items-center gap-2 text-xs p-1 rounded transition-colors",
                            isAssigned && !isSelected ? "opacity-50 cursor-not-allowed bg-muted" : "cursor-pointer hover:bg-muted"
                          )}
                        >
                          <input
                            type="checkbox"
                            disabled={isAssigned && !isSelected}
                            checked={isSelected}
                            onChange={e => {
                              const ids = formData.studentMentorIds || [];
                              if (e.target.checked) {
                                setFormData({ ...formData, studentMentorIds: [...ids, m.id] });
                              } else {
                                setFormData({ ...formData, studentMentorIds: ids.filter(id => id !== m.id) });
                              }
                            }}
                          />
                          <span className="truncate">{m.name}</span>
                          {isAssigned && !isSelected && <span className="text-[9px] text-destructive ml-auto">Busy</span>}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Schedule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Notifications / Summary for non-admins */}
      {!isAdmin && isFacultyOrMentor && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Bell className="w-16 h-16" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-primary flex items-center gap-2 mb-3">
                <Bell className="w-5 h-5" /> Today's Schedule
              </h3>
              {todaysClasses.length > 0 ? (
                <div className="space-y-3">
                  {todaysClasses.map(entry => (
                    <div key={entry.id} className="flex gap-3 bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-primary/10">
                      <div className="flex flex-col items-center justify-center bg-primary text-white px-2 py-1 rounded-lg text-[10px] font-bold min-w-[60px]">
                        <span>{entry.startTime}</span>
                        <div className="w-full h-[1px] bg-white/30 my-0.5" />
                        <span>{entry.endTime}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{entry.sectionName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {entry.room}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No classes scheduled for today.</p>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-heading font-semibold flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-muted-foreground" /> Schedule Info
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Weekly Load</span>
                  <span className="font-medium">{myEntries.length} Classes</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Active Sections</span>
                  <span className="font-medium text-primary">
                    {new Set(myEntries.map(e => e.sectionName)).size} Sections
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {/* Grid view for faculty/mentor */}
            <TimetableGrid
              entries={myEntries}
              isAdmin={false}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}

      {/* Admin View / Full Grid */}
      {(isAdmin || !isFacultyOrMentor) && (
        <TimetableGrid
          entries={entries}
          isAdmin={isAdmin}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

interface GridProps {
  entries: TimetableEntry[];
  isAdmin: boolean;
  onEdit: (entry: TimetableEntry) => void;
  onDelete: (id: string) => void;
}

const TimetableGrid: React.FC<GridProps> = ({ entries, isAdmin, onEdit, onDelete }) => {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="py-4 px-4 text-left font-heading text-sm font-semibold w-32">Session</th>
              {DAYS.map(day => (
                <th key={day} className="py-4 px-4 text-center font-heading text-sm font-semibold min-w-[140px]">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SESSIONS.map((session, idx) => (
              <tr key={session.id} className={cn("border-b border-border/50 hover:bg-muted/10 transition-colors", idx % 2 === 0 ? "bg-white dark:bg-card" : "bg-muted/5")}>
                <td className="py-6 px-4 border-r border-border/50">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary">{session.label}</span>
                    <span className="text-[10px] text-muted-foreground italic">{session.start} - {session.end}</span>
                  </div>
                </td>
                {DAYS.map(day => {
                  const items = entries.filter(e => e.day === day && e.startTime === session.start);
                  return (
                    <td key={day} className="p-2 border-r border-border/50 min-h-[120px] align-top">
                      <div className="space-y-2">
                        {items.map(entry => (
                          <div
                            key={entry.id}
                            className={cn(
                              "group relative p-3 rounded-xl border transition-all animate-scale-in",
                              "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-md hover:border-primary/40"
                            )}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-bold text-xs truncate">
                                {entry.sectionName}
                              </p>
                              {isAdmin && (
                                <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                  <button onClick={() => onEdit(entry)} className="p-1 hover:text-primary transition-colors">
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => onDelete(entry.id)} className="p-1 hover:text-destructive transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <p className="text-[10px] text-primary font-bold mb-2">
                              {entry.dept}
                            </p>

                            <div className="space-y-1.5 mb-2">
                              <div className="flex items-center gap-1.5 text-[9px]">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <span className="text-muted-foreground">Faculty:</span>
                                <span className="font-medium text-foreground truncate">
                                  {mockUsers.find(u => u.id === entry.facultyMentorId)?.name || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-start gap-1.5 text-[9px]">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                                <span className="text-muted-foreground">Mentors:</span>
                                <div className="flex flex-col min-w-0">
                                  {entry.studentMentorIds.map(id => (
                                    <span key={id} className="font-medium text-foreground truncate">
                                      {mockUsers.find(u => u.id === id)?.name || "N/A"}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-primary font-medium">
                              <MapPin className="w-2.5 h-2.5" />
                              {entry.room}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
