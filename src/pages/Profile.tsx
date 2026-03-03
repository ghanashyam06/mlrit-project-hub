import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Building, Hash, Edit } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
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
            </div>

            <Button variant="outline" size="sm" className="mt-5">
              <Edit className="w-3.5 h-3.5 mr-2" /> Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
