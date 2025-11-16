import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Settings,
  Target,
  Trophy,
  Calendar,
  Weight,
  Ruler,
  Save,
  LogOut,
  Activity,
  Heart,
  Zap,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    category: "Moto3",
    weight: "",
    targetWeight: "",
    startDate: "2025-11-06",
  });

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data?.user) {
        setUser(session.data.user);
        setProfileData({
          name: session.data.user.name || "",
          age: "",
          category: "Moto3",
          weight: "",
          targetWeight: "",
          startDate: "2025-11-06",
        });
      }
    });
  }, []);

  const { data: biometrics } = useQuery({
    queryKey: ["biometrics-profile"],
    queryFn: async () => {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const res = await apiClient.biometrics.$get({ query: { startDate, endDate } });
      return res.json();
    },
    enabled: !!user,
  });

  const { data: sessions } = useQuery({
    queryKey: ["sessions-profile"],
    queryFn: async () => {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const res = await apiClient.training.sessions.$get({ query: { startDate, endDate } });
      return res.json();
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/");
  };

  const handleSave = () => {
    // In a real app, this would save to the API
    setEditing(false);
    console.log("Saving profile:", profileData);
  };

  const currentWeek = Math.ceil(
    (Date.now() - new Date(profileData.startDate).getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  const totalSessions = sessions?.sessions?.length || 0;
  const completedSessions = sessions?.sessions?.filter((s: any) => s.completed).length || 0;
  const avgHRV =
    biometrics?.biometrics?.reduce((sum: number, b: any) => sum + (b.hrv || 0), 0) /
      (biometrics?.biometrics?.filter((b: any) => b.hrv).length || 1) || 0;
  const latestWeight = biometrics?.biometrics?.find((b: any) => b.weight)?.weight || 0;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-5xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
              <User className="w-10 h-10 text-red-500" />
              Il Mio Profilo
            </h1>
            <p className="text-muted-foreground mt-2">
              Gestisci le tue informazioni e monitora i tuoi progressi
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="text-red-500 border-red-500">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Settimana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentWeek}/18</div>
              <p className="text-xs text-muted-foreground mt-1">Ciclo allenamento</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Sessioni
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {completedSessions}/{totalSessions}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Ultimi 30 giorni</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
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
                <Weight className="w-4 h-4" />
                Peso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {latestWeight ? `${latestWeight.toFixed(1)}` : "--"}
                {latestWeight && <span className="text-lg"> kg</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Attuale</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profilo
            </TabsTrigger>
            <TabsTrigger value="targets">
              <Target className="w-4 h-4 mr-2" />
              Obiettivi
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Impostazioni
            </TabsTrigger>
          </TabsList>

          {/* PROFILE TAB */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Informazioni Personali</CardTitle>
                    <CardDescription>I tuoi dati anagrafici e fisici</CardDescription>
                  </div>
                  {!editing ? (
                    <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                      Modifica
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={() => setEditing(false)} variant="outline" size="sm">
                        Annulla
                      </Button>
                      <Button onClick={handleSave} size="sm" className="bg-green-500 hover:bg-green-600">
                        <Save className="w-4 h-4 mr-2" />
                        Salva
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!editing}
                      placeholder="Mario Rossi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user?.email || ""} disabled placeholder="mario@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Età</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profileData.age}
                      onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                      disabled={!editing}
                      placeholder="18"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={profileData.category}
                      onChange={(e) => setProfileData({ ...profileData, category: e.target.value })}
                      disabled={!editing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso Attuale (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={profileData.weight}
                      onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                      disabled={!editing}
                      placeholder="65"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetWeight">Peso Target (kg)</Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      value={profileData.targetWeight}
                      onChange={(e) =>
                        setProfileData({ ...profileData, targetWeight: e.target.value })
                      }
                      disabled={!editing}
                      placeholder="63"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data Inizio Programma</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={profileData.startDate}
                      onChange={(e) => setProfileData({ ...profileData, startDate: e.target.value })}
                      disabled={!editing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data Fine Programma</Label>
                    <Input
                      type="date"
                      value={
                        new Date(
                          new Date(profileData.startDate).getTime() + 18 * 7 * 24 * 60 * 60 * 1000
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                      disabled
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Statistiche Programma</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Giorni Trascorsi</span>
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">{(currentWeek - 1) * 7}</p>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Giorni Rimanenti</span>
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">{18 * 7 - (currentWeek - 1) * 7}</p>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Completamento</span>
                        <Trophy className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">{Math.round((currentWeek / 18) * 100)}%</p>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Tasso Completamento</span>
                        <Activity className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">
                        {totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TARGETS TAB */}
          <TabsContent value="targets">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-500" />
                    Obiettivi Fisici
                  </CardTitle>
                  <CardDescription>Target di composizione corporea e performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="targetWeightGoal">Peso Obiettivo (kg)</Label>
                      <Input
                        id="targetWeightGoal"
                        type="number"
                        defaultValue="63"
                        placeholder="63"
                      />
                      <p className="text-xs text-muted-foreground">
                        Peso ideale per categoria Moto3
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bodyFat">Body Fat % Target</Label>
                      <Input id="bodyFat" type="number" defaultValue="8" placeholder="8-10%" />
                      <p className="text-xs text-muted-foreground">Percentuale grasso corporeo</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hrvTarget">HRV Target (ms)</Label>
                      <Input id="hrvTarget" type="number" defaultValue="60" placeholder="60" />
                      <p className="text-xs text-muted-foreground">
                        Target ≥55ms per ottimo recupero
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sleepTarget">Ore Sonno Target</Label>
                      <Input id="sleepTarget" type="number" defaultValue="8" placeholder="8" />
                      <p className="text-xs text-muted-foreground">Ore per notte (7-9h)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-500" />
                    Obiettivi Forza
                  </CardTitle>
                  <CardDescription>Target di carico per esercizi chiave (Settimana 18)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Box Squat</Label>
                      <Input type="number" defaultValue="100" placeholder="100 kg" />
                    </div>

                    <div className="space-y-2">
                      <Label>Bench Press</Label>
                      <Input type="number" defaultValue="80" placeholder="80 kg" />
                    </div>

                    <div className="space-y-2">
                      <Label>Romanian Deadlift</Label>
                      <Input type="number" defaultValue="90" placeholder="90 kg" />
                    </div>

                    <div className="space-y-2">
                      <Label>Overhead Press</Label>
                      <Input type="number" defaultValue="55" placeholder="55 kg" />
                    </div>

                    <div className="space-y-2">
                      <Label>Trap Bar Jump</Label>
                      <Input type="number" defaultValue="60" placeholder="60 kg" />
                    </div>

                    <div className="space-y-2">
                      <Label>Pull-ups</Label>
                      <Input type="number" defaultValue="15" placeholder="15 reps" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Obiettivi Performance
                  </CardTitle>
                  <CardDescription>Milestone da raggiungere</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Miglioramento HRV +10%", progress: 65 },
                      { name: "Riduzione peso -2kg", progress: 50 },
                      { name: "Aumento forza squat +20kg", progress: 40 },
                      { name: "Box Jump 60cm", progress: 80 },
                      { name: "Readiness costante ≥20/25", progress: 70 },
                    ].map((goal, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{goal.name}</span>
                          <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  Impostazioni Applicazione
                </CardTitle>
                <CardDescription>Personalizza l'esperienza dell'app</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="unitSystem">Sistema Unità</Label>
                    <select
                      id="unitSystem"
                      className="w-full px-3 py-2 border rounded-md bg-background"
                      defaultValue="metric"
                    >
                      <option value="metric">Metrico (kg, cm)</option>
                      <option value="imperial">Imperiale (lbs, inches)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Lingua</Label>
                    <select
                      id="language"
                      className="w-full px-3 py-2 border rounded-md bg-background"
                      defaultValue="it"
                    >
                      <option value="it">Italiano</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Notifiche</h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Promemoria Morning Routine</p>
                        <p className="text-xs text-muted-foreground">Ogni giorno alle 7:00</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Alert HRV Basso</p>
                        <p className="text-xs text-muted-foreground">Quando HRV {'<'} 45ms</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Alert Bandiere Rosse</p>
                        <p className="text-xs text-muted-foreground">Nuove bandiere critiche</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Riepilogo Settimanale</p>
                        <p className="text-xs text-muted-foreground">Ogni domenica sera</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Dati e Privacy</h3>

                    <Button variant="outline" className="w-full justify-start">
                      Esporta Tutti i Dati (JSON)
                    </Button>

                    <Button variant="outline" className="w-full justify-start text-red-500">
                      Elimina Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
