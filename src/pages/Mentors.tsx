import React, { useState } from 'react';
import { mockUsers } from '@/lib/mock-data';
import { User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger
} from '@/components/ui/dialog';
import { Plus, Mail, BookOpen, Users, Trash2, Pencil, AlertTriangle, FileUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

/* ─────────── Mentor Card ─────────── */

const MentorCard: React.FC<{
  mentor: User;
  badgeVariant: 'faculty' | 'mentor';
  badgeLabel: string;
  isAdmin: boolean;
  onEdit: (mentor: User) => void;
  onRemove: (mentor: User) => void;
}> = ({ mentor, badgeVariant, badgeLabel, isAdmin, onEdit, onRemove }) => (
  <div className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow animate-fade-in">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary font-heading">
          {mentor.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium">{mentor.name}</p>
          <p className="text-xs text-muted-foreground">{mentor.department}</p>
        </div>
      </div>
      <Badge variant={badgeVariant}>{badgeLabel}</Badge>
    </div>

    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Mail className="w-3.5 h-3.5" />
        <span>{mentor.email}</span>
      </div>

      {mentor.rollNumber && (
        <p className="text-xs text-muted-foreground">Roll: {mentor.rollNumber}</p>
      )}
    </div>

    {isAdmin && (
      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(mentor)}>
          <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-destructive hover:text-destructive"
          onClick={() => onRemove(mentor)}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
        </Button>
      </div>
    )}
  </div>
);

/* ─────────── Types ─────────── */

type MentorType = 'faculty' | 'student_mentor';
type DialogMode = 'add' | 'edit' | 'remove' | null;

/* ─────────── Page ─────────── */

const Mentors: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [mentors, setMentors] = useState<User[]>(() =>
    mockUsers.filter(u => u.role === 'faculty' || u.role === 'student_mentor')
  );

  // Dialog state
  const [dialogMode, setDialogMode] = useState<DialogMode | 'import'>(null);
  const [importData, setImportData] = useState('');
  const [mentorType, setMentorType] = useState<MentorType>('faculty');
  const [formData, setFormData] = useState({ name: '', email: '', department: '', rollNumber: '' });
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [removingMentor, setRemovingMentor] = useState<User | null>(null);

  const facultyMentors = mentors.filter(u => u.role === 'faculty');
  const studentMentors = mentors.filter(u => u.role === 'student_mentor');

  const resetForm = () => {
    setFormData({ name: '', email: '', department: '', rollNumber: '' });
    setFormError('');
    setMentorType('faculty');
    setEditingId(null);
    setRemovingMentor(null);
  };

  const closeDialog = () => {
    setDialogMode(null);
    resetForm();
  };

  /* ── Add ── */
  const openAdd = () => {
    resetForm();
    setDialogMode('add');
  };

  const handleAdd = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.department.trim()) {
      setFormError('Name, email, and department are required.');
      return;
    }
    const newMentor: User = {
      id: `m-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: mentorType,
      department: formData.department.trim(),

      rollNumber: mentorType === 'student_mentor' ? formData.rollNumber.trim() || undefined : undefined,
    };
    setMentors(prev => [...prev, newMentor]);
    closeDialog();
  };

  /* ── Edit ── */
  const openEdit = (mentor: User) => {
    setEditingId(mentor.id);
    setMentorType(mentor.role as MentorType);
    setFormData({
      name: mentor.name,
      email: mentor.email,
      department: mentor.department || '',

      rollNumber: mentor.rollNumber || '',
    });
    setFormError('');
    setDialogMode('edit');
  };

  const handleEdit = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.department.trim()) {
      setFormError('Name, email, and department are required.');
      return;
    }
    setMentors(prev =>
      prev.map(m =>
        m.id === editingId
          ? {
              ...m,
              name: formData.name.trim(),
              email: formData.email.trim(),
              department: formData.department.trim(),

              rollNumber: mentorType === 'student_mentor' ? formData.rollNumber.trim() || undefined : undefined,
              role: mentorType,
            }
          : m
      )
    );
    closeDialog();
  };

  /* ── Remove ── */
  const openRemove = (mentor: User) => {
    setRemovingMentor(mentor);
    setDialogMode('remove');
  };

  const handleRemove = () => {
    if (removingMentor) {
      setMentors(prev => prev.filter(m => m.id !== removingMentor.id));
    }
    closeDialog();
  };

  /* ── Import ── */
  const handleImport = () => {
    if (!importData.trim()) return;
    
    const lines = importData.trim().split('\n');
    const newMentors: User[] = [];
    
    lines.forEach(line => {
      const [name, email, department, role, roll] = line.split(',').map(s => s.trim());
      if (name && email && role) {
        newMentors.push({
          id: `m-import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          email,
          department: department || 'General',
          role: role.toLowerCase().includes('faculty') ? 'faculty' : 'student_mentor',
          rollNumber: roll || undefined
        });
      }
    });

    if (newMentors.length > 0) {
      setMentors(prev => [...prev, ...newMentors]);
      setImportData('');
      setDialogMode(null);
    }
  };

  /* ── Form Fields (shared between Add & Edit) ── */
  const renderForm = () => (
    <div className="space-y-4 py-2">
      {/* Mentor Type Toggle */}
      <div className="space-y-2">
        <Label>Mentor Type</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMentorType('faculty')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              mentorType === 'faculty'
                ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30 text-blue-700 dark:text-blue-400'
                : 'border-border text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Faculty
          </button>
          <button
            type="button"
            onClick={() => setMentorType('student_mentor')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              mentorType === 'student_mentor'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                : 'border-border text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <Users className="w-4 h-4" /> Student
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mentor-name">Full Name *</Label>
        <Input
          id="mentor-name"
          placeholder={mentorType === 'faculty' ? 'Prof. Name' : 'Student Name'}
          value={formData.name}
          onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mentor-email">Email *</Label>
        <Input
          id="mentor-email"
          type="email"
          placeholder="name@mlrit.ac.in"
          value={formData.email}
          onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mentor-dept">Department *</Label>
        <Input
          id="mentor-dept"
          placeholder="e.g. CSE, ECE, IT"
          value={formData.department}
          onChange={e => setFormData(p => ({ ...p, department: e.target.value }))}
        />
      </div>



      {mentorType === 'student_mentor' && (
        <div className="space-y-2">
          <Label htmlFor="mentor-roll">Roll Number</Label>
          <Input
            id="mentor-roll"
            placeholder="e.g. 22B01A0501"
            value={formData.rollNumber}
            onChange={e => setFormData(p => ({ ...p, rollNumber: e.target.value }))}
          />
        </div>
      )}

      {formError && <p className="text-destructive text-sm">{formError}</p>}
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Mentors</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isAdmin ? 'Manage faculty and student mentors' : 'View faculty and student mentors'}
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setDialogMode('import')}>
              <FileUp className="w-4 h-4 mr-2" /> Import
            </Button>
            <Button onClick={openAdd}>
              <Plus className="w-4 h-4 mr-2" /> Add Mentor
            </Button>
          </div>
        )}
      </div>

      {/* ═══════ Import Dialog ═══════ */}
      <Dialog open={dialogMode === 'import'} onOpenChange={open => { if (!open) setDialogMode(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Mentors</DialogTitle>
            <DialogDescription>
              Paste CSV data: <code>Name, Email, Department, Role (Faculty/Mentor), RollNumber</code>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              className="w-full h-40 p-3 rounded-md border border-input bg-background font-mono text-xs"
              placeholder="Ex: John Doe, john@mlrit.ac.in, CSE, Faculty&#10;Jane Smith, jane@mlrit.ac.in, ECE, Mentor, 22B01A0401"
              value={importData}
              onChange={e => setImportData(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>Cancel</Button>
            <Button onClick={handleImport}>Import All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════ Add / Edit Dialog ═══════ */}
      <Dialog open={dialogMode === 'add' || dialogMode === 'edit'} onOpenChange={open => { if (!open) closeDialog(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {dialogMode === 'edit' ? 'Edit Mentor' : 'Add New Mentor'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'edit'
                ? 'Update the mentor details below.'
                : 'Fill in the details to add a faculty or student mentor.'}
            </DialogDescription>
          </DialogHeader>

          {renderForm()}

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button
              onClick={dialogMode === 'edit' ? handleEdit : handleAdd}
              className={
                mentorType === 'faculty'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }
            >
              {dialogMode === 'edit' ? (
                <><Pencil className="w-4 h-4 mr-1" /> Save Changes</>
              ) : (
                <><Plus className="w-4 h-4 mr-1" /> Add {mentorType === 'faculty' ? 'Faculty' : 'Student'} Mentor</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════ Remove Confirmation Dialog ═══════ */}
      <Dialog open={dialogMode === 'remove'} onOpenChange={open => { if (!open) closeDialog(); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" /> Remove Mentor
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{removingMentor?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemove}>
              <Trash2 className="w-4 h-4 mr-1" /> Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════ Faculty Mentors Section ═══════ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-semibold">Faculty Mentors</h2>
            <p className="text-xs text-muted-foreground">Faculty members assigned to guide project sections</p>
          </div>
          <span className="ml-auto text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full">
            {facultyMentors.length} {facultyMentors.length === 1 ? 'member' : 'members'}
          </span>
        </div>
        {facultyMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facultyMentors.map(mentor => (
              <MentorCard key={mentor.id} mentor={mentor} isAdmin={isAdmin} badgeVariant="faculty" badgeLabel="Faculty Mentor" onEdit={openEdit} onRemove={openRemove} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
            No faculty mentors assigned yet.
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* ═══════ Student Mentors Section ═══════ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-semibold">Student Mentors</h2>
            <p className="text-xs text-muted-foreground">Senior students appointed to mentor project teams</p>
          </div>
          <span className="ml-auto text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full">
            {studentMentors.length} {studentMentors.length === 1 ? 'member' : 'members'}
          </span>
        </div>
        {studentMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentMentors.map(mentor => (
              <MentorCard key={mentor.id} mentor={mentor} isAdmin={isAdmin} badgeVariant="mentor" badgeLabel="Student Mentor" onEdit={openEdit} onRemove={openRemove} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
            No student mentors assigned yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default Mentors;
