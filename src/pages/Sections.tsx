import React from 'react';
import { mockSections } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users, UserCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Sections: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Sections</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage sections and mentor assignments</p>
        </div>
        {isAdmin && (
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Add Section
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSections.map(section => (
          <div key={section.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-lg">{section.name}</h3>
              <Badge variant="secondary">{section.academicYear}</Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{section.studentCount} Students</span>
              </div>

              <div className="p-3 rounded-lg bg-gradient-card-blue border border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-1">Faculty Mentor</p>
                {section.facultyMentor ? (
                  <p className="text-sm font-medium">{section.facultyMentor.name}</p>
                ) : (
                  <p className="text-sm text-destructive">Not assigned</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-gradient-card-green border border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-1">Student Mentors ({section.studentMentors.length}/3)</p>
                {section.studentMentors.length > 0 ? (
                  <div className="space-y-1">
                    {section.studentMentors.map(m => (
                      <p key={m.id} className="text-sm">{m.name}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-destructive">Not assigned</p>
                )}
              </div>

              {section.studentMentors.length < 3 || !section.facultyMentor ? (
                <div className="flex items-center gap-1.5 text-xs text-destructive">
                  <UserCheck className="w-3 h-3" />
                  <span>Mentor assignment incomplete</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-primary">
                  <UserCheck className="w-3 h-3" />
                  <span>Fully assigned</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sections;
