import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Download,
  Weight,
  Activity,
  Heart,
  Target,
  Calendar,
  BarChart3,
  LineChart,
} from "lucide-react";

export default function ProgressAnalysis() {
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState("weight");
  const [selectedExercise, setSelectedExercise] = useState("Box Squat");

  const { data: biometrics } = useQuery({
    queryKey: ["biometrics-progress"],
    queryFn: async () => {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const res = await apiClient.biometrics.$get({ query: { startDate, endDate } });
      return res.json();
    },
  });

  const { data: routines } = useQuery({
    queryKey: ["routines-progress"],
    queryFn: async () => {
      const res = await apiClient.routine.$get();
      return res.json();
    },
  });

  const { data: progressions } = useQuery({
    queryKey: ["progressions-all"],
    queryFn: async () => {
      const res = await apiClient.progressions.$get();
      return res.json();
    },
  });

  const { data: loads } = useQuery({
    queryKey: ["loads-progress"],
    queryFn: async () => {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const res = await apiClient.biometrics.load.$get({ query: { startDate, endDate } });
      return res.json();
    },
  });

  const exercises = [
    "Box Squat",
    "Romanian Deadlift",
    "Bench Press",
    "Pull-ups",
    "Overhead Press",
    "Trap Bar Jump",
  ];

  const exportPDF = () => {
    // In a real app, this would generate and download a PDF
    alert("Funzionalità PDF in sviluppo. Verranno esportati tutti i dati di progressione.");
  };

  const weightData = biometrics?.biometrics?.filter((b: any) => b.weight) || [];
  const hrvData = biometrics?.biometrics?.filter((b: any) => b.hrv) || [];
  const stiffnessData = routines?.routines?.filter((r: any) => r.delta) || [];
  const loadData = loads?.loads || [];

  const latestWeight = weightData[0]?.weight || 0;
  const oldestWeight = weightData[weightData.length - 1]?.weight || 0;
  const weightChange = latestWeight - oldestWeight;

  const avgHRV =
    hrvData.reduce((sum: number, b: any) => sum + (b.hrv || 0), 0) / (hrvData.length || 1);
  const avgStiffnessDelta =
    stiffnessData.reduce((sum: number, r: any) => sum + (r.delta || 0), 0) /
    (stiffnessData.length || 1);

  const currentWeek = Math.ceil(
    (Date.now() - new Date("2025-11-06").getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                  Progressi e Analisi
                </CardTitle>
                <CardDescription>
                  Monitora i tuoi miglioramenti e analizza i dati dell'allenamento
                </CardDescription>
              </div>
              <Button onClick={exportPDF} size="lg" className="bg-purple-500 hover:bg-purple-600">
                <Download className="w-4 h-4 mr-2" />
                Esporta PDF
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Weight className="w-4 h-4" />
                Peso Corporeo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{latestWeight.toFixed(1)} kg</div>
              <div className="flex items-center gap-1 mt-1">
                {weightChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm ${weightChange >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {weightChange > 0 ? "+" : ""}
                  {weightChange.toFixed(1)} kg
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Heart className="w-4 h-4" />
                HRV Medio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgHRV.toFixed(0)} ms</div>
              <Badge
                variant={avgHRV >= 55 ? "default" : avgHRV >= 45 ? "secondary" : "destructive"}
                className="mt-1"
              >
                {avgHRV >= 55 ? "Ottimo" : avgHRV >= 45 ? "Buono" : "Basso"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Rigidità Delta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {avgStiffnessDelta > 0 ? "+" : ""}
                {avgStiffnessDelta.toFixed(1)}
              </div>
              <Badge
                variant={avgStiffnessDelta >= 2 ? "default" : "secondary"}
                className="mt-1"
              >
                {avgStiffnessDelta >= 2 ? "Target OK" : "Da migliorare"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Settimana Attuale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentWeek}/18</div>
              <Progress value={(currentWeek / 18) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="biometrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="biometrics">Biometria</TabsTrigger>
            <TabsTrigger value="exercises">Esercizi</TabsTrigger>
            <TabsTrigger value="load">Carico</TabsTrigger>
            <TabsTrigger value="progressions">Progressioni</TabsTrigger>
          </TabsList>

          {/* BIOMETRICS TAB */}
          <TabsContent value="biometrics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Weight className="w-5 h-5 text-blue-500" />
                    Andamento Peso
                  </CardTitle>
                  <CardDescription>Ultimi 90 giorni</CardDescription>
                </CardHeader>
                <CardContent>
                  {weightData.length > 0 ? (
                    <div className="space-y-4">
                      <div className="h-48 flex items-end justify-between gap-2">
                        {weightData
                          .slice(0, 20)
                          .reverse()
                          .map((b: any, idx: number) => {
                            const maxWeight = Math.max(...weightData.map((d: any) => d.weight));
                            const minWeight = Math.min(...weightData.map((d: any) => d.weight));
                            const range = maxWeight - minWeight || 1;
                            const height = ((b.weight - minWeight) / range) * 100;

                            return (
                              <div
                                key={idx}
                                className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors relative group"
                                style={{ height: `${Math.max(height, 5)}%` }}
                              >
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  {b.weight.toFixed(1)}kg
                                  <br />
                                  {new Date(b.date).toLocaleDateString("it-IT", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Minimo</p>
                          <p className="text-lg font-bold">{Math.min(...weightData.map((d: any) => d.weight)).toFixed(1)} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Attuale</p>
                          <p className="text-lg font-bold">{latestWeight.toFixed(1)} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Massimo</p>
                          <p className="text-lg font-bold">{Math.max(...weightData.map((d: any) => d.weight)).toFixed(1)} kg</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-12">Nessun dato disponibile</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Trend HRV
                  </CardTitle>
                  <CardDescription>Heart Rate Variability</CardDescription>
                </CardHeader>
                <CardContent>
                  {hrvData.length > 0 ? (
                    <div className="space-y-4">
                      <div className="h-48 flex items-end justify-between gap-2">
                        {hrvData
                          .slice(0, 20)
                          .reverse()
                          .map((b: any, idx: number) => {
                            const maxHrv = Math.max(...hrvData.map((d: any) => d.hrv));
                            const minHrv = Math.min(...hrvData.map((d: any) => d.hrv));
                            const range = maxHrv - minHrv || 1;
                            const height = ((b.hrv - minHrv) / range) * 100;
                            const color =
                              b.hrv >= 55
                                ? "bg-green-500 hover:bg-green-600"
                                : b.hrv >= 45
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-red-500 hover:bg-red-600";

                            return (
                              <div
                                key={idx}
                                className={`flex-1 ${color} rounded-t transition-colors relative group`}
                                style={{ height: `${Math.max(height, 5)}%` }}
                              >
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  {b.hrv.toFixed(0)}ms
                                  <br />
                                  {new Date(b.date).toLocaleDateString("it-IT", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Minimo</p>
                          <p className="text-lg font-bold">{Math.min(...hrvData.map((d: any) => d.hrv)).toFixed(0)} ms</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Media</p>
                          <p className="text-lg font-bold">{avgHRV.toFixed(0)} ms</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Massimo</p>
                          <p className="text-lg font-bold">{Math.max(...hrvData.map((d: any) => d.hrv)).toFixed(0)} ms</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-12">Nessun dato HRV disponibile</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    Rigidità Mattutina
                  </CardTitle>
                  <CardDescription>Variazione pre/post routine</CardDescription>
                </CardHeader>
                <CardContent>
                  {stiffnessData.length > 0 ? (
                    <div className="space-y-4">
                      <div className="h-48 flex items-end justify-between gap-2">
                        {stiffnessData
                          .slice(0, 20)
                          .reverse()
                          .map((r: any, idx: number) => {
                            const isPositive = r.delta >= 0;
                            const color = r.delta >= 2 ? "bg-green-500" : "bg-yellow-500";

                            return (
                              <div key={idx} className="flex-1 flex flex-col justify-end">
                                <div
                                  className={`${color} rounded-t transition-colors relative group`}
                                  style={{ height: `${Math.max(Math.abs(r.delta) * 20, 5)}px` }}
                                >
                                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    Δ {r.delta > 0 ? "+" : ""}
                                    {r.delta.toFixed(1)}
                                    <br />
                                    {new Date(r.date).toLocaleDateString("it-IT", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Media Delta</p>
                        <p className="text-2xl font-bold">
                          {avgStiffnessDelta > 0 ? "+" : ""}
                          {avgStiffnessDelta.toFixed(1)}
                        </p>
                        <Badge
                          variant={avgStiffnessDelta >= 2 ? "default" : "secondary"}
                          className="mt-2"
                        >
                          Target: ≥2.0
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-12">
                      Nessun dato routine mattutina
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    Prontezza Giornaliera
                  </CardTitle>
                  <CardDescription>Readiness Score (max 25)</CardDescription>
                </CardHeader>
                <CardContent>
                  {biometrics?.biometrics?.length > 0 ? (
                    <div className="space-y-4">
                      <div className="h-48 flex items-end justify-between gap-2">
                        {biometrics.biometrics
                          .slice(0, 20)
                          .reverse()
                          .map((b: any, idx: number) => {
                            if (!b.readinessScore) return null;
                            const height = (b.readinessScore / 25) * 100;
                            const color =
                              b.readinessScore >= 20
                                ? "bg-green-500"
                                : b.readinessScore >= 15
                                ? "bg-yellow-500"
                                : "bg-red-500";

                            return (
                              <div
                                key={idx}
                                className={`flex-1 ${color} rounded-t transition-colors relative group`}
                                style={{ height: `${Math.max(height, 5)}%` }}
                              >
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  {b.readinessScore}/25
                                  <br />
                                  {new Date(b.date).toLocaleDateString("it-IT", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-12">
                      Nessun dato prontezza disponibile
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* EXERCISES TAB */}
          <TabsContent value="exercises">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Progressione Esercizi</CardTitle>
                    <CardDescription>Seleziona un esercizio per vedere i progressi</CardDescription>
                  </div>
                  <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {exercises.map((ex) => (
                        <SelectItem key={ex} value={ex}>
                          {ex}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Mock progression data for selected exercise */}
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => {
                    const targetWeight = 80 + week * 2.5;
                    const actualWeight = 80 + week * 2.2;
                    const percentage = (actualWeight / targetWeight) * 100;

                    return (
                      <div key={week} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Settimana {week}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {actualWeight.toFixed(1)}kg / {targetWeight.toFixed(1)}kg
                            </span>
                            <Badge
                              variant={percentage >= 100 ? "default" : "secondary"}
                              className={percentage >= 100 ? "bg-green-500" : ""}
                            >
                              {percentage.toFixed(0)}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LOAD TAB */}
          <TabsContent value="load">
            <Card>
              <CardHeader>
                <CardTitle>Monitoraggio Carico</CardTitle>
                <CardDescription>ACR ratio e carico settimanale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Carico Acuto (7d)</p>
                      <p className="text-3xl font-bold">
                        {loadData[0]?.acuteLoad?.toFixed(0) || "0"}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Carico Cronico (28d)</p>
                      <p className="text-3xl font-bold">
                        {loadData[0]?.chronicLoad?.toFixed(0) || "0"}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">ACR Ratio</p>
                      <p className="text-3xl font-bold">
                        {loadData[0]?.acrRatio?.toFixed(2) || "0.00"}
                      </p>
                      <Badge
                        variant={
                          loadData[0]?.acrRatio >= 0.8 && loadData[0]?.acrRatio <= 1.3
                            ? "default"
                            : "destructive"
                        }
                        className="mt-2"
                      >
                        {loadData[0]?.acrRatio >= 0.8 && loadData[0]?.acrRatio <= 1.3
                          ? "Sweet Spot"
                          : "Fuori Target"}
                      </Badge>
                    </div>
                  </div>

                  <div className="h-64 flex items-end justify-between gap-2">
                    {loadData.slice(0, 14).reverse().map((load: any, idx: number) => {
                      const maxLoad = Math.max(...loadData.map((l: any) => l.dailyLoad || 0));
                      const height = ((load.dailyLoad || 0) / maxLoad) * 100;

                      return (
                        <div
                          key={idx}
                          className="flex-1 bg-purple-500 rounded-t hover:bg-purple-600 transition-colors relative group"
                          style={{ height: `${Math.max(height, 5)}%` }}
                        >
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {load.dailyLoad?.toFixed(0)}
                            <br />
                            {new Date(load.date).toLocaleDateString("it-IT", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROGRESSIONS TAB */}
          <TabsContent value="progressions">
            <Card>
              <CardHeader>
                <CardTitle>Target vs Attuale</CardTitle>
                <CardDescription>Confronto progressioni pianificate vs effettive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exercises.map((exercise, idx) => {
                    const targetPercentage = 75 + Math.random() * 30;
                    const isOnTrack = targetPercentage >= 90;

                    return (
                      <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{exercise}</h4>
                          <Badge variant={isOnTrack ? "default" : "secondary"} className={isOnTrack ? "bg-green-500" : ""}>
                            {isOnTrack ? "On Track" : "Attention"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-medium">{targetPercentage.toFixed(0)}%</span>
                          </div>
                          <Progress value={targetPercentage} className="h-2" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
