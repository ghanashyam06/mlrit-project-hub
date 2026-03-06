import { User, Section, Team, Project, Announcement, UserRole } from './types';

export const mockUsers: User[] = [
  { id: '1', name: 'Dr. Rajesh Kumar', email: 'rajesh@mlrit.ac.in', role: 'admin', department: 'CSE', githubLink: 'https://github.com/rajeshk', linkedinLink: 'https://linkedin.com/in/rajeshk' },
  { id: '2', name: 'Prof. Anitha Sharma', email: 'anitha@mlrit.ac.in', role: 'faculty', department: 'CSE', phone: '9876543210', githubLink: 'https://github.com/anithas', linkedinLink: 'https://linkedin.com/in/anithas' },
  { id: '3', name: 'Prof. Venkat Rao', email: 'venkat@mlrit.ac.in', role: 'faculty', department: 'ECE', phone: '9876543211' },
  { id: '4', name: 'Sai Kiran M', email: 'saikiran@mlrit.ac.in', role: 'student_mentor', rollNumber: '22B01A0501', department: 'CSE', phone: '9876543212', githubLink: 'https://github.com/saikiran', linkedinLink: 'https://linkedin.com/in/saikiran' },
  { id: '5', name: 'Priya Reddy', email: 'priya@mlrit.ac.in', role: 'student_mentor', rollNumber: '22B01A0502', department: 'CSE', phone: '9876543213' },
  { id: '6', name: 'Ravi Teja K', email: 'ravi@mlrit.ac.in', role: 'student_mentor', rollNumber: '22B01A0503', department: 'CSE', phone: '9876543214' },
  { id: '7', name: 'Akhil Sharma', email: 'akhil@mlrit.ac.in', role: 'student', rollNumber: '23B01A0501', department: 'CSE', phone: '9876543215', githubLink: 'https://github.com/akhils', linkedinLink: 'https://linkedin.com/in/akhils' },
  { id: '8', name: 'Meera Joshi', email: 'meera@mlrit.ac.in', role: 'student', rollNumber: '23B01A0502', department: 'CSE', phone: '9876543216', githubLink: 'https://github.com/meeraj' },
  { id: '9', name: 'Rohit Patel', email: 'rohit@mlrit.ac.in', role: 'student', rollNumber: '23B01A0503', department: 'CSE', phone: '9876543217' },
  { id: '10', name: 'Sneha Gupta', email: 'sneha@mlrit.ac.in', role: 'student', rollNumber: '23B01A0504', department: 'CSE', phone: '9876543218', linkedinLink: 'https://linkedin.com/in/snehag' },
];

export const mockSections: Section[] = [
  { id: 's1', name: 'Section A', academicYear: '2024-25', semester: 'Sem 1', facultyMentor: mockUsers[1], studentMentors: [mockUsers[3], mockUsers[4], mockUsers[5]], studentCount: 65 },
  { id: 's2', name: 'Section B', academicYear: '2024-25', semester: 'Sem 1', facultyMentor: mockUsers[2], studentMentors: [mockUsers[3], mockUsers[4], mockUsers[5]], studentCount: 62 },
  { id: 's3', name: 'Section C', academicYear: '2024-25', semester: 'Sem 2', facultyMentor: null, studentMentors: [], studentCount: 58 },
];

export const mockTeams: Team[] = [
  { id: 't1', name: 'Team Alpha', sectionId: 's1', members: [mockUsers[6], mockUsers[7]], leadId: '7', teamSize: 4, projectId: 'p1' },
  { id: 't2', name: 'Team Beta', sectionId: 's1', members: [mockUsers[8], mockUsers[9]], leadId: '9', teamSize: 4, projectId: 'p2' },
];

export const mockProjects: Project[] = [
  { id: 'p1', title: 'Smart Attendance System using Face Recognition', domain: 'Artificial Intelligence', teamId: 't1', sectionId: 's1', academicYear: '2024-25', semester: 'Sem 1', status: 'Completed', githubLink: 'https://github.com/example/smart-attendance', updatedAt: '2024-12-15' },
  { id: 'p2', title: 'IoT-Based Smart Irrigation', domain: 'IoT', teamId: 't2', sectionId: 's1', academicYear: '2024-25', semester: 'Sem 1', status: 'Draft', updatedAt: '2024-12-14' },
  { id: 'p3', title: 'Campus Navigation Chatbot', domain: 'Chatbots', teamId: 't1', sectionId: 's1', academicYear: '2024-25', semester: 'Sem 1', status: 'Approved', githubLink: 'https://github.com/example/campus-chatbot', updatedAt: '2024-12-10' },
  { id: 'p4', title: 'Drone-Based Campus Surveillance', domain: 'Drone Technology', teamId: 't2', sectionId: 's2', academicYear: '2024-25', semester: 'Sem 1', status: 'Student Mentor Review', updatedAt: '2024-12-13' },
  { id: 'p5', title: 'Automated Lab Equipment Tracker', domain: 'Automation', teamId: 't1', sectionId: 's2', academicYear: '2024-25', semester: 'Sem 2', status: 'Completed', githubLink: 'https://github.com/example/lab-tracker', updatedAt: '2024-12-08' },
];

export const mockAnnouncements: Announcement[] = [
  { id: 'a1', title: 'CIE Submission Deadline Extended', content: 'The deadline for CIE submission has been extended to January 15, 2025.', author: 'Dr. Rajesh Kumar', createdAt: '2024-12-15' },
  { id: 'a2', title: 'Mentor Meeting This Friday', content: 'All mentors are requested to attend the weekly review meeting on Friday at 3 PM.', author: 'Dr. Rajesh Kumar', createdAt: '2024-12-12' },
];

export const domainStats = [
  { name: 'Web Dev', count: 180, color: 'hsl(145, 63%, 32%)' },
  { name: 'AI', count: 150, color: 'hsl(215, 80%, 50%)' },
  { name: 'IoT', count: 120, color: 'hsl(0, 72%, 51%)' },
  { name: 'App Dev', count: 110, color: 'hsl(145, 63%, 42%)' },
  { name: 'Robotics', count: 90, color: 'hsl(215, 70%, 60%)' },
  { name: 'Chatbots', count: 85, color: 'hsl(38, 92%, 50%)' },
  { name: 'Automation', count: 75, color: 'hsl(0, 60%, 60%)' },
  { name: 'Drone Tech', count: 60, color: 'hsl(145, 50%, 50%)' },
];

export const currentUser: User = mockUsers[0];
