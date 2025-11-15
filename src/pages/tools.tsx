import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Play, Pause, RotateCcw, Activity, Timer, Calculator, Heart } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function MonitoringTools() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [timerState, setTimerState] = useState({
    work: 30,
    rest: 30,
    rounds: 8,
    currentRound: 1,
    timeLeft: 30,
    isWorking: true,
    isRunning: false,
  });

  const [readinessData, setReadinessData] = useState({
    sleepQuality: [3],
    muscleSoreness: [3],
    stressLevel: [3],
    energyLevel: [3],
    motivation: [3],
  });

  const [hrvInput, setHrvInput] = useState("");
  const [acrData, setAcrData] = useState({ rpe: 7, duration: 60 });

  const { data: biometrics } = useQuery({
    queryKey: ["biometrics"],
    queryFn: async () => {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const res = await apiClient.biometrics.$get({ query: { startDate, endDate } });
      return res.json();
    },
  });

  const saveBiometricMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.biometrics.$post({ json: data });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biometrics"] });
      queryClient.invalidateQueries({ queryKey: ["biometric-today"] });
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerState.isRunning && timerState.timeLeft > 0) {
      interval = setInterval(() => {
        setTimerState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (timerState.isRunning && timerState.timeLeft === 0) {
      if (timerState.isWorking) {
        setTimerState((prev) => ({
          ...prev,
          isWorking: false,
          timeLeft: prev.rest,
        }));
      } else if (timerState.currentRound < timerState.rounds) {
        setTimerState((prev) => ({
          ...prev,
          isWorking: true,
          currentRound: prev.currentRound + 1,
          timeLeft: prev.work,
        }));
      } else {
        setTimerState((prev) => ({ ...prev, isRunning: false }));
      }
    }
    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.timeLeft]);

  const readinessScore =
    readinessData.sleepQuality[0] +
    (6 - readinessData.muscleSoreness[0]) +
    (6 - readinessData.stressLevel[0]) +
    readinessData.energyLevel[0] +
    readinessData.motivation[0];

  const dailyLoad = acrData.rpe * acrData.duration;
  const acuteLoad =
    biometrics?.biometrics
      ?.slice(0, 7)
      .reduce((sum: number, b: any) => sum + (b.readinessScore || 0), 0) / 7 || 0;
  const chronicLoad =
    biometrics?.biometrics
      ?.slice(0, 28)
      .reduce((sum: number, b: any) => sum + (b.readinessScore || 0), 0) / 28 || 0;
  const acrRatio = chronicLoad > 0 ? acuteLoad / chronicLoad : 0;

  const handleSaveReadiness = () => {
    saveBiometricMutation.mutate({
      date: new Date().toISOString().split("T")[0],
      sleepQuality: readinessData.sleepQuality[0],
      muscleSoreness: readinessData.muscleSoreness[0],
      stressLevel: readinessData.stressLevel[0],
      energyLevel: readinessData.energyLevel[0],
      motivation: readinessData.motivation[0],
      hrv: hrvInput ? parseFloat(hrvInput) : undefined,
    });
  };

  const minutes = Math.floor(timerState.timeLeft / 60);
  const seconds = timerState.timeLeft % 60;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">Monitoring Tools</CardTitle>
            <CardDescription>Track readiness, load, and recovery metrics</CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="readiness" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="readiness">
              <Activity className="w-4 h-4 mr-2" />
              Readiness
            </TabsTrigger>
            <TabsTrigger value="timer">
              <Timer className="w-4 h-4 mr-2" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="acr">
              <Calculator className="w-4 h-4 mr-2" />
              ACR
            </TabsTrigger>
            <TabsTrigger value="hrv">
              <Heart className="w-4 h-4 mr-2" />
              HRV
            </TabsTrigger>
          </TabsList>

          <TabsContent value="readiness">
            <Card>
              <CardHeader>
                <CardTitle>Daily Readiness Check</CardTitle>
                <CardDescription>Rate each metric from 1 (poor) to 5 (excellent)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {Object.entries(readinessData).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-2">
                        <label className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
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
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-muted/50 p-6 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Readiness Score</p>
                  <p className="text-5xl font-bold">{readinessScore}/25</p>
                  <Badge
                    variant={readinessScore >= 20 ? "default" : readinessScore >= 15 ? "secondary" : "destructive"}
                    className="mt-3"
                  >
                    {readinessScore >= 20 ? "Excellent" : readinessScore >= 15 ? "Good" : "Below Target"}
                  </Badge>
                  {readinessScore < 15 && (
                    <p className="text-sm text-muted-foreground mt-3">
                      Consider reducing training intensity or adding recovery day
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleSaveReadiness}
                  disabled={saveBiometricMutation.isPending}
                  className="w-full"
                >
                  {saveBiometricMutation.isPending ? "Saving..." : "Save Assessment"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timer">
            <Card>
              <CardHeader>
                <CardTitle>Interval Timer</CardTitle>
                <CardDescription>Customizable work/rest timer for training</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Work (sec)</label>
                    <Input
                      type="number"
                      value={timerState.work}
                      onChange={(e) =>
                        setTimerState({ ...timerState, work: parseInt(e.target.value) || 30 })
                      }
                      disabled={timerState.isRunning}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rest (sec)</label>
                    <Input
                      type="number"
                      value={timerState.rest}
                      onChange={(e) =>
                        setTimerState({ ...timerState, rest: parseInt(e.target.value) || 30 })
                      }
                      disabled={timerState.isRunning}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rounds</label>
                    <Input
                      type="number"
                      value={timerState.rounds}
                      onChange={(e) =>
                        setTimerState({ ...timerState, rounds: parseInt(e.target.value) || 8 })
                      }
                      disabled={timerState.isRunning}
                    />
                  </div>
                </div>

                <div className="bg-muted/50 p-8 rounded-lg text-center">
                  <Badge variant={timerState.isWorking ? "destructive" : "default"} className="mb-4">
                    {timerState.isWorking ? "WORK" : "REST"}
                  </Badge>
                  <div className="text-7xl font-bold mb-2">
                    {minutes}:{seconds.toString().padStart(2, "0")}
                  </div>
                  <p className="text-muted-foreground">
                    Round {timerState.currentRound} / {timerState.rounds}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() =>
                      setTimerState({
                        ...timerState,
                        isRunning: !timerState.isRunning,
                      })
                    }
                    className="flex-1"
                    size="lg"
                  >
                    {timerState.isRunning ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() =>
                      setTimerState({
                        ...timerState,
                        currentRound: 1,
                        timeLeft: timerState.work,
                        isWorking: true,
                        isRunning: false,
                      })
                    }
                    variant="outline"
                    size="lg"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="acr">
            <Card>
              <CardHeader>
                <CardTitle>ACR Calculator</CardTitle>
                <CardDescription>Acute:Chronic Ratio for injury prevention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">RPE (1-10)</label>
                    <Input
                      type="number"
                      value={acrData.rpe}
                      onChange={(e) =>
                        setAcrData({ ...acrData, rpe: parseInt(e.target.value) || 7 })
                      }
                      min={1}
                      max={10}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration (min)</label>
                    <Input
                      type="number"
                      value={acrData.duration}
                      onChange={(e) =>
                        setAcrData({ ...acrData, duration: parseInt(e.target.value) || 60 })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Daily Load</p>
                    <p className="text-2xl font-bold">{dailyLoad}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Acute (7d)</p>
                    <p className="text-2xl font-bold">{acuteLoad.toFixed(0)}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Chronic (28d)</p>
                    <p className="text-2xl font-bold">{chronicLoad.toFixed(0)}</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">ACR Ratio</p>
                  <p className="text-5xl font-bold">{acrRatio.toFixed(2)}</p>
                  <Badge
                    variant={
                      acrRatio >= 0.8 && acrRatio <= 1.3
                        ? "default"
                        : acrRatio >= 0.5 && acrRatio < 1.5
                        ? "secondary"
                        : "destructive"
                    }
                    className="mt-3"
                  >
                    {acrRatio >= 0.8 && acrRatio <= 1.3
                      ? "Sweet Spot (0.8-1.3)"
                      : acrRatio >= 0.5 && acrRatio < 1.5
                      ? "Caution Zone"
                      : "Danger Zone"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hrv">
            <Card>
              <CardHeader>
                <CardTitle>HRV Monitor</CardTitle>
                <CardDescription>Track Heart Rate Variability trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Today's HRV (ms)</label>
                  <Input
                    type="number"
                    value={hrvInput}
                    onChange={(e) => setHrvInput(e.target.value)}
                    placeholder="Enter HRV value"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Target: ≥55ms • Red Flag: &lt;45ms
                  </p>
                </div>

                {hrvInput && (
                  <div className="bg-muted/50 p-6 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-2">Current HRV</p>
                    <p className="text-5xl font-bold">{hrvInput}ms</p>
                    <Badge
                      variant={
                        parseFloat(hrvInput) >= 55
                          ? "default"
                          : parseFloat(hrvInput) >= 45
                          ? "secondary"
                          : "destructive"
                      }
                      className="mt-3"
                    >
                      {parseFloat(hrvInput) >= 55
                        ? "Optimal Recovery"
                        : parseFloat(hrvInput) >= 45
                        ? "Fair Recovery"
                        : "Poor Recovery - Rest Needed"}
                    </Badge>
                  </div>
                )}

                <Button onClick={handleSaveReadiness} className="w-full">
                  Save HRV Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
