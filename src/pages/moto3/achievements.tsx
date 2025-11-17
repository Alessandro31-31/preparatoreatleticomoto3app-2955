import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  earned: boolean;
}

export default function Achievements() {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const sessions = localStorage.getItem('moto3_completed_sessions');
    const readiness = localStorage.getItem('moto3_readiness_history');

    const completedSessions = sessions ? JSON.parse(sessions).length : 0;
    const readinessHistory = readiness ? JSON.parse(readiness) : [];
    const avgReadiness = readinessHistory.length > 0
      ? readinessHistory.slice(0, 7).reduce((sum: number, r: any) => sum + r.readinessScore, 0) / Math.min(7, readinessHistory.length)
      : 0;
    const avgHRV = readinessHistory.length > 0
      ? readinessHistory.slice(0, 7).reduce((sum: number, r: any) => sum + (r.hrv || 0), 0) / Math.min(7, readinessHistory.length)
      : 0;

    const achievementsList: Achievement[] = [
      {
        id: 'first-week',
        name: 'Prima Settimana',
        description: 'Completa 10 sessioni di allenamento',
        icon: '🎯',
        target: 10,
        current: completedSessions,
        earned: completedSessions >= 10,
      },
      {
        id: 'month-warrior',
        name: 'Guerriero del Mese',
        description: 'Completa 40 sessioni',
        icon: '💪',
        target: 40,
        current: completedSessions,
        earned: completedSessions >= 40,
      },
      {
        id: 'recovery-master',
        name: 'Maestro del Recupero',
        description: 'Readiness media ≥20/25 per 7 giorni',
        icon: '😴',
        target: 20,
        current: Math.round(avgReadiness),
        earned: avgReadiness >= 20,
      },
      {
        id: 'hrv-champion',
        name: 'Campione HRV',
        description: 'HRV media ≥55ms per 7 giorni',
        icon: '❤️',
        target: 55,
        current: Math.round(avgHRV),
        earned: avgHRV >= 55,
      },
      {
        id: '100-sessions',
        name: '100 Sessioni',
        description: 'Completa 100 sessioni di allenamento',
        icon: '🔥',
        target: 100,
        current: completedSessions,
        earned: completedSessions >= 100,
      },
      {
        id: 'perfect-week',
        name: 'Settimana Perfetta',
        description: 'Completa tutte le 21 sessioni settimanali',
        icon: '⭐',
        target: 21,
        current: 0, // Calcolato dinamicamente in base all'ultima settimana
        earned: false,
      },
      {
        id: 'mental-warrior',
        name: 'Guerriero Mentale',
        description: 'Completa 20 sessioni di mental training',
        icon: '🧠',
        target: 20,
        current: 0,
        earned: false,
      },
      {
        id: 'nutrition-expert',
        name: 'Esperto di Nutrizione',
        description: 'Traccia pasti per 30 giorni consecutivi',
        icon: '🍽️',
        target: 30,
        current: 0,
        earned: false,
      },
      {
        id: 'consistent',
        name: 'Consistenza',
        description: '7 giorni consecutivi di training',
        icon: '📅',
        target: 7,
        current: 0,
        earned: false,
      },
    ];

    setAchievements(achievementsList);
  }, []);

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalPoints = earnedCount * 100;

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-gradient-to-br from-yellow-600 via-amber-500 to-orange-500 text-white px-6 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Trophy className="w-8 h-8" />
            Achievements
          </h1>
          <p className="text-yellow-100">I tuoi traguardi e milestone</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Progress Summary</CardTitle>
            <CardDescription>Il tuo percorso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-600">{earnedCount}</div>
                <div className="text-xs text-muted-foreground">Sbloccati</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{achievements.length}</div>
                <div className="text-xs text-muted-foreground">Totali</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{totalPoints}</div>
                <div className="text-xs text-muted-foreground">Punti</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all"
                  style={{ width: `${(earnedCount / achievements.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-center mt-2 text-muted-foreground">
                {Math.round((earnedCount / achievements.length) * 100)}% completato
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`transition-all ${
                achievement.earned
                  ? 'border-yellow-500 bg-yellow-500/5'
                  : 'opacity-60'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div>
                      <CardTitle className="text-base">{achievement.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {achievement.description}
                      </CardDescription>
                    </div>
                  </div>
                  {achievement.earned && (
                    <Badge className="bg-yellow-600">
                      Earned!
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">
                      {achievement.current}/{achievement.target}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        achievement.earned
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-muted-foreground/30'
                      }`}
                      style={{
                        width: `${Math.min((achievement.current / achievement.target) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {earnedCount === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Inizia il Tuo Viaggio!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Completa le sessioni di allenamento per sbloccare i primi achievement
              </p>
              <Button onClick={() => navigate('/moto3/calendar')}>
                Vai al Calendario
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
