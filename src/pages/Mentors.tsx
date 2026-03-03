import React from 'react';
import { mockUsers } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Phone } from 'lucide-react';

const Mentors: React.FC = () => {
  const mentors = mockUsers.filter(u => u.role === 'faculty' || u.role === 'student_mentor');

  const roleLabel: Record<string, string> = {
    faculty: 'Faculty Mentor',
    student_mentor: 'Student Mentor',
  };

  const roleBadge: Record<string, 'faculty' | 'mentor'> = {
    faculty: 'faculty',
    student_mentor: 'mentor',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Mentors</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage faculty and student mentors</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Mentor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mentors.map(mentor => (
          <div key={mentor.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow animate-fade-in">
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
              <Badge variant={roleBadge[mentor.role]}>{roleLabel[mentor.role]}</Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                <span>{mentor.email}</span>
              </div>
              {mentor.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{mentor.phone}</span>
                </div>
              )}
              {mentor.rollNumber && (
                <p className="text-xs text-muted-foreground">Roll: {mentor.rollNumber}</p>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">Edit</Button>
              <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive">Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mentors;
