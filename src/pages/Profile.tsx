import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, Building, Hash, Edit, Save, X, Github, Linkedin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    githubLink: user?.githubLink || '',
    linkedinLink: user?.linkedinLink || '',
  });

  if (!user) return null;

  const roleLabel: Record<string, string> = {
    admin: 'Admin',
    faculty: 'Faculty Mentor',
    student_mentor: 'Student Mentor',
    student: 'Student',
  };

  const roleBadgeVariant: Record<string, 'admin' | 'faculty' | 'mentor' | 'student'> = {
    admin: 'admin',
    faculty: 'faculty',
    student_mentor: 'mentor',
    student: 'student',
  };

  const handleEdit = () => {
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      githubLink: user.githubLink || '',
      linkedinLink: user.linkedinLink || '',
    });
    setEditing(true);
  };

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast({ title: 'Profile updated', description: 'Your profile has been saved successfully.' });
  };

  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Your account information</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary font-heading shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-heading font-bold">{user.name}</h2>
              <Badge variant={roleBadgeVariant[user.role]}>{roleLabel[user.role]}</Badge>
            </div>

            {!editing ? (
              <>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.department && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Building className="w-4 h-4" />
                      <span>{user.department}</span>
                    </div>
                  )}
                  {user.rollNumber && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Hash className="w-4 h-4" />
                      <span>{user.rollNumber}</span>
                    </div>
                  )}
                  {user.githubLink && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Github className="w-4 h-4" />
                      <a href={user.githubLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{user.githubLink}</a>
                    </div>
                  )}
                  {user.linkedinLink && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Linkedin className="w-4 h-4" />
                      <a href={user.linkedinLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{user.linkedinLink}</a>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" className="mt-5" onClick={handleEdit}>
                  <Edit className="w-3.5 h-3.5 mr-2" /> Edit Profile
                </Button>
              </>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Link</Label>
                  <Input id="github" value={form.githubLink} onChange={e => setForm({ ...form, githubLink: e.target.value })} placeholder="https://github.com/username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Link</Label>
                  <Input id="linkedin" value={form.linkedinLink} onChange={e => setForm({ ...form, linkedinLink: e.target.value })} placeholder="https://linkedin.com/in/username" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="w-3.5 h-3.5 mr-2" /> Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="w-3.5 h-3.5 mr-2" /> Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
