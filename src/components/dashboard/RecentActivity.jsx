import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const statusColors = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Clock },
  verified: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-400', icon: XCircle },
  reported_to_authority: { bg: 'bg-[#1e90ff]/20', text: 'text-[#1e90ff]', icon: AlertTriangle }
};

const violationLabels = {
  fake_price: '💰 Fake Price',
  greenwashing: '🌱 Greenwashing',
  misleading_claims: '🎭 Misleading',
  hidden_fees: '💳 Hidden Fees',
  fake_reviews: '⭐ Fake Reviews',
  dark_pattern: '🕸️ Dark Pattern'
};

export default function RecentActivity({ reports }) {
  const recentReports = reports?.slice(0, 5) || [];

  return (
    <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#8ba3c7]" />
          Recent Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentReports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#8ba3c7] text-sm">No reports yet</p>
            <p className="text-[#5a7a9a] text-xs mt-1">Start hunting those shady ads!</p>
          </div>
        ) : (
          recentReports.map((report, i) => {
            const status = statusColors[report.status] || statusColors.pending;
            const StatusIcon = status.icon;
            
            return (
              <div 
                key={report.id || i}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0a1628]/50 border border-[#2a4a6a]/30"
              >
                <div className={`p-2 rounded-lg ${status.bg}`}>
                  <StatusIcon className={`w-4 h-4 ${status.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {report.advertiser}
                  </p>
                  <p className="text-[#8ba3c7] text-xs">
                    {violationLabels[report.violation_type] || report.violation_type}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={`${status.bg} ${status.text} text-xs`}>
                    {report.status?.replace('_', ' ')}
                  </Badge>
                  {report.points_awarded > 0 && (
                    <p className="text-[#d4af37] text-xs mt-1">+{report.points_awarded} pts</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}