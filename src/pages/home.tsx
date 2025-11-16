import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authClient } from "@/lib/auth";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Activity,
  Calendar,
  Clock,
  Dumbbell,
  Heart,
  TrendingUp,
  AlertTriangle,
  Target,
  Timer,
  Wrench,
  BarChart3,
  User,
} from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data?.user) {
        setUser(session.data.user);
      }
      setLoading(false);
    });
  }, []);

  const { data: todayBiometric } = useQuery({
    queryKey: ["biometric-today"],
    queryFn: async () => {
      const res = await apiClient.biometrics.today.$get();
      return res.json();
    },
    enabled: !!user,
  });

  const { data: todayRoutine } = useQuery({
    queryKey: ["routine-today"],
    queryFn: async () => {
      const res = await apiClient.routine.today.$get();
      return res.json();
    },
    enabled: !!user,
  });

  const { data: activeFlags } = useQuery({
    queryKey: ["flags-active"],
    queryFn: async () => {
      const res = await apiClient.flags.active.$get();
      return res.json();
    },
    enabled: !!user,
  });

  const { data: recentSessions } = useQuery({
    queryKey: ["sessions-recent"],
    queryFn: async () => {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const res = await apiClient.training.sessions.$get({
        query: { startDate, endDate },
      });
      return res.json();
    },
    enabled: !!user,
  });

  const currentWeek = Math.ceil(
    (Date.now() - new Date("2025-11-06").getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  const weeklyLoad =
    recentSessions?.sessions?.reduce((sum: number, s: any) => sum + (s.load || 0), 0) || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/10">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
              <Activity className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">
              Moto3 Training Pro
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional Training Management for Moto3 Pilots
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden mb-12 shadow-2xl">
              <img
                src="/moto3-hero.png"
                alt="Moto3 Pilot Training"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Complete 18-Week Training System
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Track workouts, monitor recovery, optimize performance
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild size="lg" className="bg-red-500 hover:bg-red-600">
                    <Link to="/sign-up">Get Started</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/sign-in">Sign In</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-red-500/20 hover:border-red-500/40 transition-colors">
                <CardHeader>
                  <Dumbbell className="w-10 h-10 text-red-500 mb-2" />
                  <CardTitle>Training Management</CardTitle>
                  <CardDescription>
                    18-week periodized program with detailed workout tracking
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-blue-500/20 hover:border-blue-500/40 transition-colors">
                <CardHeader>
                  <Heart className="w-10 h-10 text-blue-500 mb-2" />
                  <CardTitle>Recovery Monitoring</CardTitle>
                  <CardDescription>
                    HRV, sleep quality, and readiness tracking with red flag alerts
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <CardHeader>
                  <TrendingUp className="w-10 h-10 text-purple-500 mb-2" />
                  <CardTitle>Progress Analytics</CardTitle>
                  <CardDescription>
                    Comprehensive charts and milestone tracking for all exercises
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Week {currentWeek} of 18-week training cycle
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Link>
          </Button>
        </div>

        {activeFlags?.flags && activeFlags.flags.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">
              {activeFlags.flags.length} Active Red Flag(s)
            </AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-2">
                {activeFlags.flags.slice(0, 3).map((flag: any) => (
                  <div key={flag.id} className="text-sm">
                    <span className="font-medium">{flag.category}:</span> {flag.description}
                  </div>
                ))}
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-3 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <Link to="/red-flags">View All Flags</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 mb-8">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Week {currentWeek}</div>
              <p className="text-xs text-muted-foreground mt-1">of 18 weeks</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                HRV Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {todayBiometric?.biometric?.hrv || "--"}
                {todayBiometric?.biometric?.hrv && <span className="text-lg">ms</span>}
              </div>
              <Badge
                variant={
                  todayBiometric?.biometric?.hrv
                    ? todayBiometric.biometric.hrv >= 55
                      ? "default"
                      : todayBiometric.biometric.hrv >= 45
                      ? "secondary"
                      : "destructive"
                    : "outline"
                }
                className="mt-1"
              >
                {todayBiometric?.biometric?.hrv
                  ? todayBiometric.biometric.hrv >= 55
                    ? "Optimal"
                    : todayBiometric.biometric.hrv >= 45
                    ? "Fair"
                    : "Low"
                  : "No data"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Weekly Load
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round(weeklyLoad)}</div>
              <p className="text-xs text-muted-foreground mt-1">RPE × Duration</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Morning Stiffness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {todayRoutine?.routine?.delta !== undefined
                  ? `${todayRoutine.routine.delta > 0 ? "+" : ""}${todayRoutine.routine.delta.toFixed(1)}`
                  : "--"}
              </div>
              <Badge
                variant={
                  todayRoutine?.routine?.delta
                    ? todayRoutine.routine.delta >= 2
                      ? "default"
                      : "secondary"
                    : "outline"
                }
                className="mt-1"
              >
                {todayRoutine?.routine?.delta
                  ? todayRoutine.routine.delta >= 2
                    ? "Target met"
                    : "Below target"
                  : "Not done"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow border-red-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Morning Routine</CardTitle>
                <Clock className="w-5 h-5 text-red-500" />
              </div>
              <CardDescription>12-minute mobility protocol</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Start your day right with targeted mobility work
              </p>
              <Button asChild className="w-full bg-red-500 hover:bg-red-600">
                <Link to="/routine">
                  {todayRoutine?.routine ? "View Today's Routine" : "Start Routine"}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-blue-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Today's Training</CardTitle>
                <Dumbbell className="w-5 h-5 text-blue-500" />
              </div>
              <CardDescription>Scheduled workout session</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {recentSessions?.sessions?.[0]?.sessionType || "No session scheduled"}
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link to="/calendar">View Calendar</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-purple-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Monitoring Tools</CardTitle>
                <Wrench className="w-5 h-5 text-purple-500" />
              </div>
              <CardDescription>Track metrics & recovery</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Timer, ACR calculator, HRV monitor, and more
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link to="/tools">Open Tools</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Access key features</CardDescription>
                </div>
                <Target className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" className="h-auto flex-col py-4">
                  <Link to="/calendar">
                    <Calendar className="w-6 h-6 mb-2" />
                    <span className="text-sm">18-Week Calendar</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto flex-col py-4">
                  <Link to="/tools">
                    <Timer className="w-6 h-6 mb-2" />
                    <span className="text-sm">Interval Timer</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto flex-col py-4">
                  <Link to="/preparation">
                    <Activity className="w-6 h-6 mb-2" />
                    <span className="text-sm">Prep & Recovery</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto flex-col py-4">
                  <Link to="/progress">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    <span className="text-sm">Progress</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Last 7 days</CardDescription>
                </div>
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {recentSessions?.sessions && recentSessions.sessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.sessions.slice(0, 5).map((session: any) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{session.sessionName || session.sessionType}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()} • Week {session.weekNumber}
                        </p>
                      </div>
                      {session.completed ? (
                        <Badge variant="default" className="bg-green-500">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent sessions found
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
