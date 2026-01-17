import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, FileText, Download, Search, Filter, Calendar, User, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuditLog {
  id: string;
  admin_user_id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  created_at: string;
}

interface AuditLogsAdminProps {
  onBack: () => void;
}

const AuditLogsAdmin: React.FC<AuditLogsAdminProps> = ({ onBack }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterEntity, setFilterEntity] = useState<string>('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Error",
        description: "Could not load audit logs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.admin_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesEntity = filterEntity === 'all' || log.entity_type === filterEntity;
    
    return matchesSearch && matchesAction && matchesEntity;
  });

  const uniqueActions = [...new Set(logs.map(l => l.action))];
  const uniqueEntities = [...new Set(logs.map(l => l.entity_type))];

  const getActionColor = (action: string) => {
    if (action.includes('approve')) return 'text-green-500 bg-green-500/10';
    if (action.includes('decline') || action.includes('revoke') || action.includes('delete')) return 'text-red-500 bg-red-500/10';
    if (action.includes('grant') || action.includes('create')) return 'text-blue-500 bg-blue-500/10';
    if (action.includes('update') || action.includes('edit')) return 'text-amber-500 bg-amber-500/10';
    return 'text-gray-500 bg-gray-500/10';
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Admin', 'Action', 'Entity Type', 'Entity ID', 'Details'];
    const rows = filteredLogs.map(log => [
      new Date(log.created_at).toLocaleString(),
      log.admin_email,
      log.action,
      log.entity_type,
      log.entity_id || '',
      JSON.stringify(log.details || {})
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Exported!",
      description: `${filteredLogs.length} logs exported to CSV`,
    });
  };

  const showHeader = onBack && typeof onBack === 'function' && onBack.toString() !== '() => {}';

  return (
    <div className="min-h-screen bg-background">
      {/* Header - only show if onBack is a real function */}
      {showHeader && (
        <div className="glass-header text-foreground p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack}>
                <ArrowLeft className="w-6 h-6 text-primary" />
              </button>
              <h1 className="text-xl font-semibold">Audit Logs</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="glass w-10 h-10 rounded-xl flex items-center justify-center"
              >
                <Download className="w-5 h-5 text-primary" />
              </button>
              <button
                onClick={fetchLogs}
                className="glass w-10 h-10 rounded-xl flex items-center justify-center"
              >
                <RefreshCw className={`w-5 h-5 text-primary ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card rounded-xl p-4 text-center">
            <Activity className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{logs.length}</p>
            <p className="text-xs text-muted-foreground">Total Logs</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <User className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{[...new Set(logs.map(l => l.admin_email))].length}</p>
            <p className="text-xs text-muted-foreground">Active Admins</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {logs.filter(l => new Date(l.created_at) >= new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
            </p>
            <p className="text-xs text-muted-foreground">Last 24h</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 glass-input rounded-xl"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="h-10 glass-input rounded-xl">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>{formatAction(action)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterEntity} onValueChange={setFilterEntity}>
              <SelectTrigger className="h-10 glass-input rounded-xl">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {uniqueEntities.map(entity => (
                  <SelectItem key={entity} value={entity}>{entity}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Logs List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No audit logs found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="glass-card rounded-2xl p-4 border border-border/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                    {formatAction(log.action)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">{log.admin_email}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Entity: <span className="text-foreground">{log.entity_type}</span>
                    {log.entity_id && (
                      <span className="text-xs text-muted-foreground ml-2 font-mono">({log.entity_id.slice(0, 8)}...)</span>
                    )}
                  </p>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="mt-2 p-2 glass rounded-lg">
                      <p className="text-xs text-muted-foreground">Details:</p>
                      <pre className="text-xs text-foreground mt-1 overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsAdmin;
