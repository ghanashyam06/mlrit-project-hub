import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Shield, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    const success = login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  const quickLogin = (role: string) => {
    const emails: Record<string, string> = {
      admin: 'rajesh@mlrit.ac.in',
      faculty: 'anitha@mlrit.ac.in',
      student_mentor: 'saikiran@mlrit.ac.in',
      student: 'akhil@mlrit.ac.in',
    };
    setEmail(emails[role]);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold text-primary-foreground">ProjectSphere</span>
          </div>
          <p className="text-sidebar-muted text-sm">MLRIT Micro Projects Portal</p>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-heading font-bold text-primary-foreground leading-tight">
            Manage. Mentor.<br />
            <span className="text-gradient-primary">Innovate.</span>
          </h1>
          <p className="text-sidebar-muted max-w-md leading-relaxed">
            Centralized platform for managing micro projects, mentor allocation, team formation, and CIE submissions at MLRIT.
          </p>
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-2xl font-bold text-primary-foreground">5000+</p>
              <p className="text-sidebar-muted">Students</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-foreground">1000+</p>
              <p className="text-sidebar-muted">Projects/Year</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-foreground">8</p>
              <p className="text-sidebar-muted">Domains</p>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-sidebar-muted text-xs">© 2025 MLRIT. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold">ProjectSphere</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-heading font-bold">Welcome back</h2>
            <p className="text-muted-foreground mt-1">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@mlrit.ac.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg">
              <Shield className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground text-center">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => quickLogin('admin')} className="text-xs">
                <span className="w-2 h-2 rounded-full bg-destructive mr-1.5" /> Admin
              </Button>
              <Button variant="outline" size="sm" onClick={() => quickLogin('faculty')} className="text-xs">
                <span className="w-2 h-2 rounded-full bg-secondary mr-1.5" /> Faculty
              </Button>
              <Button variant="outline" size="sm" onClick={() => quickLogin('student_mentor')} className="text-xs">
                <span className="w-2 h-2 rounded-full bg-primary mr-1.5" /> Student Mentor
              </Button>
              <Button variant="outline" size="sm" onClick={() => quickLogin('student')} className="text-xs">
                <span className="w-2 h-2 rounded-full bg-warning mr-1.5" /> Student
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
