import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  BarChart3,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  Heart,
  Scale,
  Activity,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Progress() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("30");
  const [chartType, setChartType] = useState("weight");

  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const { data: biometrics } = useQuery({
    queryKey: ["biometrics", startDate, endDate],
    queryFn: async () => {
      const res = await apiClient.biometrics.$get({ query: { startDate, endDate } });
      return res.json();
    },
  });

  const { data: routines } = useQuery({
    queryKey: ["routines", startDate, endDate],
    queryFn: async () => {
      const res = await apiClient.routine.$get({ query: { startDate, endDate } });
      return res.json();
    },
  });

  const { data: sessions } = useQuery({
    queryKey: ["sessions", startDate, endDate],
    queryFn: async () => {
      const res = await apiClient.training.sessions.$get({ query: { startDate, endDate } });
      return res.json();
    },
  });

  const { data: loadData } = useQuery({
    queryKey: ["load", startDate, endDate],
    queryFn: async () => {
      const res = await apiClient.training.load.$get({ query: { startDate, endDate } });
      return res.json();
    },
  });

  // Calculate statistics
  const stats = {
    avgWeight:
      biometrics?.biometrics?.reduce((sum: number, b: any) => sum + (b.weight || 0), 0) /
        (biometrics?.biometrics?.filter((b: any) => b.weight).length || 1) || 0,
    avgHRV:
      biometrics?.biometrics?.reduce((sum: number, b: any) => sum + (b.hrv || 0), 0) /
        (biometrics?.biometrics?.filter((b: any) => b.hrv).length || 1) || 0,
    avgStiffnessDelta:
      routines?.routines?.reduce((sum: number, r: any) => sum + (r.delta || 0), 0) /
        (routines?.routines?.length || 1) || 0,
    totalLoad:
      sessions?.sessions?.reduce((sum: number, s: any) => sum + (s.load || 0), 0) || 0,
    completedSessions:
      sessions?.sessions?.filter((s: any) => s.completed).length || 0,
    totalSessions: sessions?.sessions?.length || 0,
  };

  // Trends
  const getTrend = (data: any[], key: string) => {
    if (!data || data.length < 2) return "stable";
    const recent = data.slice(-7).filter((d) => d[key]);
    if (recent.length < 2) return "stable";
    const first = recent[0][key];
    const last = recent[recent.length - 1][key];
    const change = ((last - first) / first) * 100;
    if (change > 2) return "up";
    if (change < -2) return "down";
    return "stable";
  };

  const weightTrend = getTrend(biometrics?.biometrics || [], "weight");
  const hrvTrend = getTrend(biometrics?.biometrics || [], "hrv");
  const stiffnessTrend = getTrend(routines?.routines || [], "delta");

  const handleExportPDF = () => {
    // Generate simple text report (in a real app, use jsPDF or similar)
    const report = `
MOTO3 TRAINING PROGRESS REPORT
Generated: ${new Date().toLocaleDateString()}
Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}

SUMMARY STATISTICS
==================
Average Weight: ${stats.avgWeight.toFixed(1)} kg
Average HRV: ${stats.avgHRV.toFixed(0)} ms
Average Stiffness Improvement: ${stats.avgStiffnessDelta.toFixed(1)} points
Total Training Load: ${stats.totalLoad.toFixed(0)}
Completed Sessions: ${stats.completedSessions}/${stats.totalSessions}
Completion Rate: ${((stats.completedSessions / stats.totalSessions) * 100).toFixed(1)}%

WEIGHT DATA
===========
${biometrics?.biometrics
  ?.filter((b: any) => b.weight)
  .map((b: any) => `${b.date}: ${b.weight} kg`)
  .join("\n") || "No data"}

HRV DATA
========
${biometrics?.biometrics
  ?.filter((b: any) => b.hrv)
  .map((b: any) => `${b.date}: ${b.hrv} ms`)
  .join("\n") || "No data"}

MORNING ROUTINE STIFFNESS
=========================
${routines?.routines
  ?.map((r: any) => `${r.date}: Pre ${r.stiffnessPre} → Post ${r.stiffnessPost} (Δ ${r.delta})`)
  .join("\n") || "No data"}

TRAINING SESSIONS
=================
${sessions?.sessions
  ?.map((s: any) => `${s.date} - W${s.weekNumber} - ${s.sessionType} - ${s.completed ? "✓" : "✗"}`)
  .join("\n") || "No data"}
    `.trim();

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `moto3-progress-${endDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-background py-4 md:py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
                Progress & Analysis
              </h1>
              <p className="text-sm text-muted-foreground">Track trends and export reports</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-24 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleExportPDF} className="gap-1">
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
                <Scale className="w-3 h-3" />
                Weight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold">{stats.avgWeight.toFixed(1)}</div>
                <TrendIcon trend={weightTrend} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">kg average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
                <Heart className="w-3 h-3" />
                HRV
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold">{stats.avgHRV.toFixed(0)}</div>
                <TrendIcon trend={hrvTrend} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">ms average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Stiffness Δ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold">
                  {stats.avgStiffnessDelta > 0 && "+"}
                  {stats.avgStiffnessDelta.toFixed(1)}
                </div>
                <TrendIcon trend={stiffnessTrend} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">points avg</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Load
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLoad.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground mt-1">total RPE×min</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="weight" value={chartType} onValueChange={setChartType}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="weight" className="text-xs md:text-sm">
              Weight
            </TabsTrigger>
            <TabsTrigger value="hrv" className="text-xs md:text-sm">
              HRV
            </TabsTrigger>
            <TabsTrigger value="stiffness" className="text-xs md:text-sm">
              Stiffness
            </TabsTrigger>
            <TabsTrigger value="load" className="text-xs md:text-sm">
              Load
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weight">
            <Card>
              <CardHeader>
                <CardTitle>Weight Progression</CardTitle>
                <CardDescription>Body weight tracking over time</CardDescription>
              </CardHeader>
              <CardContent>
                {biometrics?.biometrics?.filter((b: any) => b.weight).length > 0 ? (
                  <div className="space-y-3">
                    {biometrics.biometrics
                      .filter((b: any) => b.weight)
                      .reverse()
                      .map((b: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-24 text-sm text-muted-foreground">
                            {new Date(b.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex-1">
                            <div className="h-8 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500"
                                style={{
                                  width: `${((b.weight - 60) / 20) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-16 text-right font-medium">{b.weight} kg</div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No weight data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hrv">
            <Card>
              <CardHeader>
                <CardTitle>HRV Progression</CardTitle>
                <CardDescription>Heart Rate Variability trends (target: ≥55ms)</CardDescription>
              </CardHeader>
              <CardContent>
                {biometrics?.biometrics?.filter((b: any) => b.hrv).length > 0 ? (
                  <div className="space-y-3">
                    {biometrics.biometrics
                      .filter((b: any) => b.hrv)
                      .reverse()
                      .map((b: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-24 text-sm text-muted-foreground">
                            {new Date(b.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex-1">
                            <div className="h-8 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  b.hrv >= 55
                                    ? "bg-green-500"
                                    : b.hrv >= 45
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{
                                  width: `${Math.min(100, (b.hrv / 80) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-16 text-right font-medium">{b.hrv} ms</div>
                          <Badge
                            variant={
                              b.hrv >= 55 ? "default" : b.hrv >= 45 ? "secondary" : "destructive"
                            }
                            className="w-16 justify-center"
                          >
                            {b.hrv >= 55 ? "Good" : b.hrv >= 45 ? "Fair" : "Low"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No HRV data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stiffness">
            <Card>
              <CardHeader>
                <CardTitle>Morning Stiffness Improvement</CardTitle>
                <CardDescription>Delta (target: ≥2.0 improvement)</CardDescription>
              </CardHeader>
              <CardContent>
                {routines?.routines && routines.routines.length > 0 ? (
                  <div className="space-y-3">
                    {routines.routines.reverse().map((r: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-24 text-sm text-muted-foreground">
                          {new Date(r.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {r.stiffnessPre}
                            </span>
                            <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  r.delta >= 2 ? "bg-green-500" : "bg-orange-500"
                                }`}
                                style={{
                                  width: `${Math.min(100, Math.max(0, (r.delta / 5) * 100))}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {r.stiffnessPost}
                            </span>
                          </div>
                        </div>
                        <div className="w-16 text-right font-medium">
                          {r.delta > 0 ? "+" : ""}
                          {r.delta.toFixed(1)}
                        </div>
                        <Badge
                          variant={r.delta >= 2 ? "default" : "secondary"}
                          className={`w-16 justify-center ${r.delta >= 2 ? "bg-green-500" : ""}`}
                        >
                          {r.delta >= 2 ? "Target" : "Below"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No stiffness data available
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="load">
            <Card>
              <CardHeader>
                <CardTitle>Training Load</CardTitle>
                <CardDescription>Daily load (RPE × Duration) and completion</CardDescription>
              </CardHeader>
              <CardContent>
                {sessions?.sessions && sessions.sessions.length > 0 ? (
                  <div className="space-y-3">
                    {sessions.sessions.reverse().map((s: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-24 text-sm text-muted-foreground">
                          {new Date(s.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex-1">
                          <div className="h-8 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                s.completed ? "bg-purple-500" : "bg-muted-foreground/30"
                              }`}
                              style={{
                                width: `${Math.min(100, ((s.load || 0) / 800) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{s.sessionType}</p>
                        </div>
                        <div className="w-16 text-right font-medium">{s.load || 0}</div>
                        <Badge
                          variant={s.completed ? "default" : "secondary"}
                          className={`w-16 justify-center ${s.completed ? "bg-green-500" : ""}`}
                        >
                          {s.completed ? "Done" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No load data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Training Compliance */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Training Compliance</CardTitle>
            <CardDescription>Session completion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-12 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 flex items-center justify-center text-sm font-medium text-white"
                  style={{
                    width: `${(stats.completedSessions / stats.totalSessions) * 100}%`,
                  }}
                >
                  {stats.completedSessions > 0 &&
                    `${((stats.completedSessions / stats.totalSessions) * 100).toFixed(0)}%`}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {stats.completedSessions}/{stats.totalSessions}
                </p>
                <p className="text-xs text-muted-foreground">sessions completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
