import React from 'react';
import { ProjectStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const statusVariant: Record<ProjectStatus, 'draft' | 'warning' | 'info' | 'success' | 'default' | 'secondary'> = {
  'Draft': 'draft',
  'Student Mentor Review': 'warning',
  'Faculty Review': 'info',
  'Approved': 'success',
  'Submitted to CIE': 'default',
  'Completed': 'success',
};

interface StatusBadgeProps {
  status: ProjectStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
};

export default StatusBadge;
