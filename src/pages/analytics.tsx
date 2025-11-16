import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, TrendingUp, Weight, Activity, Heart, Zap } from "lucide-react";

export default function Analytics() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("30");
  const [selectedMetric, setSelectedMetric] = useState("weight");

  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const { data: biometrics } = useQuery({
    queryKey: ["biometrics", startDate, endDate],
    queryFn: async () => {
      const res = await apiClient.biometrics.$get({
        query: { startDate, endDate },
      });
      const data = await res.json();
      return data.biometrics;
    },
  });

  const { data: routines } = useQuery({
    queryKey: ["routines", startDate, endDate],
    queryFn: async () => {
      const res = await apiClient.routine.$get({
        query: { startDate, endDate },
      });
      const data = await res.json();
      return data.routines;
    },
  });

  const { data: loads } = useQuery({
    queryKey: ["loads", startDate, endDate],
    queryFn: async () => {
      const res = await apiClient.biometrics.load.$get({
        query: { startDate, endDate },
      });
      const data = await res.json();
      return data.loads;
    },
  });

  const exportToPDF = () => {
    // Implementazione export PDF
    alert("Funzionalità Export PDF in arrivo!");
  };

  const calculateStats = (data: any[], field: string) => {
    if (!data || data.length === 0) return { avg: 0, min: 0, max: 0, trend: 0 };

    const values = data.map(d => d[field]).filter(v => v !== null && v !== undefined);
    if (values.length === 0) return { avg: 0, min: 0, max: 0, trend: 0 };

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const trend = values.length > 1 ? ((values[values.length - 1] - values[0]) / values[0]) * 100 : 0;

    return { avg, min, max, trend };
  };

  const weightStats = calculateStats(biometrics || [], "weight");
  const hrvStats = calculateStats(biometrics || [], "hrv");
  const readinessStats = calculateStats(biometrics || [], "readinessScore");

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-7xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Indietro
        </Button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analytics e Progressi</h1>
            <p className="text-muted-foreground">
              Analizza i tuoi dati di allenamento e progressi nel tempo
            </p>
          </div>

          <Button onClick={exportToPDF} className="bg-red-500 hover:bg-red-600">
            <Download className="w-4 h-4 mr-2" />
            Esporta PDF
          </Button>
        </div>

        <div className="mb-6">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Ultimi 7 giorni</SelectItem>
              <SelectItem value="14">Ultimi 14 giorni</SelectItem>
              <SelectItem value="30">Ultimi 30 giorni</SelectItem>
              <SelectItem value="90">Ultimi 90 giorni</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Peso Medio</CardTitle>
                <Weight className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weightStats.avg.toFixed(1)} kg</div>
              <p className="text-xs text-muted-foreground mt-1">
                {weightStats.trend >= 0 ? "+" : ""}
                {weightStats.trend.toFixed(1)}% dal periodo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">HRV Medio</CardTitle>
                <Heart className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrvStats.avg.toFixed(0)} ms</div>
              <p className="text-xs text-muted-foreground mt-1">
                Range: {hrvStats.min.toFixed(0)} - {hrvStats.max.toFixed(0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Prontezza Media</CardTitle>
                <Zap className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readinessStats.avg.toFixed(1)}/25</div>
              <p className="text-xs text-muted-foreground mt-1">
                {readinessStats.trend >= 0 ? "+" : ""}
                {readinessStats.trend.toFixed(1)}% dal periodo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Routine Completate</CardTitle>
                <Activity className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{routines?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                negli ultimi {timeRange} giorni
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="weight" className="space-y-6">
          <TabsList>
            <TabsTrigger value="weight">Peso</TabsTrigger>
            <TabsTrigger value="hrv">HRV</TabsTrigger>
            <TabsTrigger value="readiness">Prontezza</TabsTrigger>
            <TabsTrigger value="load">Carico</TabsTrigger>
            <TabsTrigger value="stiffness">Rigidità</TabsTrigger>
          </TabsList>

          <TabsContent value="weight">
            <Card>
              <CardHeader>
                <CardTitle>Progressione Peso</CardTitle>
                <CardDescription>Andamento del peso corporeo nel tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded border-2 border-dashed">
                  <div className="text-center text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                    <p>Grafico peso in arrivo</p>
                    <p className="text-sm">{biometrics?.length || 0} punti dati disponibili</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hrv">
            <Card>
              <CardHeader>
                <CardTitle>Variabilità Frequenza Cardiaca (HRV)</CardTitle>
                <CardDescription>Monitoraggio HRV nel tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded border-2 border-dashed">
                  <div className="text-center text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-2" />
                    <p>Grafico HRV in arrivo</p>
                    <p className="text-sm">Media: {hrvStats.avg.toFixed(0)} ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="readiness">
            <Card>
              <CardHeader>
                <CardTitle>Score di Prontezza</CardTitle>
                <CardDescription>Valutazione giornaliera della prontezza all'allenamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded border-2 border-dashed">
                  <div className="text-center text-muted-foreground">
                    <Zap className="w-12 h-12 mx-auto mb-2" />
                    <p>Grafico prontezza in arrivo</p>
                    <p className="text-sm">Media: {readinessStats.avg.toFixed(1)}/25</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="load">
            <Card>
              <CardHeader>
                <CardTitle>Carico di Allenamento e ACR</CardTitle>
                <CardDescription>Acute:Chronic Ratio e gestione del carico</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded border-2 border-dashed">
                  <div className="text-center text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-2" />
                    <p>Grafico carico e ACR in arrivo</p>
                    <p className="text-sm">{loads?.length || 0} sessioni registrate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stiffness">
            <Card>
              <CardHeader>
                <CardTitle>Rigidità Pre/Post Routine</CardTitle>
                <CardDescription>Delta di rigidità dalle routine mattutine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded border-2 border-dashed">
                  <div className="text-center text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                    <p>Grafico rigidità in arrivo</p>
                    <p className="text-sm">{routines?.length || 0} routine completate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Dati Recenti</CardTitle>
              <CardDescription>Ultime registrazioni biometriche</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {biometrics && biometrics.length > 0 ? (
                  biometrics.slice(0, 5).map((bio: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-muted/30 rounded">
                      <div>
                        <p className="font-medium">{new Date(bio.date).toLocaleDateString('it-IT')}</p>
                        <p className="text-sm text-muted-foreground">
                          Peso: {bio.weight || "N/A"} kg • HRV: {bio.hrv || "N/A"} ms • Prontezza: {bio.readinessScore || "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Sonno: {bio.sleepHours || "N/A"}h</p>
                        <p className="text-sm text-muted-foreground">Qualità: {bio.sleepQuality || "N/A"}/5</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Nessun dato disponibile
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
