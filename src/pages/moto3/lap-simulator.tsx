import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Gauge, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LapSimulator() {
  const navigate = useNavigate();
  const [targetLap, setTargetLap] = useState('1:45.234');
  const [currentLap, setCurrentLap] = useState('1:46.012');

  const parseTime = (time: string): number => {
    const parts = time.split(':');
    if (parts.length !== 2) return 0;
    const [min, sec] = parts;
    return parseInt(min) * 60 + parseFloat(sec);
  };

  const formatTime = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = (seconds % 60).toFixed(3);
    return `${min}:${sec.padStart(6, '0')}`;
  };

  const targetSeconds = parseTime(targetLap);
  const currentSeconds = parseTime(currentLap);
  const delta = currentSeconds - targetSeconds;
  const percentDiff = targetSeconds > 0 ? ((delta / targetSeconds) * 100) : 0;

  const sectors = [
    { name: 'Sector 1', target: 28.5, current: 28.8, unit: 's' },
    { name: 'Sector 2', target: 42.1, current: 41.9, unit: 's' },
    { name: 'Sector 3', target: 34.6, current: 35.3, unit: 's' },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white px-6 pt-8 pb-6">
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
            <Gauge className="w-8 h-8" />
            Lap Simulator
          </h1>
          <p className="text-red-100">Compare & analyze lap times</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Lap Time Comparison</CardTitle>
            <CardDescription>mm:ss.sss format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Target Lap Time</label>
              <Input
                placeholder="1:45.234"
                value={targetLap}
                onChange={(e) => setTargetLap(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Your Current Lap</label>
              <Input
                placeholder="1:46.012"
                value={currentLap}
                onChange={(e) => setCurrentLap(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delta Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className={`text-6xl font-bold mb-2 ${delta > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {delta > 0 ? '+' : ''}{delta.toFixed(3)}s
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                {delta > 0 ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-red-600" />
                    <span>{percentDiff.toFixed(2)}% slower</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <span>{Math.abs(percentDiff).toFixed(2)}% faster</span>
                  </>
                )}
              </div>
              <div className="mt-4">
                {delta > 0 ? (
                  <Badge variant="destructive">Below Target</Badge>
                ) : delta < 0 ? (
                  <Badge className="bg-green-600">Above Target!</Badge>
                ) : (
                  <Badge variant="outline">On Target</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sector Breakdown</CardTitle>
            <CardDescription>Identify your weak points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sectors.map((sector) => {
              const sectorDelta = sector.current - sector.target;
              return (
                <div key={sector.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{sector.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {sector.current}{sector.unit} / {sector.target}{sector.unit}
                      </span>
                      <Badge
                        variant={sectorDelta > 0 ? 'destructive' : 'default'}
                        className={sectorDelta > 0 ? '' : 'bg-green-600'}
                      >
                        {sectorDelta > 0 ? '+' : ''}{sectorDelta.toFixed(3)}
                      </Badge>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${sectorDelta > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{
                        width: `${Math.min(Math.abs(sectorDelta / sector.target) * 100 + 50, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Heart Rate Zones</CardTitle>
            <CardDescription>Performance during lap</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { zone: 'Zone 1 (Warm-up)', time: '10%', color: 'bg-blue-500' },
                { zone: 'Zone 2 (Aerobic)', time: '25%', color: 'bg-green-500' },
                { zone: 'Zone 3 (Tempo)', time: '40%', color: 'bg-yellow-500' },
                { zone: 'Zone 4 (Threshold)', time: '20%', color: 'bg-orange-500' },
                { zone: 'Zone 5 (Max)', time: '5%', color: 'bg-red-500' },
              ].map((zone) => (
                <div key={zone.zone} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{zone.zone}</span>
                      <span className="text-sm font-medium">{zone.time}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${zone.color}`} style={{ width: zone.time }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">💡 Coaching Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Focus on Sector 3 - largest delta</p>
            <p>• Brake later into Turn 8-9</p>
            <p>• Smoother throttle application in final sector</p>
            <p>• Consider softer rear tire compound</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
