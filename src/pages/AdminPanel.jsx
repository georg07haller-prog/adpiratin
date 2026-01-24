import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle,
  Clock, Flag, Eye, ExternalLink, Coins, Users,
  BarChart3, TrendingUp, Upload, Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
  verified: { label: 'Verified', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-400', icon: XCircle },
  reported_to_authority: { label: 'Reported', color: 'bg-[#1e90ff]/20 text-[#1e90ff]', icon: Flag }
};

const violationLabels = {
  fake_price: '💰 Fake Price',
  greenwashing: '🌱 Greenwashing',
  misleading_claims: '🎭 Misleading',
  hidden_fees: '💳 Hidden Fees',
  fake_reviews: '⭐ Fake Reviews',
  dark_pattern: '🕸️ Dark Pattern'
};

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['allReports'],
    queryFn: () => base44.entities.AdReport.list('-created_date', 100)
  });

  const { data: pirates } = useQuery({
    queryKey: ['allPirates'],
    queryFn: () => base44.entities.PirateUser.list('-total_points', 100)
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, points }) => {
      await base44.entities.AdReport.update(id, { status, points_awarded: points });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allReports']);
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadResult(null);
    
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setUploadResult(result.file_url);
    } catch (error) {
      alert('Ошибка загрузки: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const filteredReports = statusFilter === 'all' 
    ? reports 
    : reports?.filter(r => r.status === statusFilter);

  // Stats
  const stats = {
    total: reports?.length || 0,
    pending: reports?.filter(r => r.status === 'pending').length || 0,
    verified: reports?.filter(r => r.status === 'verified').length || 0,
    totalPirates: pirates?.length || 0,
    totalPoints: pirates?.reduce((sum, p) => sum + (p.total_points || 0), 0) || 0
  };

  // Check if admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] flex items-center justify-center p-4">
        <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-white text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-[#8ba3c7] mb-4">
              This area is restricted to AdPiratin administrators.
            </p>
            <Link to={createPageUrl('Dashboard')}>
              <Button className="bg-[#1a2d4a] hover:bg-[#2a4a6a]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" className="text-[#8ba3c7] hover:text-white hover:bg-[#1a2d4a]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">Admin Panel</h1>
            <p className="text-[#8ba3c7] text-sm">Manage reports and pirates</p>
          </div>
        </motion.div>

        {/* Anthem Upload */}
        <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-[#d4af37]" />
              Загрузить аудио гимна
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="anthem-upload"
              />
              <label htmlFor="anthem-upload">
                <Button
                  as="span"
                  disabled={uploading}
                  className="bg-[#d4af37] hover:bg-[#b8962e] text-[#0a1628] font-bold cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Загрузка...' : 'Выбрать MP3 файл'}
                </Button>
              </label>
              
              {uploadResult && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 text-sm mb-2">✅ Файл загружен!</p>
                  <p className="text-[#8ba3c7] text-xs mb-2">Скопируй этот URL в AUDIO_URL в components/island/AnthemPlayer.jsx:</p>
                  <code className="block p-2 bg-[#0a1628] rounded text-[#d4af37] text-xs break-all">
                    {uploadResult}
                  </code>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#1e90ff]/20">
                  <AlertTriangle className="w-5 h-5 text-[#1e90ff]" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{stats.total}</p>
                  <p className="text-[#8ba3c7] text-xs">Total Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{stats.pending}</p>
                  <p className="text-[#8ba3c7] text-xs">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{stats.verified}</p>
                  <p className="text-[#8ba3c7] text-xs">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{stats.totalPirates}</p>
                  <p className="text-[#8ba3c7] text-xs">Pirates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#d4af37]/20">
                  <Coins className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{stats.totalPoints.toLocaleString()}</p>
                  <p className="text-[#8ba3c7] text-xs">Points Awarded</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Table */}
        <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#d4af37]" />
              Ad Reports
            </CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-[#0a1628] border-[#2a4a6a] text-white">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2d4a] border-[#2a4a6a]">
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                <SelectItem value="pending" className="text-white">Pending</SelectItem>
                <SelectItem value="verified" className="text-white">Verified</SelectItem>
                <SelectItem value="rejected" className="text-white">Rejected</SelectItem>
                <SelectItem value="reported_to_authority" className="text-white">Reported</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2a4a6a]">
                    <TableHead className="text-[#8ba3c7]">Date</TableHead>
                    <TableHead className="text-[#8ba3c7]">Advertiser</TableHead>
                    <TableHead className="text-[#8ba3c7]">Violation</TableHead>
                    <TableHead className="text-[#8ba3c7]">Country</TableHead>
                    <TableHead className="text-[#8ba3c7]">Status</TableHead>
                    <TableHead className="text-[#8ba3c7]">Points</TableHead>
                    <TableHead className="text-[#8ba3c7]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports?.map((report) => {
                    const status = statusConfig[report.status] || statusConfig.pending;
                    const StatusIcon = status.icon;
                    
                    return (
                      <TableRow key={report.id} className="border-[#2a4a6a]">
                        <TableCell className="text-[#8ba3c7] text-sm">
                          {format(new Date(report.created_date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-white font-medium">
                          {report.advertiser}
                        </TableCell>
                        <TableCell>
                          <span className="text-[#8ba3c7]">
                            {violationLabels[report.violation_type] || report.violation_type}
                          </span>
                        </TableCell>
                        <TableCell className="text-[#8ba3c7]">
                          {report.country}
                        </TableCell>
                        <TableCell>
                          <Badge className={status.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-[#d4af37] font-medium">
                            {report.points_awarded || 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {report.evidence_url && (
                              <a href={report.evidence_url} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="ghost" className="text-[#8ba3c7] hover:text-white h-8 w-8 p-0">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </a>
                            )}
                            <Select
                              value={report.status}
                              onValueChange={(value) => updateStatusMutation.mutate({ 
                                id: report.id, 
                                status: value,
                                points: value === 'verified' ? (report.points_awarded || 25) + 10 : report.points_awarded
                              })}
                            >
                              <SelectTrigger className="w-28 h-8 bg-[#0a1628] border-[#2a4a6a] text-white text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1a2d4a] border-[#2a4a6a]">
                                <SelectItem value="pending" className="text-white">Pending</SelectItem>
                                <SelectItem value="verified" className="text-white">Verify</SelectItem>
                                <SelectItem value="rejected" className="text-white">Reject</SelectItem>
                                <SelectItem value="reported_to_authority" className="text-white">Report</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            {(!filteredReports || filteredReports.length === 0) && (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-[#5a7a9a] mx-auto mb-3" />
                <p className="text-[#8ba3c7]">No reports found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}