
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

// Define interfaces for our data
interface ActivityLog {
  id: string;
  action: string;
  user: string;
  userRole: string;
  timestamp: string;
  details?: string;
}

// Mock data generator
const generateMockLogs = (count: number) => {
  const logs: ActivityLog[] = [];
  const actions = [
    'User login',
    'User logout',
    'Course created',
    'Course updated',
    'Student enrolled',
    'Student account created',
    'Staff account created',
    'Password changed',
    'Profile updated',
    'Module completed'
  ];
  
  const users = [
    { name: 'John Smith', role: 'student' },
    { name: 'Jane Doe', role: 'student' },
    { name: 'Robert Johnson', role: 'staff' },
    { name: 'Lisa Chen', role: 'staff' },
    { name: 'Michael Wilson', role: 'admin' },
  ];
  
  const now = new Date();
  
  for (let i = 1; i <= count; i++) {
    // Random user
    const randomUser = users[Math.floor(Math.random() * users.length)];
    // Random action
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    // Random time in the last 7 days
    const randomTime = subDays(now, Math.floor(Math.random() * 7));
    
    logs.push({
      id: `log-${i}`,
      action: randomAction,
      user: randomUser.name,
      userRole: randomUser.role,
      timestamp: format(randomTime, 'yyyy-MM-dd HH:mm:ss'),
      details: Math.random() > 0.5 ? `Additional information for log #${i}` : undefined
    });
  }
  
  // Sort by timestamp (newest first)
  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return logs;
};

const ActivityLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load activity logs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would fetch from Supabase
        // For now, we'll use mock data
        setTimeout(() => {
          const mockLogs = generateMockLogs(50); // 50 logs over 7 days as requested
          setLogs(mockLogs);
          setIsLoading(false);
        }, 800); // Simulate loading delay
      } catch (error) {
        console.error('Error fetching activity logs:', error);
        toast.error('Failed to load activity logs');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Export logs as CSV
  const exportLogsCSV = () => {
    try {
      const headers = ['Action', 'User', 'Role', 'Timestamp', 'Details'];
      const rows = logs.map(log => [
        log.action,
        log.user,
        log.userRole,
        log.timestamp,
        log.details || ''
      ].map(cell => {
        // Handle special characters in CSV
        if (typeof cell === 'string' && (cell.includes(",") || cell.includes("\n") || cell.includes("\""))) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(','));
      
      const csvContent = `${headers.join(',')}\n${rows.join('\n')}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'activity_logs.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Activity logs exported successfully');
    } catch (error) {
      console.error('Error exporting logs:', error);
      toast.error('Failed to export logs');
    }
  };
  
  // Table columns
  const columns = [
    { 
      key: 'timestamp', 
      header: 'Timestamp',
      cell: (log: ActivityLog) => (
        <span>{log.timestamp}</span>
      )
    },
    { key: 'action', header: 'Action' },
    { key: 'user', header: 'User' },
    { 
      key: 'userRole', 
      header: 'Role',
      cell: (log: ActivityLog) => (
        <span className={`capitalize ${
          log.userRole === 'admin' ? 'text-purple-600' : 
          log.userRole === 'staff' ? 'text-green-600' : 
          'text-blue-600'
        }`}>
          {log.userRole}
        </span>
      )
    },
    { 
      key: 'details', 
      header: 'Details',
      cell: (log: ActivityLog) => (
        <span className="text-sm text-muted-foreground">
          {log.details || '—'}
        </span>
      )
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">
            View system activity and user actions.
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>
              Showing last 7 days of activity ({isLoading ? '...' : logs.length} logs)
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2">Loading activity logs...</span>
            </div>
          ) : (
            <DataTable 
              data={logs}
              columns={columns}
              searchKeys={['action', 'user', 'userRole', 'details']}
              itemsPerPage={10}
              emptyMessage="No activity logs found."
              exportOptions={{
                filename: "activity-logs",
                enableCSV: true
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogsPage;
