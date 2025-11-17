import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileNav } from '@/components/MobileNav';
import {
  Calendar,
  Activity,
  TrendingUp,
  Timer,
  Brain,
  Utensils,
  Video,
  Bike,
  Trophy,
  Gauge,
  Target,
  Sparkles,
  Flame,
  Snowflake,
  Calculator,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface TodayStats {
  readiness: number;
  hrv: number;
  completedSessions: number;
  currentWeek: number;
}

export default function Moto3Home() {
  const navigate = useNavigate();
  const [todayStats, setTodayStats] = useState<TodayStats>({
    readiness: 0,
    hrv: 0,
    completedSessions: 0,
    currentWeek: 1,
  });

  useEffect(() => {
    // Load today's stats from localStorage
    const stored = localStorage.getItem('moto3_today_stats');
    if (stored) {
      setTodayStats(JSON.parse(stored));
    }
  }, []);

  const tools = [
    {
      name: 'Virtual Coach AI',
      description: '15+ years Moto3 experience',
      icon: Sparkles,
      path: '/moto3/virtual-coach',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      name: 'Lap Simulator',
      description: 'Compare & analyze lap times',
      icon: Gauge,
      path: '/moto3/lap-simulator',
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
    {
      name: 'Mental Training',
      description: '6 exercises for focus',
      icon: Brain,
      path: '/moto3/mental-training',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      name: 'Nutrition Diary',
      description: 'Track macros & meals',
      icon: Utensils,
      path: '/moto3/nutrition',
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      name: 'Video Analysis',
      description: 'Riding technique scoring',
      icon: Video,
      path: '/moto3/video-analysis',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      name: 'Bike Setup',
      description: 'Configuration guide',
      icon: Bike,
      path: '/moto3/bike-setup',
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
    },
    {
      name: 'Interval Timer',
      description: 'Custom work/rest timer',
      icon: Timer,
      path: '/tools',
      color: 'text-yellow-600',
      bg: 'bg-yellow-500/10',
    },
    {
      name: 'Achievements',
      description: 'Track your milestones',
      icon: Trophy,
      path: '/moto3/achievements',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ];

  const quickActions = [
    {
      name: 'Morning Routine',
      description: '12-min mobility',
      icon: Activity,
      path: '/routine',
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
    },
    {
      name: 'Today\'s Training',
      description: `Week ${todayStats.currentWeek} Session`,
      icon: Target,
      path: '/moto3/calendar',
      color: 'bg-gradient-to-br from-red-600 to-pink-500',
    },
    {
      name: 'Monitoring Tools',
      description: 'HRV, ACR, Readiness',
      icon: Activity,
      path: '/tools',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white px-6 pt-8 pb-12">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">🏍️ Moto3 Pilot Trainer</h1>
          <p className="text-red-100">18-Week Performance System</p>
        </div>
      </div>

      {/* Today's Summary Card */}
      <div className="px-6 -mt-8 mb-6 max-w-screen-xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Today's Status</span>
              <Badge variant="outline" className="text-xs">
                Week {todayStats.currentWeek}/18
              </Badge>
            </CardTitle>
            <CardDescription>{new Date().toLocaleDateString('it-IT', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {todayStats.readiness || '--'}
                </div>
                <div className="text-xs text-muted-foreground">Readiness</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {todayStats.hrv || '--'}ms
                </div>
                <div className="text-xs text-muted-foreground">HRV</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {todayStats.completedSessions}/3
                </div>
                <div className="text-xs text-muted-foreground">Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-8 max-w-screen-xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.name}
                className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                onClick={() => navigate(action.path)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`${action.color} p-3 rounded-xl`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{action.name}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Preparazione & Recupero */}
      <div className="px-6 mb-8 max-w-screen-xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Preparazione & Recupero</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card
            className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
            onClick={() => navigate('/moto3/warmup')}
          >
            <CardContent className="p-4">
              <div className="bg-orange-500/10 text-orange-500 p-3 rounded-xl w-fit mb-3">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Warmup</h3>
              <p className="text-xs text-muted-foreground">Pre-workout activation</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
            onClick={() => navigate('/moto3/cooldown')}
          >
            <CardContent className="p-4">
              <div className="bg-blue-500/10 text-blue-500 p-3 rounded-xl w-fit mb-3">
                <Snowflake className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Cooldown</h3>
              <p className="text-xs text-muted-foreground">Post-workout recovery</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Strumenti Professionali */}
      <div className="px-6 mb-8 max-w-screen-xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Strumenti Professionali</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card
            className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
            onClick={() => navigate('/moto3/timer')}
          >
            <CardContent className="p-4">
              <div className="bg-red-500/10 text-red-500 p-3 rounded-xl w-fit mb-3">
                <Timer className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Interval Timer</h3>
              <p className="text-xs text-muted-foreground">HIIT & Tabata</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
            onClick={() => navigate('/moto3/acr-calculator')}
          >
            <CardContent className="p-4">
              <div className="bg-purple-500/10 text-purple-500 p-3 rounded-xl w-fit mb-3">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-sm mb-1">ACR Calculator</h3>
              <p className="text-xs text-muted-foreground">Injury prevention</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
            onClick={() => navigate('/moto3/load-tracker')}
          >
            <CardContent className="p-4">
              <div className="bg-teal-500/10 text-teal-500 p-3 rounded-xl w-fit mb-3">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Load Tracker</h3>
              <p className="text-xs text-muted-foreground">Training load monitor</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
            onClick={() => navigate('/moto3/quick-reference')}
          >
            <CardContent className="p-4">
              <div className="bg-slate-500/10 text-slate-500 p-3 rounded-xl w-fit mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Quick Reference</h3>
              <p className="text-xs text-muted-foreground">Protocols & guidelines</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="px-6 mb-8 max-w-screen-xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Advanced Tools</h2>
        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.name}
                className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                onClick={() => navigate(tool.path)}
              >
                <CardContent className="p-4">
                  <div className={`${tool.bg} ${tool.color} p-3 rounded-xl w-fit mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Navigation Cards */}
      <div className="px-6 mb-8 max-w-screen-xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Training Hub</h2>
        <div className="grid grid-cols-1 gap-3">
          <Card
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => navigate('/moto3/calendar')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-red-500" />
                <div>
                  <CardTitle>18-Week Calendar</CardTitle>
                  <CardDescription>Complete training program</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => navigate('/moto3/readiness')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-500" />
                <div>
                  <CardTitle>Readiness Check</CardTitle>
                  <CardDescription>Daily assessment & HRV</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => navigate('/moto3/progress')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>Stats, charts & analytics</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
