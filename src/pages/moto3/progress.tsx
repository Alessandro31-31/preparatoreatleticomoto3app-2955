import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MobileNav } from '@/components/MobileNav';
import { TrendingUp, Target, Activity, Award } from 'lucide-react';

export default function Moto3Progress() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    thisWeek: 0,
    avgReadiness: 0,
    avgHRV: 0,
    currentStreak: 0,
  });

  useEffect(() => {
    // Load completion data
    const sessions = localStorage.getItem('moto3_completed_sessions');
    const readiness = localStorage.getItem('moto3_readiness_history');

    if (sessions) {
      const completed = JSON.parse(sessions);
      setStats(prev => ({
        ...prev,
        totalSessions: completed.length,
      }));
    }

    if (readiness) {
      const history = JSON.parse(readiness);
      const last7 = history.slice(0, 7);
      const avgR = last7.reduce((sum: number, h: any) => sum + h.readinessScore, 0) / last7.length || 0;
      const avgH = last7.reduce((sum: number, h: any) => sum + (h.hrv || 0), 0) / last7.length || 0;

      setStats(prev => ({
        ...prev,
        avgReadiness: avgR,
        avgHRV: avgH,
      }));
    }
  }, []);

  const achievements = [
    { name: 'First Week Complete', earned: stats.totalSessions >= 10, icon: '🎯' },
    { name: 'Month Warrior', earned: stats.totalSessions >= 40, icon: '💪' },
    { name: 'Recovery Master', earned: stats.avgReadiness >= 20, icon: '😴' },
    { name: 'HRV Champion', earned: stats.avgHRV >= 55, icon: '❤️' },
    { name: '100 Sessions', earned: stats.totalSessions >= 100, icon: '🔥' },
    { name: 'Perfect Week', earned: stats.thisWeek >= 15, icon: '⭐' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white px-6 pt-8 pb-12">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">📊 Progress Tracking</h1>
          <p className="text-green-100">Your performance analytics</p>
        </div>
      </div>

      <div className="px-6 -mt-8 mb-6 max-w-screen-xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.totalSessions}</div>
                <div className="text-xs text-muted-foreground">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.avgReadiness.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Avg Readiness</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{stats.avgHRV.toFixed(0)}ms</div>
                <div className="text-xs text-muted-foreground">Avg HRV (7d)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{stats.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 mb-6 max-w-screen-xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Weekly Summary
            </CardTitle>
            <CardDescription>Last 7 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sessions Completed</span>
                <Badge variant="outline">{stats.thisWeek}/21</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${Math.min((stats.thisWeek / 21) * 100, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Strength Progress
            </CardTitle>
            <CardDescription>Track your main lifts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Squat', current: 120, target: 140, unit: 'kg' },
              { name: 'Deadlift', current: 140, target: 160, unit: 'kg' },
              { name: 'Bench Press', current: 80, target: 95, unit: 'kg' },
            ].map((lift) => (
              <div key={lift.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{lift.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {lift.current}/{lift.target} {lift.unit}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(lift.current / lift.target) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Achievements
            </CardTitle>
            <CardDescription>Unlock milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.name}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    achievement.earned
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-muted bg-muted/20 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="text-xs font-medium">{achievement.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <MobileNav />
    </div>
  );
}
