import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EVENT_TYPES = [
  { id: 'raid', label: 'Ad Raid', color: 'from-red-500 to-orange-500' },
  { id: 'hunt', label: 'Deal Hunt', color: 'from-green-500 to-emerald-500' },
  { id: 'tournament', label: 'Tournament', color: 'from-purple-500 to-pink-500' },
  { id: 'meeting', label: 'Clan Meeting', color: 'from-blue-500 to-cyan-500' },
  { id: 'training', label: 'Training', color: 'from-yellow-500 to-orange-500' }
];

export default function EventManager({ clanId, isLeader, userEmail }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'raid',
    start_date: '',
    end_date: '',
    points_reward: 50
  });
  const queryClient = useQueryClient();

  const { data: events = [] } = useQuery({
    queryKey: ['clanEvents', clanId],
    queryFn: () => base44.entities.ClanEvent.filter({ clan_id: clanId }, '-created_date', 10),
    enabled: !!clanId
  });

  const createEventMutation = useMutation({
    mutationFn: (data) => base44.entities.ClanEvent.create({
      ...data,
      clan_id: clanId,
      participants: [],
      status: 'upcoming'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['clanEvents']);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        event_type: 'raid',
        start_date: '',
        end_date: '',
        points_reward: 50
      });
    }
  });

  const joinEventMutation = useMutation({
    mutationFn: ({ eventId, participants }) => 
      base44.entities.ClanEvent.update(eventId, { participants: [...participants, userEmail] }),
    onSuccess: () => queryClient.invalidateQueries(['clanEvents'])
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold text-lg">Clan Events</h3>
        {isLeader && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-[#1e90ff] to-cyan-400 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#8ba3c7]">Event Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Weekend Ad Raid"
                  className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-[#8ba3c7]">Event Type</Label>
                <Select value={formData.event_type} onValueChange={(val) => setFormData(prev => ({ ...prev, event_type: val }))}>
                  <SelectTrigger className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2d4a] border-[#2a4a6a]">
                    {EVENT_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id} className="text-white">{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-[#8ba3c7]">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What will we do in this event?"
                className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="text-[#8ba3c7]">Start Date</Label>
                <Input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-[#8ba3c7]">End Date</Label>
                <Input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-[#8ba3c7]">Points Reward</Label>
                <Input
                  type="number"
                  value={formData.points_reward}
                  onChange={(e) => setFormData(prev => ({ ...prev, points_reward: parseInt(e.target.value) }))}
                  className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setShowForm(false)} className="flex-1 text-[#8ba3c7]">
                Cancel
              </Button>
              <Button
                onClick={() => createEventMutation.mutate(formData)}
                disabled={!formData.title || !formData.start_date || createEventMutation.isPending}
                className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold"
              >
                {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {events.map((event) => {
          const eventType = EVENT_TYPES.find(t => t.id === event.event_type);
          const hasJoined = event.participants?.includes(userEmail);
          const startDate = new Date(event.start_date);
          
          return (
            <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 hover:border-[#d4af37]/30 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`bg-gradient-to-r ${eventType?.color} text-white`}>
                          {eventType?.label}
                        </Badge>
                        <Badge variant="outline" className={`border-${
                          event.status === 'upcoming' ? 'blue' : event.status === 'active' ? 'green' : 'gray'
                        }-500 text-${event.status === 'upcoming' ? 'blue' : event.status === 'active' ? 'green' : 'gray'}-400`}>
                          {event.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-lg">{event.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#8ba3c7] text-sm mb-4">{event.description}</p>
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <span className="flex items-center gap-1 text-[#8ba3c7]">
                      <Clock className="w-4 h-4" />
                      {startDate.toLocaleDateString()} {startDate.toLocaleTimeString()}
                    </span>
                    <span className="flex items-center gap-1 text-[#8ba3c7]">
                      <Users className="w-4 h-4" />
                      {event.participants?.length || 0} joined
                    </span>
                    <span className="flex items-center gap-1 text-[#d4af37]">
                      <Trophy className="w-4 h-4" />
                      +{event.points_reward} pts
                    </span>
                  </div>
                  {!hasJoined && event.status === 'upcoming' && (
                    <Button
                      onClick={() => joinEventMutation.mutate({ eventId: event.id, participants: event.participants || [] })}
                      size="sm"
                      className="bg-gradient-to-r from-[#1e90ff] to-cyan-400 text-white"
                    >
                      Join Event
                    </Button>
                  )}
                  {hasJoined && (
                    <Badge className="bg-green-500/20 text-green-400">✓ Joined</Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-[#5a7a9a] mx-auto mb-4" />
            <p className="text-[#8ba3c7]">No events scheduled yet</p>
          </div>
        )}
      </div>
    </div>
  );
}