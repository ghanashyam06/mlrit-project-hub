import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import FacultyDashboard from '@/components/dashboards/FacultyDashboard';
import MentorDashboard from '@/components/dashboards/MentorDashboard';
import StudentDashboard from '@/components/dashboards/StudentDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'admin': return <AdminDashboard />;
    case 'faculty': return <FacultyDashboard />;
    case 'student_mentor': return <MentorDashboard />;
    case 'student': return <StudentDashboard />;
    default: return null;
  }
};

export default Dashboard;
