import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MobileNav } from '@/components/MobileNav';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ReadinessEntry {
  date: string;
  sleepQuality: number;
  muscleSoreness: number;
  stressLevel: number;
  energyLevel: number;
  motivation: number;
  weight?: number;
  hrv?: number;
  restingHR?: number;
  readinessScore: number;
}

export default function Moto3Readiness() {
  const [readinessData, setReadinessData] = useState({
    sleepQuality: [4],
    muscleSoreness: [2],
    stressLevel: [2],
    energyLevel: [4],
    motivation: [4],
  });

  const [objectives, setObjectives] = useState({
    weight: '',
    hrv: '',
    restingHR: '',
  });

  const [history, setHistory] = useState<ReadinessEntry[]>([]);

  useEffect(() => {
    // Load history from localStorage
    const stored = localStorage.getItem('moto3_readiness_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const readinessScore =
    readinessData.sleepQuality[0] +
    (6 - readinessData.muscleSoreness[0]) +
    (6 - readinessData.stressLevel[0]) +
    readinessData.energyLevel[0] +
    readinessData.motivation[0];

  const getScoreColor = (score: number) => {
    if (score >= 20) return 'text-green-600';
    if (score >= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 20) return 'Excellent';
    if (score >= 15) return 'Good';
    return 'Below Target';
  };

  const handleSave = () => {
    const entry: ReadinessEntry = {
      date: new Date().toISOString().split('T')[0],
      sleepQuality: readinessData.sleepQuality[0],
      muscleSoreness: readinessData.muscleSoreness[0],
      stressLevel: readinessData.stressLevel[0],
      energyLevel: readinessData.energyLevel[0],
      motivation: readinessData.motivation[0],
      weight: objectives.weight ? parseFloat(objectives.weight) : undefined,
      hrv: objectives.hrv ? parseFloat(objectives.hrv) : undefined,
      restingHR: objectives.restingHR ? parseFloat(objectives.restingHR) : undefined,
      readinessScore,
    };

    const newHistory = [entry, ...history.filter(h => h.date !== entry.date)].slice(0, 30);
    setHistory(newHistory);
    localStorage.setItem('moto3_readiness_history', JSON.stringify(newHistory));

    // Update today's stats
    const todayStats = JSON.parse(localStorage.getItem('moto3_today_stats') || '{}');
    todayStats.readiness = readinessScore;
    todayStats.hrv = objectives.hrv ? parseFloat(objectives.hrv) : 0;
    localStorage.setItem('moto3_today_stats', JSON.stringify(todayStats));

    alert('✅ Readiness saved successfully!');
  };

  const getTrend = () => {
    if (history.length < 2) return null;
    const current = readinessScore;
    const previous = history[0].readinessScore;
    const diff = current - previous;

    if (diff > 1) return { icon: TrendingUp, color: 'text-green-600', text: `+${diff.toFixed(1)}` };
    if (diff < -1) return { icon: TrendingDown, color: 'text-red-600', text: diff.toFixed(1) };
    return { icon: Minus, color: 'text-yellow-600', text: 'Stable' };
  };

  const trend = getTrend();
  const avgScore = history.length > 0 ? history.slice(0, 7).reduce((sum, h) => sum + h.readinessScore, 0) / Math.min(7, history.length) : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white px-6 pt-8 pb-12">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">💪 Daily Readiness</h1>
          <p className="text-blue-100">Assess your recovery status</p>
        </div>
      </div>

      <div className="px-6 -mt-8 mb-6 max-w-screen-xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className={`text-6xl font-bold ${getScoreColor(readinessScore)} mb-2`}>
                {readinessScore}/25
              </div>
              <Badge
                variant={readinessScore >= 20 ? 'default' : readinessScore >= 15 ? 'secondary' : 'destructive'}
                className="text-sm"
              >
                {getScoreLabel(readinessScore)}
              </Badge>
              {trend && (
                <div className={`flex items-center justify-center gap-2 mt-3 ${trend.color}`}>
                  <trend.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{trend.text} vs yesterday</span>
                </div>
              )}
            </div>

            {readinessScore < 15 && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 mt-4">
                <p className="text-sm text-red-900 dark:text-red-200">
                  ⚠️ Consider reducing training intensity or adding a recovery day
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="px-6 mb-6 max-w-screen-xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Subjective Metrics</CardTitle>
            <CardDescription>Rate each metric from 1 (poor) to 5 (excellent)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(readinessData).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <label className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <span className="text-lg font-bold">{value[0]}/5</span>
                </div>
                <Slider
                  value={value}
                  onValueChange={(newValue) =>
                    setReadinessData({ ...readinessData, [key]: newValue })
                  }
                  max={5}
                  step={1}
                  min={1}
                  className="cursor-pointer"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Objective Metrics</CardTitle>
            <CardDescription>Optional biometric data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Weight (kg)</label>
              <Input
                type="number"
                step="0.1"
                placeholder="65.0"
                value={objectives.weight}
                onChange={(e) => setObjectives({ ...objectives, weight: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">HRV (ms)</label>
              <Input
                type="number"
                placeholder="55"
                value={objectives.hrv}
                onChange={(e) => setObjectives({ ...objectives, hrv: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Target: ≥55ms • Red Flag: &lt;45ms
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Resting Heart Rate (bpm)</label>
              <Input
                type="number"
                placeholder="60"
                value={objectives.restingHR}
                onChange={(e) => setObjectives({ ...objectives, restingHR: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          Save Assessment
        </Button>

        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent History</CardTitle>
              <CardDescription>Last 7 days • Avg: {avgScore.toFixed(1)}/25</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.slice(0, 7).map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">
                        {new Date(entry.date).toLocaleDateString('it-IT', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {entry.hrv && `HRV: ${entry.hrv}ms`}
                        {entry.weight && ` • Weight: ${entry.weight}kg`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${getScoreColor(entry.readinessScore)}`}>
                        {entry.readinessScore}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <MobileNav />
    </div>
  );
}
